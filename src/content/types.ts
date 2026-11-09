export type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  image?: string;
  imageNote?: string;
  badge?: string;
  shape?: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  unit: number;
  minutes: number;
  kind: string;
  pages: LessonPage[];
  questions: Question[];
  source?: string;
  image?: string;
  activity?: string;
  trackId?: string;
  outcomes?: string[];
  sources?: { label: string; url: string }[];
  recap?: string[];
  match?: { name: string; description: string; image?: string }[];
};

export type LessonPage = {
  title: string;
  text: string;
  example: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  image?: string;
  imageNote?: string;
  photos?: string[];
  prices?: { label: string; amount: number; year: number; source: string; note: string }[];
};
