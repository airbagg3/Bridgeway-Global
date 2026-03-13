export interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Consultation {
  id: number;
  title: string;
  contact: string;
  email: string;
  content: string;
  created_at: string;
}

export type ThemeConfig = {
  primary: string;
  background: string;
  text: string;
  accent: string;
};
