import type { FillPatterns } from "exceljs";

export interface ReportMetadata {
  generatedAt: Date;
  generatedBy: string;
  totalRecords: number;
  filters: Record<string, unknown>;
}

export interface ReportSection {
  title: string;
  startRow: number;
  endRow?: number;
  mergedCells?: MergedCell[];
  style?: CellStyle;
  data?: unknown[];
  columns?: ExcelColumn[];
}

export interface SummaryRow {
  label: string;
  value: string | number;
  column: string;
  style?: CellStyle;
}

export type PositionedCell = {
  address: string; // e.g. 'A4'
  value: string | number;
  style?: CellStyle;
};

export interface ExcelReportData {

  title: string;
  data: unknown[];
  columns: ExcelColumn[];
  metadata: ReportMetadata;
  sections?: ReportSection[];
  mergedCells?: MergedCell[];
  floatingCells?: PositionedCell[];
  headerStyle?: CellStyle;
  dataStyle?: CellStyle;
  footerData?: unknown[];
  summaryRows?: SummaryRow[];
}

export interface ExcelColumn {
  key: string;
  title: string;
  width?: number;
  type?: 'string' | 'number' | 'date' | 'currency' | 'percentage' | 'text';
  format?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ReportConfig {
  title: string;
  filters?: Record<string, unknown>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  groupBy?: string;
  sortBy?: string;
  limit?: number;
  includeCharts?: boolean;
  sheetName?: string;
}

export interface MergedCell {
  range: string; 
  value: string;
  style?: CellStyle;
}

export interface CellStyle {
  font?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    size?: number;
    color?: string;
    name?: string;
  };
  fill?: {
    fgColor?: string;
    bgColor?: string;
    pattern?: FillPatterns;
  };
  border?: {
    top?: BorderStyle;
    bottom?: BorderStyle;
    left?: BorderStyle;
    right?: BorderStyle;
  };
  alignment?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'middle' | 'bottom';
    wrapText?: boolean;
    textRotation?: number;
  };
  numberFormat?: string;
}

export interface BorderStyle {
  style: 'thin' | 'medium' | 'thick' | 'double' | 'dotted' | 'dashed';
  color?: string;
}

export interface ReportPreview { 
  preview: unknown[], 
  totalCount: number,
  columns: ExcelColumn[],
  createdAt: string,
}

export interface ReportMergeConfig {
  sectionGap?: number;
  topBottomPadding?: number;
  leftRightPadding?: number;
  includeDividers?: boolean;
  dividerStyle?: CellStyle;
}

export interface AddressPair {
  row: number,
  col: number
}