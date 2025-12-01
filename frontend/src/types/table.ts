export interface ColumnConfig {
  key: string;
  label: string;
  externalKey?: string;
  dataType?:
    | "string"
    | "number"
    | "date"
    | "hyperlink"
    | "navigate"
    | "rank"
    | "decimal"
    | "time";
  showByDefault?: boolean;
  hidden?: boolean;
  hrefPrefix?: string; // for hyperlink columns
  render?: (value: any, row?: Record<string, any>) => React.ReactNode;
}

export interface TableConfig {
  title: string;
  description?: string;
  columns: ColumnConfig[];
}
