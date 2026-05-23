import insightsData from '@/data/aiInsights.json';
import type { AIInsight } from '@/types/insight';
import { sleep } from '@/lib/utils';

export async function getAIInsights(_vehicleId: string): Promise<AIInsight[]> {
  await sleep(500);
  return insightsData as AIInsight[];
}
