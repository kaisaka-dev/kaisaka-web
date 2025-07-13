// src/lib/reports/ExcelGenerator.ts
import ExcelJS from 'exceljs';
import type { AddressPair as cellAddressPair, ExcelReportData, MergedCell, PositionedCell, ReportMetadata } from './report-types.js';
import { reportConversion } from './report-conversion.js'

export class ExcelGenerator {
  /**
   * Generate the excelsheet
   * @param reportData Report Data to append
   * @returns Buffer
   */
  static async generateExcel(reportData: ExcelReportData){
    const workbook = new ExcelJS.Workbook();
    const sheetName = reportData.title.replace(/[^\w\s]/gi, '').substring(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);
    
    // Calculate starting row for data (after merged cells and floating cells)
    const dataStartRow = this.calculateDataStartRow(reportData);

    if (reportData.mergedCells) 
      this.applyMergedCells(worksheet, reportData.mergedCells);

    this.addDataToWorksheet(worksheet, reportData, dataStartRow);
    this.applyAdvancedFormatting(worksheet, reportData, dataStartRow);
    

    if (reportData.floatingCells) 
      this.applyFloatingCells(worksheet, reportData.floatingCells);
    
    this.autoFitColumns(worksheet, reportData);
    this.autoFitRowHeights(worksheet, reportData, dataStartRow);
    this.createMetadataSheet(workbook, reportData.metadata);

    return await workbook.xlsx.writeBuffer();
  }

  static async writeReportToWorksheet(worksheet: Worksheet, report: ExcelReportData, startAddress: cellAddressPair){
    let currentRow = startAddress.row;

    
  }
  
  /**
   * Calculate the starting row for data based on merged cells and floating cells
   */
  private static calculateDataStartRow(reportData: ExcelReportData): number {
    let maxRow = 1;
    
    // Check merged cells
    if (reportData.mergedCells) {
      reportData.mergedCells.forEach(cell => {
        const endRow = parseInt(cell.range.split(':')[1].match(/\d+/)?.[0] || '1');
        maxRow = Math.max(maxRow, endRow);
      });
    }
    
    // Check floating cells
    if (reportData.floatingCells) {
      reportData.floatingCells.forEach(cell => {
        const row = parseInt(cell.address.match(/\d+/)?.[0] || '1');
        maxRow = Math.max(maxRow, row);
      });
    }
    
    // Add 2 rows buffer after the last content row
    return maxRow + 2;
  }
  
  private static addDataToWorksheet(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData, dataStartRow: number): void {
    // Add headers
    const headers = reportData.columns.map(col => col.title);
    worksheet.getRow(dataStartRow).values = headers;
    
    // Add data rows
    reportData.data.forEach((row, rowIndex) => {
      const rowData = reportData.columns.map(col => row[col.key]);
      worksheet.getRow(dataStartRow + 1 + rowIndex).values = rowData;
    });
  }
  /**
   * Apply floating cells to worksheet
   */
  private static applyFloatingCells(worksheet: ExcelJS.Worksheet, floatingCells: PositionedCell[]): void {
    floatingCells.forEach(cell => {
      const excelCell = worksheet.getCell(cell.address);
      excelCell.value = cell.value;
      
      if (cell.style) {
        const style = reportConversion.convertCellStyle(cell.style);
        Object.assign(excelCell, style);
      }
    });
  }
  
  /**
   * Apply merged cells to worksheet
   */
  private static applyMergedCells(worksheet: ExcelJS.Worksheet, mergedCells: MergedCell[]): void {
    mergedCells.forEach(mergedCell => {
      // Merge the range
      worksheet.mergeCells(mergedCell.range);
      
      // Get the top-left cell of the merged range
      const range = worksheet.getCell(mergedCell.range.split(':')[0]);
      
      // Set the value
      range.value = mergedCell.value;
      
      // Apply style to merged cell
      if (mergedCell.style) {
        const style = reportConversion.convertCellStyle(mergedCell.style);
        Object.assign(range, style);
      }
    });
  }
  
  /**
   * Apply header formatting
   */
  private static applyHeaderFormatting(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData, dataStartRow: number): void {
    if (!reportData.headerStyle) return;
    
    const headerRow = worksheet.getRow(dataStartRow);
    const style = reportConversion.convertCellStyle(reportData.headerStyle);
    
    reportData.columns.forEach((_, colIndex) => {
      const cell = headerRow.getCell(colIndex + 1);
      Object.assign(cell, style);
    });
  }
  
