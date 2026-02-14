// --------------------------------------------------------------------------
// Skills
// --------------------------------------------------------------------------
export interface Skill {
  name: string;
  level: number;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}
