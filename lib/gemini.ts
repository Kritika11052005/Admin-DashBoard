import OpenAI from 'openai';

const XAI_API_KEY = process.env.XAI_API_KEY || '';

if (!XAI_API_KEY) {
  console.warn('⚠️ XAI_API_KEY not found in environment variables');
}

// Grok uses OpenAI-compatible API
const client = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export async function generateAIInsights(analyticsData: {
  totalUsers: number;
  paidUsers: number;
  avgCVScore: number;
  avgFeedbackRating: number;
  conversionRate: number;
  recentAnalyses: number;
  topCountry: string;
  dominantCareerStage: string;
  countryDistribution: Array<{ country: string; count: number }>;
  careerStageBreakdown: Array<{ stage: string; count: number }>;
}) {
  if (!XAI_API_KEY) {
    throw new Error('XAI_API_KEY not configured');
  }

  try {
    const prompt = `You are an expert data analyst specializing in SaaS analytics and business intelligence. Analyze the following dashboard metrics from AariyaTech, a CV/resume analysis platform, and provide 5-7 actionable insights.

**Platform Metrics:**
- Total Users: ${analyticsData.totalUsers}
- Paid Users: ${analyticsData.paidUsers} (${analyticsData.conversionRate.toFixed(1)}% conversion rate)
- Average CV Score: ${analyticsData.avgCVScore.toFixed(1)}/100
- Average User Satisfaction: ${analyticsData.avgFeedbackRating.toFixed(1)}/5 stars
- Recent Analyses (30 days): ${analyticsData.recentAnalyses}
- Top Country: ${analyticsData.topCountry}
- Dominant Career Stage: ${analyticsData.dominantCareerStage}

**Country Distribution:**
${analyticsData.countryDistribution.slice(0, 5).map(c => `- ${c.country}: ${c.count} users`).join('\n')}

**Career Stage Breakdown:**
${analyticsData.careerStageBreakdown.map(s => `- ${s.stage}: ${s.count} users`).join('\n')}

**Instructions:**
Generate exactly 5-7 insights in JSON format. Each insight must follow this exact structure:

{
  "type": "success" | "warning" | "critical" | "info",
  "category": "Revenue" | "User Success" | "User Satisfaction" | "Engagement" | "Growth" | "Product" | "Prediction",
  "title": "Brief, impactful title (max 60 chars)",
  "description": "Detailed analysis with specific numbers and context (100-150 chars)",
  "impact": "high" | "medium" | "low" | "positive",
  "actionable": true | false,
  "recommendation": "Specific, actionable recommendation (100-150 chars)"
}

**Guidelines:**
1. Be data-driven - reference specific numbers from the metrics
2. Identify both strengths and opportunities for improvement
3. Consider industry benchmarks (e.g., SaaS conversion rates typically 2-5%)
4. Prioritize insights by business impact
5. Make recommendations specific and implementable
6. Use professional, confident language
7. Return ONLY a valid JSON array of insights, no markdown formatting

Return format: [insight1, insight2, ...]`;

    console.log('🚀 Generating insights with Grok AI...');

    const completion = await client.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SaaS analytics consultant. Provide insights in valid JSON array format only, with no markdown formatting or code blocks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content || '[]';
    
    // Clean up response - remove markdown if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse the response
    let insights;
    try {
      const parsed = JSON.parse(cleanedText);
      
      // Handle different response formats
      if (Array.isArray(parsed)) {
        insights = parsed;
      } else if (parsed.insights && Array.isArray(parsed.insights)) {
        insights = parsed.insights;
      } else if (typeof parsed === 'object') {
        // Try to find an array in the object
        const arrayValue = Object.values(parsed).find(v => Array.isArray(v));
        insights = arrayValue || [];
      } else {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Failed to parse Grok response:', responseText);
      throw new Error('Invalid JSON response from Grok');
    }

    // Validate insights structure
    if (!Array.isArray(insights) || insights.length === 0) {
      throw new Error('No insights generated');
    }

    console.log(`✅ Successfully generated ${insights.length} insights using Grok`);
    return insights;

  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Grok AI Error:', err.message);

    // Provide helpful error messages
    if (err.message.includes('API key') || err.message.includes('401')) {
      throw new Error('Invalid Grok API key. Get one at https://console.x.ai');
    }
    if (err.message.includes('quota') || err.message.includes('429')) {
      throw new Error('Grok API rate limit reached. Please try again in a moment.');
    }
    if (err.message.includes('402')) {
      throw new Error('Grok API billing issue. Check your account at https://console.x.ai');
    }

    throw new Error('Failed to generate AI insights');
  }
}

// Fallback function for when AI fails
export function getFallbackInsights(analyticsData: {
  totalUsers: number;
  conversionRate: number;
  avgCVScore: number;
  avgFeedbackRating: number;
  recentAnalyses: number;
}) {
  const insights = [];

  // Conversion Rate Analysis
  if (analyticsData.conversionRate < 2) {
    insights.push({
      type: 'critical',
      category: 'Revenue',
      title: 'Critical: Very Low Conversion Rate',
      description: `Only ${analyticsData.conversionRate.toFixed(1)}% conversion. Immediate action needed to improve monetization.`,
      impact: 'high',
      actionable: true,
      recommendation: 'Launch targeted free trial campaign and add pricing page optimization with clear value props.',
    });
  } else if (analyticsData.conversionRate < 5) {
    insights.push({
      type: 'warning',
      category: 'Revenue',
      title: 'Conversion Rate Below Industry Average',
      description: `${analyticsData.conversionRate.toFixed(1)}% conversion. Industry average is 2-5%. Room for improvement.`,
      impact: 'high',
      actionable: true,
      recommendation: 'A/B test pricing models, add social proof, and implement exit-intent upgrade prompts.',
    });
  } else {
    insights.push({
      type: 'success',
      category: 'Revenue',
      title: 'Strong Conversion Performance',
      description: `${analyticsData.conversionRate.toFixed(1)}% conversion rate exceeds industry standards. Excellent monetization.`,
      impact: 'positive',
      actionable: false,
      recommendation: 'Document winning strategies and scale successful conversion tactics across all touchpoints.',
    });
  }

  // CV Score Analysis
  if (analyticsData.avgCVScore < 65) {
    insights.push({
      type: 'critical',
      category: 'User Success',
      title: 'Low CV Quality Scores',
      description: `Average score ${analyticsData.avgCVScore.toFixed(1)}/100. Users struggling to create quality resumes.`,
      impact: 'high',
      actionable: true,
      recommendation: 'Add real-time suggestions, professional templates, and guided CV builder to improve outcomes.',
    });
  } else if (analyticsData.avgCVScore < 75) {
    insights.push({
      type: 'warning',
      category: 'User Success',
      title: 'CV Scores Need Improvement',
      description: `Average score ${analyticsData.avgCVScore.toFixed(1)}/100. Users need better guidance and tools.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Implement AI-powered recommendations and industry-specific best practices library.',
    });
  } else if (analyticsData.avgCVScore >= 80) {
    insights.push({
      type: 'success',
      category: 'User Success',
      title: 'Exceptional CV Quality',
      description: `Outstanding average score of ${analyticsData.avgCVScore.toFixed(1)}/100. Users creating top-tier resumes.`,
      impact: 'positive',
      actionable: false,
      recommendation: 'Feature success stories in marketing and create case studies from high-performing users.',
    });
  } else {
    insights.push({
      type: 'success',
      category: 'User Success',
      title: 'Strong CV Quality',
      description: `Good average score of ${analyticsData.avgCVScore.toFixed(1)}/100. Users creating quality resumes.`,
      impact: 'positive',
      actionable: false,
      recommendation: 'Continue current approach while testing incremental improvements to push scores higher.',
    });
  }

  // User Satisfaction Analysis
  if (analyticsData.avgFeedbackRating >= 4.5) {
    insights.push({
      type: 'success',
      category: 'User Satisfaction',
      title: 'Excellent User Satisfaction',
      description: `Outstanding ${analyticsData.avgFeedbackRating.toFixed(1)}/5 rating. Users love your product.`,
      impact: 'positive',
      actionable: false,
      recommendation: 'Activate referral program and request App Store/reviews from satisfied users.',
    });
  } else if (analyticsData.avgFeedbackRating >= 4.0) {
    insights.push({
      type: 'success',
      category: 'User Satisfaction',
      title: 'Strong User Satisfaction',
      description: `Solid ${analyticsData.avgFeedbackRating.toFixed(1)}/5 rating shows good product-market fit.`,
      impact: 'positive',
      actionable: true,
      recommendation: 'Collect testimonials from happy users and address common friction points to reach 4.5+.',
    });
  } else if (analyticsData.avgFeedbackRating >= 3.5) {
    insights.push({
      type: 'warning',
      category: 'User Satisfaction',
      title: 'Moderate Satisfaction Levels',
      description: `${analyticsData.avgFeedbackRating.toFixed(1)}/5 rating indicates room for improvement in user experience.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Conduct user interviews to identify pain points and prioritize UX improvements.',
    });
  } else {
    insights.push({
      type: 'critical',
      category: 'User Satisfaction',
      title: 'Low User Satisfaction',
      description: `${analyticsData.avgFeedbackRating.toFixed(1)}/5 rating. Urgent attention needed to improve user experience.`,
      impact: 'high',
      actionable: true,
      recommendation: 'Immediately review negative feedback, fix critical issues, and reach out to dissatisfied users.',
    });
  }

  // Engagement Analysis
  const engagementPerUser = analyticsData.totalUsers > 0 
    ? analyticsData.recentAnalyses / analyticsData.totalUsers 
    : 0;

  if (engagementPerUser > 1.5) {
    insights.push({
      type: 'success',
      category: 'Engagement',
      title: 'High User Engagement',
      description: `${analyticsData.recentAnalyses} analyses (${engagementPerUser.toFixed(1)} per user) shows strong product adoption.`,
      impact: 'positive',
      actionable: false,
      recommendation: 'Maintain momentum with regular feature updates and engagement campaigns.',
    });
  } else if (engagementPerUser > 0.5) {
    insights.push({
      type: 'info',
      category: 'Engagement',
      title: 'Moderate Activity Levels',
      description: `${analyticsData.recentAnalyses} analyses in last 30 days. Average engagement detected.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Launch re-engagement email campaign and add weekly usage reminders to boost activity.',
    });
  } else {
    insights.push({
      type: 'warning',
      category: 'Engagement',
      title: 'Low User Activity',
      description: `Only ${analyticsData.recentAnalyses} analyses recently. Users not fully utilizing the platform.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Create onboarding sequence, send activation emails, and add in-app usage prompts.',
    });
  }

  // Growth & Scale Analysis
  if (analyticsData.totalUsers > 1000) {
    insights.push({
      type: 'info',
      category: 'Growth',
      title: 'Scaling Infrastructure Required',
      description: `With ${analyticsData.totalUsers.toLocaleString()} users, prepare for next growth phase.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Review server capacity, optimize database queries, and plan for 2-3x user growth.',
    });
  } else if (analyticsData.totalUsers > 500) {
    insights.push({
      type: 'success',
      category: 'Growth',
      title: 'Strong Growth Trajectory',
      description: `${analyticsData.totalUsers} users achieved. Approaching key milestone of 1,000 users.`,
      impact: 'positive',
      actionable: true,
      recommendation: 'Accelerate marketing efforts and prepare infrastructure for scaling to 1,000+ users.',
    });
  } else {
    insights.push({
      type: 'info',
      category: 'Growth',
      title: 'Early Growth Phase',
      description: `${analyticsData.totalUsers} users. Focus on product-market fit and user acquisition.`,
      impact: 'medium',
      actionable: true,
      recommendation: 'Invest in content marketing, SEO, and user testimonials to drive organic growth.',
    });
  }

  // Market Opportunity
  insights.push({
    type: 'info',
    category: 'Prediction',
    title: 'AI-Powered Resume Market Growing',
    description: 'AI resume tools market projected to grow 25% annually. Position for expansion.',
    impact: 'medium',
    actionable: true,
    recommendation: 'Expand AI features, add ATS optimization, and develop mobile app to capture market share.',
  });

  return insights.slice(0, 7);
}