  /**
   * Apply data formatting
   */
  private static applyDataFormatting(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData, dataStartRow: number): void {
    if (!reportData.dataStyle) return;
    
    const style = reportConversion.convertCellStyle(reportData.dataStyle);
    
    reportData.data.forEach((_, rowIndex) => {
      const row = worksheet.getRow(dataStartRow + 1 + rowIndex);
      
      reportData.columns.forEach((_, colIndex) => {
        const cell = row.getCell(colIndex + 1);
        Object.assign(cell, style);
      });
    });
  }
  
  /**
   * Apply advanced formatting including column-specific styles
   */
  private static applyAdvancedFormatting(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData, dataStartRow: number): void {
    // Apply header formatting
    this.applyHeaderFormatting(worksheet, reportData, dataStartRow);
    
    // Apply data formatting
    this.applyDataFormatting(worksheet, reportData, dataStartRow);
    
    // Apply column-specific formatting
    reportData.columns.forEach((col, colIndex) => {
      const columnStyle: Partial<ExcelJS.Style> = {};
      
      // Base alignment
      if (col.alignment) {
        columnStyle.alignment = { horizontal: col.alignment as ExcelJS.Alignment['horizontal'] };
      }
      
      // Number formatting based on column type
      if (col.type === 'currency') {
        columnStyle.numFmt = col.format || '$#,##0.00';
      } else if (col.type === 'percentage') {
        columnStyle.numFmt = '0.00%';
      } else if (col.type === 'date') {
        columnStyle.numFmt = col.format || 'mm/dd/yyyy';
      }
      
      // Apply to data cells in this column
      reportData.data.forEach((_, rowIndex) => {
        const cell = worksheet.getCell(dataStartRow + 1 + rowIndex, colIndex + 1);
        Object.assign(cell, columnStyle);
      });
    });
  }
  
  /**
   * Auto-fit columns based on content
   */
  private static autoFitColumns(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData): void {
    reportData.columns.forEach((col, colIndex) => {
      const column = worksheet.getColumn(colIndex + 1);
      
      // Calculate width based on header and data
      let maxWidth = col.title.length;
      
      reportData.data.forEach(row => {
        const cellValue = String(row[col.key] || '');
        maxWidth = Math.max(maxWidth, cellValue.length);
      });
      
      // Set column width with some padding (minimum 8, maximum 50)
      column.width = Math.min(Math.max(maxWidth + 2, 8), 50);
    });
  }
  
