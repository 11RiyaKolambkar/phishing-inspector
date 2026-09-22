import { ThreatTrendsData } from '../types';

export async function fetchThreatTrends(forceFresh = false): Promise<ThreatTrendsData> {
  const url = forceFresh ? '/api/threat-trends?fresh=true' : '/api/threat-trends';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to load threat trends: ${response.statusText}`);
  }

  return response.json();
}
