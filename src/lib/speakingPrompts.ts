export interface SpeakingPrompt {
  id: string;
  category: 'INTERVIEW' | 'ROLEPLAY' | 'PUBLIC SPEAKING' | 'IELTS PRACTICE';
  title: string;
  instructions: string;
  estimatedTime: string;
  keywords: string[];
  sampleStarter: string;
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'interview-intro',
    category: 'INTERVIEW',
    title: 'Introduce yourself and talk about your career goals.',
    instructions: 'Describe your professional background, strengths, key achievements, and why you want to improve your spoken English.',
    estimatedTime: '2 mins',
    keywords: ['background', 'experience', 'strengths', 'ambition', 'skills', 'growth'],
    sampleStarter: 'Good morning/afternoon. My name is... and I have a background in...',
  },
  {
    id: 'roleplay-restaurant',
    category: 'ROLEPLAY',
    title: 'Ordering food at a high-end restaurant in Delhi.',
    instructions: 'Greet the waiter, ask for signature dish recommendations, request adjustments for dietary preferences, and politely ask for the bill.',
    estimatedTime: '2 mins',
    keywords: ['recommendation', 'chef special', 'dietary', 'appetizer', 'bill', 'compliments'],
    sampleStarter: 'Excuse me, could we please see the menu? Could you recommend your specialty?',
  },
  {
    id: 'public-speaking-continuous-learning',
    category: 'PUBLIC SPEAKING',
    title: 'The importance of continuous learning and soft skills.',
    instructions: 'Explain why technical expertise alone is insufficient in modern workplaces and why communication and emotional intelligence are crucial.',
    estimatedTime: '3 mins',
    keywords: ['adaptability', 'soft skills', 'communication', 'leadership', 'future', 'empathy'],
    sampleStarter: 'Ladies and gentlemen, in a fast-paced world driven by AI and automation...',
  },
  {
    id: 'interview-conflict',
    category: 'INTERVIEW',
    title: 'Describe a time you handled a disagreement with a team member.',
    instructions: 'Use the STAR method (Situation, Task, Action, Result) to explain how you resolved a workplace disagreement professionally.',
    estimatedTime: '2.5 mins',
    keywords: ['situation', 'resolution', 'listen', 'compromise', 'perspective', 'outcome'],
    sampleStarter: 'In my previous project, we encountered a difference of opinion regarding...',
  },
  {
    id: 'roleplay-hotel-checkin',
    category: 'ROLEPLAY',
    title: 'Checking into an international airport hotel with a reservation issue.',
    instructions: 'Politely inform the front desk manager that your confirmed booking is not showing in their computer system and request a quiet room.',
    estimatedTime: '2 mins',
    keywords: ['reservation', 'confirmation number', 'quiet room', 'check-in', 'courtesy'],
    sampleStarter: 'Hello, I have a confirmed reservation under the name...',
  },
  {
    id: 'ielts-cue-card-journey',
    category: 'IELTS PRACTICE',
    title: 'Describe an unforgettable journey you have taken (IELTS Part 2).',
    instructions: 'You should say: where you went, whom you went with, why it was memorable, and what you learned from the experience.',
    estimatedTime: '2 mins',
    keywords: ['destination', 'breathtaking', 'scenery', 'unforgettable', 'perspective', 'culture'],
    sampleStarter: 'I would like to speak about a memorable trip I took to...',
  },
  {
    id: 'interview-salary-negotiation',
    category: 'INTERVIEW',
    title: 'Negotiating your salary offer for a senior position.',
    instructions: 'Express enthusiasm for the role, state your research-backed compensation expectations, and justify your value proposition.',
    estimatedTime: '2 mins',
    keywords: ['compensation', 'value proposition', 'market rate', 'enthusiasm', 'benefits'],
    sampleStarter: 'Thank you for this offer. I am genuinely excited about the role...',
  },
  {
    id: 'public-speaking-climate-action',
    category: 'PUBLIC SPEAKING',
    title: 'Individual responsibility vs. corporate responsibility for the environment.',
    instructions: 'Present a balanced argument on how individuals and corporate leaders must collaborate for a sustainable future.',
    estimatedTime: '3 mins',
    keywords: ['sustainability', 'footprint', 'policy', 'renewable', 'accountability', 'legacy'],
    sampleStarter: 'When we discuss environmental preservation, an important question arises...',
  },
];
