export enum RuleColumn {
  UrlPattern = 'urlPattern',
  Method = 'method',
  Enabled = 'enabled',
  Date = 'date',
  Actions = 'actions',
}

export const COLUMN_ORDER: RuleColumn[] = [
  RuleColumn.UrlPattern,
  RuleColumn.Method,
  RuleColumn.Enabled,
  RuleColumn.Date,
  RuleColumn.Actions,
];

export const COLUMN_LABELS: Record<RuleColumn, string> = {
  [RuleColumn.UrlPattern]: 'URL Pattern',
  [RuleColumn.Method]: 'Method',
  [RuleColumn.Enabled]: 'Enabled',
  [RuleColumn.Date]: 'Date',
  [RuleColumn.Actions]: 'Actions',
};
