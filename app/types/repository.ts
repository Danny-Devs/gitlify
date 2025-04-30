export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  url: string;
  stars?: number;
  forks?: number;
  language?: string;
  topics?: string[];
}
