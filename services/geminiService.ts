
import { GoogleGenAI, Type } from "@google/genai";
import { StoryStep, StoryGenerationResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "A single paragraph continuing the story. It should be engaging and descriptive.",
    },
    choices: {
      type: Type.ARRAY,
      description: "Exactly three distinct, imaginative, and logical choices for the user to continue the story. Each choice should lead to a unique narrative path.",
      items: { type: Type.STRING },
    },
  },
  required: ["story", "choices"],
};

const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `Epic fantasy illustration, cinematic lighting, highly detailed. A visual representation of: ${prompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image was generated.");
  } catch (error) {
    console.error("Image generation failed, returning placeholder:", error);
    // Return a placeholder on failure
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1280/720`;
  }
};


const generateStoryAndChoices = async (prompt: string): Promise<StoryGenerationResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are an interactive storytelling engine. Your goal is to create a branching narrative based on user choices.
      - Generate a single, compelling story paragraph based on the user's history and latest choice.
      - Then, provide exactly three distinct, creative, and logical choices for what can happen next.
      - Ensure your response strictly adheres to the JSON schema provided.
      - The story should be engaging for all ages.
      - Do not break the fourth wall or refer to the user directly.`,
      responseMimeType: "application/json",
      responseSchema: storyGenerationSchema,
    },
  });

  const jsonText = response.text.trim();
  const parsed = JSON.parse(jsonText);
  return parsed as StoryGenerationResponse;
};

export const generateInitialStep = async (protagonist: string, setting: string): Promise<StoryStep> => {
    const prompt = `Start a new story with the following elements. Generate the first paragraph and three starting choices.
    - Protagonist: "${protagonist}"
    - Setting: "${setting}"`;

    const { story, choices } = await generateStoryAndChoices(prompt);
    const imagePrompt = `${protagonist} in ${setting}. ${story}`;
    const image = await generateImage(imagePrompt);

    return {
        id: Date.now(),
        paragraph: story,
        image,
        choices,
        selectedChoiceIndex: null,
        promptForImage: imagePrompt,
    };
};

export const generateNextStep = async (protagonist: string, setting: string, history: StoryStep[]): Promise<StoryStep> => {
    const simplifiedHistory = history.map(step => ({
        paragraph: step.paragraph,
        choiceMade: step.selectedChoiceIndex !== null ? step.choices[step.selectedChoiceIndex] : "N/A"
    }));
    
    const latestChoice = simplifiedHistory[simplifiedHistory.length - 1].choiceMade;

    const prompt = `Continue the story based on the history and the user's latest choice.
    - Protagonist: "${protagonist}"
    - Setting: "${setting}"
    - Story History: ${JSON.stringify(simplifiedHistory)}
    - User's latest choice: "${latestChoice}"
    
    Generate the next story paragraph and three new choices.`;

    const { story, choices } = await generateStoryAndChoices(prompt);
    const imagePrompt = `${protagonist} in ${setting}. ${story}`;
    const image = await generateImage(imagePrompt);

    return {
        id: Date.now(),
        paragraph: story,
        image,
        choices,
        selectedChoiceIndex: null,
        promptForImage: imagePrompt,
    };
};
