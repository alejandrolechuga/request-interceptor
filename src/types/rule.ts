export interface Rule {
  id: string;
  urlPattern: string;
  method: string;
  enabled: boolean;
  statusCode: number;
  date: string;
  response: string | null;
}
