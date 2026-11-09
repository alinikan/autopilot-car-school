import type { LessonPage, Question } from '../types.ts';

export type ModelGuide = {
  id: string;
  name: string;
  body: string;
  role: string;
  explanation: string;
  tradeoff: string;
  compare: string;
  memory: string;
  scenario: string;
  power: string;
  practicalDetails?: string[];
  source: string;
  image?: string;
  imageNote?: string;
  photos?: string[];
  knowledgeCheck?: { prompt: string; correct: string; wrong: string[]; why: string };
  price?: { amount: number; year: number; label: string; source: string; note: string };
};
export type BrandCourse = {
  id: string;
  name: string;
  country: string;
  intro: string;
  naming: string;
  warning: string;
  source: string;
  models: ModelGuide[];
  deep: boolean;
  popular?: boolean;
  streetOrder?: number;
  comparisonAnchor?: string;
  workshops?: {
    id: string;
    title: string;
    subtitle: string;
    pages: LessonPage[];
    questions: Omit<Question, 'id'>[];
    source: string;
  }[];
};
