// Types
export type {
  Profile,
  Project,
  ProjectImages,
  Skill,
  SkillCategory,
  SkillsData,
  Experience,
  Testimonial,
  PitchKey,
  PitchBlock,
  AboutValue,
} from "./types";

// Schemas Zod
export {
  profileSchema,
  updateProfileSchema,
  pitchSchema,
  socialSchema,
  createProjectSchema,
  updateProjectSchema,
  projectImagesSchema,
  createSkillSchema,
  createSkillCategorySchema,
  updateSkillSchema,
  updateSkillCategorySchema,
  createExperienceSchema,
  updateExperienceSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./schemas";

export type {
  ProfileSchemaType,
  UpdateProfileSchemaType,
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
  CreateSkillSchemaType,
  CreateSkillCategorySchemaType,
  UpdateSkillSchemaType,
  UpdateSkillCategorySchemaType,
  CreateExperienceSchemaType,
  UpdateExperienceSchemaType,
  CreateTestimonialSchemaType,
  UpdateTestimonialSchemaType,
} from "./schemas";
