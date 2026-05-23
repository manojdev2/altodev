export interface AIInsight {
  id: string;
  icon: string;
  title: string;
  body: string;
  trend: 'up' | 'down' | 'neutral';
}
