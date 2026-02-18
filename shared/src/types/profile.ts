// --------------------------------------------------------------------------
// Profile
// --------------------------------------------------------------------------
export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  bio: string;
  pitch: {
    who: string;
    what: string;
    why: string;
    method: string;
  };
  photo: string;
  social: SocialLink[];
  cv: string;
}
