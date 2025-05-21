export interface Rule {
  id: string;
  urlPattern: string;
  method: string;
  enabled: boolean;
  date: string;
  response: string | null;
}
