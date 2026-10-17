export type Language = 'pt' | 'en' | 'es';

export type ThemeId = 'espresso' | 'doppio-volt' | 'paper-roast' | 'cold-brew';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  accentColor: string;
  bgColor: string;
  previewClass: string;
}

export type ViewTab = 'home' | 'docs' | 'tutorials' | 'blog' | 'doppio';

export interface DocParam {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface DocSection {
  id: string;
  category: 'Início' | 'Caffeine Core' | 'Doppio IDE' | 'Física & ECS' | 'Render & Shaders' | 'Scripting';
  title: string;
  summary: string;
  badge?: string;
  content: string;
  codeSnippets?: {
    lang: string;
    label: string;
    code: string;
  }[];
  params?: DocParam[];
  seeAlso?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: 'Release' | 'Arquitetura' | 'Shaders & Arte' | 'Performance';
  coverImage?: string;
  content: string[];
  keyHighlights: string[];
}

export interface InteractiveStep {
  stepNumber: number;
  title: string;
  instruction: string;
  code: string;
  activeLanguage: 'csharp' | 'cpp' | 'node';
  defaultParams: {
    speed: number;
    gravity: number;
    particleCount: number;
    bounce: number;
    bloom: number;
  };
  taskExplanation: string;
}

export interface InteractiveTutorial {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  category: string;
  summary: string;
  steps: InteractiveStep[];
}
