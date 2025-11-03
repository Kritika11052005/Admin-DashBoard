export interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  cvScore: number;
  isPaid: boolean;
  careerStage: 'Fresher' | 'Graduate' | 'Experienced';
  createdAt: Date;
  updatedAt: Date;
}

export interface CVAnalysis {
  _id: string;
  userId: string;
  score: number;
  analysisDate: Date;
  improvements: number;
  createdAt: Date;
}

export interface Feedback {
  _id: string;
  userId: string;
  rating: number;
  satisfaction: 'Very Satisfied' | 'Satisfied' | 'Neutral' | 'Dissatisfied' | 'Very Dissatisfied';
  comment: string;
  category: 'Platform' | 'Analysis' | 'Support' | 'Features';
  createdAt: Date;
}

export interface KPIData {
  totalUsers: number;
  totalAnalyses: number;
  avgCVScore: number;
  totalFeedback: number;
  paidUserPercentage: number;
  userGrowth: number; // percentage
}

export interface CountryDistribution {
  country: string;
  count: number;
  percentage: number;
}

export interface CVTrend {
  date: string;
  count: number;
  avgScore: number;
}

export interface PaidVsFree {
  type: 'Paid' | 'Free';
  count: number;
  percentage: number;
}

export interface TopUser {
  rank: number;
  name: string;
  email: string;
  cvScore: number;
  country: string;
  isPaid: boolean;
}

export interface CareerStageData {
  stage: string;
  count: number;
  percentage: number;
}