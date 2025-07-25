
export interface StoryStep {
  id: number;
  paragraph: string;
  image: string;
  choices: string[];
  selectedChoiceIndex: number | null;
  promptForImage: string;
}

export type GameState = 'SETUP' | 'PLAYING' | 'HISTORY';

export interface StoryGenerationResponse {
  story: string;
  choices: string[];
}
