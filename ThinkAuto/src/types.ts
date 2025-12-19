export interface Category {
  id: string;
  name: string;
  icon: string;
  theme: {
    primary: string;
    background: string;
    accent: string;
  };
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'choice';
  options?: string[];
}

export interface ConsultationData {
  categoryId: string;
  problemDescription: string;
  answers: Record<string, string>;
}
