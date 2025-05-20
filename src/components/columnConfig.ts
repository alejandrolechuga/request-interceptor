export enum RuleColumn {
  UrlPattern = 'urlPattern',
  Method = 'method',
  Enabled = 'enabled',
  Date = 'date',
  Edit = 'edit',
}

export const COLUMN_ORDER: RuleColumn[] = [
  RuleColumn.UrlPattern,
  RuleColumn.Method,
  RuleColumn.Enabled,
  RuleColumn.Date,
  RuleColumn.Edit,
];

export const COLUMN_LABELS: Record<RuleColumn, string> = {
  [RuleColumn.UrlPattern]: 'URL Pattern',
  [RuleColumn.Method]: 'Method',
  [RuleColumn.Enabled]: 'Enabled',
  [RuleColumn.Date]: 'Date',
  [RuleColumn.Edit]: 'Edit',
};
