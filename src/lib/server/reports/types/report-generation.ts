// src/lib/reports/ExcelGenerator.ts
import ExcelJS, { type Cell, type Worksheet } from 'exceljs';
import { reportConversion } from './report-conversion.js';
import type { AddressPair as cellAddressPair, ExcelReportData, ReportMergeConfig, WorksheetProgress } from './report-types.js';
import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';

export class ExcelGenerator {

  static async generateExcelfromReport(reportData: ExcelReportData){
    const workbook = new ExcelJS.Workbook();
    const sheetName = reportData.title.replace(/[^\w\s]/gi, '').substring(0, 31);
    const worksheet = workbook.addWorksheet(sheetName);
    const startAddress = {row: 1, col: 1} as cellAddressPair;
    await this.writeReportToWorksheet(worksheet, reportData, startAddress)

    return await workbook.xlsx.writeBuffer();
  }

  static async generateExcelfromReportArray(reportDataArray: ExcelReportData[]){
    const workbook = new ExcelJS.Workbook();
    const sheetName = 'Report'
    const worksheet = workbook.addWorksheet(sheetName);

    await this.mergeReportsToWorksheet(worksheet, reportDataArray, {})

    return await workbook.xlsx.writeBuffer();
  }

  /**
   * Merges multiple ExcelReportData objects directly onto a worksheet
   */
  static async mergeReportsToWorksheet(
    worksheet: Worksheet,
    reports: ExcelReportData[],
    config: ReportMergeConfig = {}
  ): Promise<void> {
    const logger = getLogSidecar()
    const {
      sectionGap = 1,
      topBottomPadding = 1,
      leftRightPadding = 1
    } = config;

    if (reports.length === 0) {
      throw new Error('No reports provided for merging');
    }

    let currentRow = topBottomPadding + 1;
    const startCol = leftRightPadding + 1;
    
    // Process each report
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
       
      const address = {row: currentRow, col: startCol} as cellAddressPair
      const data = await this.writeReportToWorksheet(worksheet, report, address);

      currentRow = data.currentRow

      if (i < reports.length - 1) currentRow += sectionGap;

      logger.info(`Report Generation: ${await JSON.stringify(currentRow)}`)
    }

  }

  static async writeReportToWorksheet(worksheet: Worksheet, report: ExcelReportData, startAddress: cellAddressPair){
    let currentProgress: WorksheetProgress = {
      worksheet: worksheet,
      reportData: report,
      currAddress: startAddress
    };
    const reportPipeline = [this.writeMergedCells, this.writeFloatingCells, this.writeColumnHeaders, this.writeDataColumns, this.autoFitColumns, this.autoFitRows]
    
    for (const reportFunc of reportPipeline) {
      currentProgress = await reportFunc(currentProgress)
    }

    const data =  {currentRow: currentProgress.currAddress.row, worksheet: worksheet}

    return data
  }
  
  static async writeColumnHeaders(progress: WorksheetProgress): Promise<WorksheetProgress>{
    progress.currAddress.row += progress.reportData.rowOffset
    for (let i = 0; i < progress.reportData.columns.length; i++) {
      const headerCell = progress.worksheet.getCell(progress.currAddress.row, progress.currAddress.col + i);
      headerCell.value = progress.reportData.columns[i].title;
      reportConversion.applyCellStyle(headerCell, progress.reportData.headerStyle ?? {});
    }
    progress.currAddress.row++;
    return progress
  }

  static async writeDataColumns(progress: WorksheetProgress): Promise<WorksheetProgress>{
    for (const dataRow of progress.reportData.data) {
      for (let i = 0; i < progress.reportData.columns.length; i++) {
        const cell = progress.worksheet.getCell(progress.currAddress.row, progress.currAddress.col + i);
        const columnKey = progress.reportData.columns[i].key;
        cell.value = dataRow[columnKey];
        reportConversion.applyCellStyle(cell, progress.reportData.dataStyle ?? {});
      }
      progress.currAddress.row++;
    }
    return progress
  }

  static async writeMergedCells(progress: WorksheetProgress): Promise<WorksheetProgress>{
    if (!progress.reportData.mergedCells) 
      return progress
    
    for (const mergedCell of progress.reportData.mergedCells){
      const adjustedRange = reportConversion.adjustCellRange(mergedCell.range, progress.currAddress.row - 1, progress.currAddress.col - 1);
      progress.worksheet.mergeCells(adjustedRange);
      
      // Set value and style for the merged cell
      const { column, row } = reportConversion.parseAddress(adjustedRange.split(':')[0]);
      const cell = progress.worksheet.getCell(row, reportConversion.columnLetterToNumber(column));
      cell.value = mergedCell.value;
      reportConversion.applyCellStyle(cell, mergedCell?.style ?? {});
    }

    return progress
  } 

  static async writeFloatingCells(progess: WorksheetProgress): Promise<WorksheetProgress>{
    if (!progess.reportData.floatingCells) return progess

    for (const floatingCell of progess.reportData.floatingCells) {
      const adjustedAddress = reportConversion.adjustCellAddress(floatingCell.address, progess.currAddress.row - 1, progess.currAddress.col - 1);
      const { column, row } = reportConversion.parseAddress(adjustedAddress);
      const cell = progess.worksheet.getCell(row, reportConversion.columnLetterToNumber(column));
      cell.value = floatingCell.value;
      reportConversion.applyCellStyle(cell, floatingCell?.style ?? {});
    }

    return progess
  }

  static async autoFitColumns(progress: WorksheetProgress): Promise<WorksheetProgress> {
    const { worksheet, reportData, currAddress } = progress;

    const startRow = currAddress.row;   // where headers start
    const startCol = currAddress.col;   // where data starts

    for (let colOffset = 0; colOffset < reportData.columns.length; colOffset++) {
      const colIndex = startCol + colOffset;
      const column = worksheet.getColumn(colIndex);

      let maxWidth = 0;

      // Check header
      const headerCell = worksheet.getCell(startRow, colIndex);
      const headerValue = String(headerCell.value ?? '');
      const headerFontSize = ExcelGenerator.getCellFontSize(headerCell);
      maxWidth = Math.max(maxWidth, ExcelGenerator.calculateTextWidth(headerValue, headerFontSize));

      // Check data rows
      for (let rowOffset = 1; rowOffset <= reportData.data.length; rowOffset++) {
        const cell = worksheet.getCell(startRow + rowOffset, colIndex);
        const cellValue = String(cell.value ?? '');
        const cellFontSize = ExcelGenerator.getCellFontSize(cell);
        maxWidth = Math.max(maxWidth, ExcelGenerator.calculateTextWidth(cellValue, cellFontSize));
      }

      // Maximize column width with generous padding
      column.width = Math.max(maxWidth + 5, 15); // Minimum 15, generous padding
    }
    return progress;
  }

  // Helper method to calculate approximate text width in Excel units
  static calculateTextWidth(text: string, fontSize: number = 12): number {
    if (!text) return 0;
    
    // Base widths for Calibri 11pt - scale these based on actual font size
    const fontScale = fontSize / 11;
    
    let width = 0;
    
    for (const char of text) {
      let charWidth = 0;
      
      if (char === ' ') {
        charWidth = 0.3; // space is narrower
      } else if (/[iIlj1\\.]/.test(char)) {
        charWidth = 0.4; // narrow characters
      } else if (/[mMwW]/.test(char)) {
        charWidth = 1.2; // wide characters
      } else if (/[A-Z]/.test(char)) {
        charWidth = 0.9; // uppercase letters
      } else if (/[a-z]/.test(char)) {
        charWidth = 0.7; // lowercase letters
      } else if (/[0-9]/.test(char)) {
        charWidth = 0.6; // numbers
      } else {
        charWidth = 0.8; // other characters
      }
      
      width += charWidth * fontScale;
    }
    
    return width;
  }

  // Helper method to get font size from a cell
  static getCellFontSize(cell: Cell): number {
    if (cell.font && cell.font.size) {
      return cell.font.size;
    }
    return 12; // Default Excel font size
  }

  static async autoFitRows(progress: WorksheetProgress): Promise<WorksheetProgress> {
    const { worksheet, reportData, currAddress } = progress;

    const startRow = currAddress.row;   // header row
    const startCol = currAddress.col;

    // adjust header row
    const headerRow = worksheet.getRow(startRow);
    headerRow.height = 32;

    // adjust each data row
    for (let rowOffset = 1; rowOffset <= reportData.data.length; rowOffset++) {
      const rowIndex = startRow + rowOffset;
      const row = worksheet.getRow(rowIndex);

      let maxLines = 1;

      for (let colOffset = 0; colOffset < reportData.columns.length; colOffset++) {
        const colIndex = startCol + colOffset;
        const cell = worksheet.getCell(rowIndex, colIndex);
        const cellValue = String(cell.value ?? '');

        // Get the column width to calculate wrapping
        const columnWidth = worksheet.getColumn(colIndex).width || 10;
        
        // Calculate approximate characters per line based on column width
        const charsPerLine = Math.floor(columnWidth * 0.8); // rough approximation
        
        // Count actual line breaks and estimated wrapped lines
        const explicitLines = (cellValue.match(/\n/g) || []).length + 1;
        const wrappedLines = Math.ceil(cellValue.length / charsPerLine) || 1;
        
        const totalLines = Math.max(explicitLines, wrappedLines);
        maxLines = Math.max(maxLines, totalLines);
      }

      // base height ~15pt, increase per line
      row.height = Math.min(maxLines * 15, 100); // cap at 100
    }
    return progress;
  }

  
}