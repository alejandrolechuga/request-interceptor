export interface Rule {
  id: string;
  urlPattern: string;
  /** Whether the urlPattern should be treated as a RegExp */
  isRegExp?: boolean;
  method: string;
  enabled: boolean;
  statusCode: number;
  date: string;
  response: string | null;
}
