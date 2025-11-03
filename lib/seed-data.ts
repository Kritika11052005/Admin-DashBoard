import { faker } from '@faker-js/faker';

// Countries with realistic distribution
const COUNTRIES = [
  { name: 'India', weight: 35 },
  { name: 'United States', weight: 20 },
  { name: 'United Kingdom', weight: 12 },
  { name: 'Canada', weight: 10 },
  { name: 'Australia', weight: 8 },
  { name: 'Germany', weight: 5 },
  { name: 'Singapore', weight: 4 },
  { name: 'UAE', weight: 3 },
  { name: 'France', weight: 2 },
  { name: 'Netherlands', weight: 1 },
];

const CAREER_STAGES = ['Fresher', 'Graduate', 'Experienced'];
const SATISFACTION_LEVELS = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'];
const FEEDBACK_CATEGORIES = ['Platform', 'Analysis', 'Support', 'Features'];

// Weighted random selection
function weightedRandom<T extends { name: string; weight: number }>(items: T[]): string {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    if (random < item.weight) return item.name;
    random -= item.weight;
  }
  return items[0].name;
}

// Generate random date in last 6 months
function randomDateInRange(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

export function generateUsers(count: number = 200) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const isPaid = Math.random() > 0.7; // 30% paid users
    const careerStage = CAREER_STAGES[Math.floor(Math.random() * CAREER_STAGES.length)];
    
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      country: weightedRandom(COUNTRIES),
      cvScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      isPaid,
      careerStage,
      createdAt: randomDateInRange(180), // Last 6 months
      updatedAt: new Date(),
    });
  }
  
  return users;
}

export function generateCVAnalyses(userIds: string[], analysesPerUser: number = 3) {
  const analyses = [];
  
  for (const userId of userIds) {
    const numAnalyses = Math.floor(Math.random() * analysesPerUser) + 1;
    
    for (let i = 0; i < numAnalyses; i++) {
      analyses.push({
        userId,
        score: Math.floor(Math.random() * 40) + 60,
        analysisDate: randomDateInRange(180),
        improvements: Math.floor(Math.random() * 15) + 5,
        createdAt: randomDateInRange(180),
      });
    }
  }
  
  return analyses;
}

export function generateFeedback(userIds: string[], feedbackPerUser: number = 1) {
  const feedbacks = [];
  
  // Only 40% of users give feedback
  const feedbackUsers = userIds.filter(() => Math.random() > 0.6);
  
  for (const userId of feedbackUsers) {
    const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars (mostly positive)
    
    feedbacks.push({
      userId,
      rating,
      satisfaction: SATISFACTION_LEVELS[5 - rating] || 'Satisfied',
      comment: faker.lorem.sentence(),
      category: FEEDBACK_CATEGORIES[Math.floor(Math.random() * FEEDBACK_CATEGORIES.length)],
      createdAt: randomDateInRange(180),
    });
  }
  
  return feedbacks;
}