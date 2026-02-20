// --------------------------------------------------------------------------
// AiPrompt
// --------------------------------------------------------------------------
export interface AiPrompt {
  id: string;
  target: "profile" | "experience" | "projects";
  prompt: string;
  temperature: number;
  model: string;
}
