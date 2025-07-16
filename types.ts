export interface ContactInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedinUrl: string | null;
}

export interface WebSource {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web: WebSource;
}
