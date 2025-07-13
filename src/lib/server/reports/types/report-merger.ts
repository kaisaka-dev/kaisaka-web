import type { ExcelColumn, ExcelReportData, MergedCell, PositionedCell, ReportMetadata, ReportSection, SummaryRow } from "./report-types.js";
import { reportConversion } from './report-conversion.js'

export interface ReportMergeConfig {
  sectionGap?: number;
  topBottomPadding?: number;
  leftRightPadding?: number;
}

export class ReportMerger{

/**
 * Calculates the number of rows needed for a report section
 */
static calculateSectionRows(report: ExcelReportData): number {
  let rows = 0;
  
  // Title row
  rows += 1;
  
  // Header row
  rows += 1;
  
  // Data rows
  rows += report.data.length;
  
  // Footer data rows
  if (report.footerData && report.footerData.length > 0) {
    rows += report.footerData.length;
  }
  
  // Summary rows
  if (report.summaryRows && report.summaryRows.length > 0) {
    rows += report.summaryRows.length;
  }
  
  // Additional sections
  if (report.sections) {
    for (const section of report.sections) {
      if (section.data && section.data.length > 0) {
        rows += section.data.length;
      }
      rows += 1; // Section title
    }
  }
  
  return rows;
}

/**
 * Concatenates multiple ExcelReportData objects into a single worksheet
 */
static concatenateReports(
  reports: ExcelReportData[],
  config: ReportMergeConfig = {}
): ExcelReportData {
  const {
    sectionGap = 2,
    topBottomPadding = 1,
    leftRightPadding = 1
  } = config;

  if (reports.length === 0) {
    throw new Error('No reports provided for concatenation');
  }

  // Use the first report as the base structure
  const baseReport = reports[0];
  
  // Prepare merged data structures
  const mergedData: unknown[] = [];
  const mergedColumns: ExcelColumn[] = [...baseReport.columns];
  const mergedCells: MergedCell[] = [];
  const floatingCells: PositionedCell[] = [];
  const sections: ReportSection[] = [];
  const summaryRows: SummaryRow[] = [];
  
  let currentRow = topBottomPadding + 1;
  let totalRecords = 0;
  
  // Process each report
  for (let reportIndex = 0; reportIndex < reports.length; reportIndex++) {
    const report = reports[reportIndex];
    const sectionStartRow = currentRow;
    
    // Add data from this report
    mergedData.push(...report.data);
    
    // Add footer data if present
    if (report.footerData && report.footerData.length > 0) {
      mergedData.push(...report.footerData);
    }
    
    // Adjust and add merged cells
    if (report.mergedCells) {
      for (const mergedCell of report.mergedCells) {
        mergedCells.push({
          ...mergedCell,
          range: reportConversion.adjustCellRange(mergedCell.range, currentRow - 1, leftRightPadding)
        });
      }
    }
    
    // Adjust and add floating cells
    if (report.floatingCells) {
      for (const floatingCell of report.floatingCells) {
        floatingCells.push({
          ...floatingCell,
          address: reportConversion.adjustCellAddress(floatingCell.address, currentRow - 1, leftRightPadding)
        });
      }
    }
    
    // Adjust and add sections
    if (report.sections) {
      for (const section of report.sections) {
        sections.push({
          ...section,
          startRow: section.startRow + currentRow - 1,
          endRow: section.endRow ? section.endRow + currentRow - 1 : undefined,
          mergedCells: section.mergedCells?.map(mc => ({
            ...mc,
            range: reportConversion.adjustCellRange(mc.range, currentRow - 1, leftRightPadding)
          }))
        });
      }
    }
    
    // Adjust and add summary rows
    if (report.summaryRows) {
      for (const summaryRow of report.summaryRows) {
        summaryRows.push({
          ...summaryRow,
          column: reportConversion.adjustCellAddress(summaryRow.column + '1', currentRow - 1, leftRightPadding).replace('1', '')
        });
      }
    }
    
    // Calculate rows used by this report
    const rowsUsed = calculateSectionRows(report);
    currentRow += rowsUsed;
    
    // Add section gap between reports (except after the last one)
    if (reportIndex < reports.length - 1) {
      currentRow += sectionGap;
    }
    
    totalRecords += report.metadata.totalRecords;
  }
  
  // Create merged metadata
  const mergedMetadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: baseReport.metadata.generatedBy,
    totalRecords,
    filters: reports.reduce((acc, report) => ({ ...acc, ...report.metadata.filters }), {})
  };
  
  // Create the concatenated report
  const concatenatedReport: ExcelReportData = {
    title: `Combined Report - ${reports.map(r => r.title).join(', ')}`,
    data: mergedData,
    columns: mergedColumns,
    metadata: mergedMetadata,
    sections: sections.length > 0 ? sections : undefined,
    mergedCells: mergedCells.length > 0 ? mergedCells : undefined,
    floatingCells: floatingCells.length > 0 ? floatingCells : undefined,
    headerStyle: baseReport.headerStyle,
    dataStyle: baseReport.dataStyle,
    summaryRows: summaryRows.length > 0 ? summaryRows : undefined
  };
  
  return concatenatedReport;
}
}