  /**
   * Auto-fit row heights based on content
   */
  private static autoFitRowHeights(worksheet: ExcelJS.Worksheet, reportData: ExcelReportData, dataStartRow: number): void {
    // Helper function to estimate text height
    const estimateTextHeight = (text: string, columnWidth: number, fontSize: number = 11): number => {
      if (!text) return 1;
      
      const textString = String(text);
      const averageCharWidth = fontSize * 0.6; // Approximate character width
      const charsPerLine = Math.floor(columnWidth * 7 / averageCharWidth); // Excel uses ~7 pixels per character width unit
      const lines = Math.ceil(textString.length / charsPerLine);
      
      // Account for line breaks in the text
      const explicitLineBreaks = (textString.match(/\n/g) || []).length;
      const totalLines = Math.max(lines, explicitLineBreaks + 1);
      
      // Each line is approximately 15 points (Excel default)
      return totalLines * 15;
    };
    
    // Auto-fit header row
    const headerRow = worksheet.getRow(dataStartRow);
    let headerMaxHeight = 20; // Minimum height for headers
    
    reportData.columns.forEach((col, colIndex) => {
      const column = worksheet.getColumn(colIndex + 1);
      const columnWidth = column.width || 10;
      const fontSize = 11; // Default font size
      
      const textHeight = estimateTextHeight(col.title, columnWidth, fontSize);
      headerMaxHeight = Math.max(headerMaxHeight, textHeight);
    });
    
    headerRow.height = Math.min(headerMaxHeight, 100); // Cap at 100 points
    
    // Auto-fit data rows
    reportData.data.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(dataStartRow + 1 + rowIndex);
      let rowMaxHeight = 15; // Minimum height for data rows
      
      reportData.columns.forEach((col, colIndex) => {
        const column = worksheet.getColumn(colIndex + 1);
        const columnWidth = column.width || 10;
        const cellValue = row[col.key];
        const fontSize = 11; // Default font size
        
        const textHeight = estimateTextHeight(cellValue, columnWidth, fontSize);
        rowMaxHeight = Math.max(rowMaxHeight, textHeight);
      });
      
      excelRow.height = Math.min(rowMaxHeight, 150); // Cap at 150 points to prevent extremely tall rows
    });
    
    // Auto-fit merged cells
    if (reportData.mergedCells) {
      reportData.mergedCells.forEach(mergedCell => {
        const range = mergedCell.range;
        const [startCell, endCell] = range.split(':');
        const startRow = parseInt(startCell.match(/\d+/)?.[0] || '1');
        const endRow = parseInt(endCell.match(/\d+/)?.[0] || '1');
        
        if (startRow === endRow) {
          // Single row merge - adjust height
          const row = worksheet.getRow(startRow);
          const textHeight = estimateTextHeight(String(mergedCell.value), 50, 11);
          row.height = Math.min(Math.max(textHeight, 15), 100);
        }
      });
    }
    
    // Auto-fit floating cells
    if (reportData.floatingCells) {
      reportData.floatingCells.forEach(floatingCell => {
        const rowNumber = parseInt(floatingCell.address.match(/\d+/)?.[0] || '1');
        const row = worksheet.getRow(rowNumber);
        const textHeight = estimateTextHeight(String(floatingCell.value), 30, 11);
        
        // Only increase height if needed
        const currentHeight = row.height || 15;
        row.height = Math.min(Math.max(textHeight, currentHeight), 100);
      });
    }
  }
  
  /**
   * Create metadata sheet
   */
  private static createMetadataSheet(workbook: ExcelJS.Workbook, metadata: ReportMetadata): ExcelJS.Worksheet {
    const metadataSheet = workbook.addWorksheet('Metadata');
    
    const metadataData = [
      ['Report Metadata', ''],
      ['Generated At', metadata.generatedAt.toISOString()],
      ['Generated By', metadata.generatedBy],
      ['Total Records', metadata.totalRecords],
      ['Filters', JSON.stringify(metadata.filters, null, 2)]
    ];
    
    // Add data to metadata sheet
    metadataData.forEach((row, rowIndex) => {
      metadataSheet.getRow(rowIndex + 1).values = row;
    });
    
    // Style the metadata sheet header
    const headerCell = metadataSheet.getCell('A1');
    headerCell.font = { bold: true, size: 14 };
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '366092' }
    };
    headerCell.alignment = { horizontal: 'center' };
    
    // Merge the header cell
    metadataSheet.mergeCells('A1:B1');
    
    // Auto-fit columns for metadata sheet
    metadataSheet.columns.forEach(column => {
      let maxWidth = 0;
      column.eachCell({ includeEmpty: false }, (cell) => {
        maxWidth = Math.max(maxWidth, String(cell.value).length);
      });
      column.width = Math.min(Math.max(maxWidth + 2, 10), 50);
    });
    
    // Auto-fit row heights for metadata sheet
    metadataSheet.eachRow((row, rowNumber) => {
      let maxHeight = 15;
      row.eachCell((cell, colNumber) => {
        const column = metadataSheet.getColumn(colNumber);
        const columnWidth = column.width || 10;
        const textHeight = this.estimateTextHeight(String(cell.value), columnWidth, 11);
        maxHeight = Math.max(maxHeight, textHeight);
      });
      row.height = Math.min(maxHeight, 100);
    });
    
    return metadataSheet;
  }
  
  /**
   * Helper method to estimate text height (static version for metadata sheet)
   */
  private static estimateTextHeight(text: string, columnWidth: number, fontSize: number = 11): number {
    if (!text) return 1;
    
    const textString = String(text);
    const averageCharWidth = fontSize * 0.6;
    const charsPerLine = Math.floor(columnWidth * 7 / averageCharWidth);
    const lines = Math.ceil(textString.length / charsPerLine);
    
    const explicitLineBreaks = (textString.match(/\n/g) || []).length;
    const totalLines = Math.max(lines, explicitLineBreaks + 1);
    
    return totalLines * 15;
  }

}