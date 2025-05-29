export enum RuleColumn {
  Enabled = 'enabled',
  UrlPattern = 'urlPattern',
  Method = 'method',
  Matches = 'matches',
  Actions = 'actions',
}

export const COLUMN_ORDER: RuleColumn[] = [
  RuleColumn.Enabled,
  RuleColumn.UrlPattern,
  RuleColumn.Method,
  RuleColumn.Matches,
  RuleColumn.Actions,
];

export const COLUMN_LABELS: Record<RuleColumn, string> = {
  [RuleColumn.Enabled]: 'Status',
  [RuleColumn.UrlPattern]: 'URL Pattern',
  [RuleColumn.Method]: 'Method',
  [RuleColumn.Matches]: 'Matches',
  [RuleColumn.Actions]: 'Actions',
};
