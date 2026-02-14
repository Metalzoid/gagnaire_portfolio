import type { Profile } from "./profile";

// --------------------------------------------------------------------------
// About - Pitch & Values
// --------------------------------------------------------------------------
export type PitchKey = keyof Profile["pitch"];

export interface PitchBlock {
  key: PitchKey;
  icon: string;
  title: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}
