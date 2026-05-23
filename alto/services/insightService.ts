import insightsData from '@/data/aiInsights.json';
import type { AIInsight } from '@/types/insight';
import { sleep } from '@/lib/utils';

export async function getAIInsights(vehicleId: string): Promise<AIInsight[]> {
  void vehicleId; // Reserved for future personalization
  await sleep(500);
  return insightsData as AIInsight[];
}
