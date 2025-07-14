import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import ExcelJS, { type Cell, type CellValue, type Row, type Style, type Worksheet } from 'exceljs';


interface rowInformation {
  rowData: rowDatum[]
  lowestNumber: number
}

interface rowDatum {
  cellData: CellValue[];
  cellStyle: Partial<Style>[];
  cells: Cell[];
  rowIndex: number
}

export class ExcelMerger {
  static async mergeWorkbooks(workbooks: ExcelJS.Workbook[]) {
    const logger = getLogSidecar()

    let currentRow = 1;

    const finalWorkbook = new ExcelJS.Workbook();
    const sheetName = 'Report'
    const finalWorksheet = finalWorkbook.addWorksheet(sheetName);

    for (const workbook of workbooks){
      const oldWorksheet = workbook.getWorksheet(1)
      if (oldWorksheet === undefined){
        logger.warn(`No worksheet at index 0.`)
        continue
      }

      currentRow = await this.copySheetData(finalWorksheet, oldWorksheet, currentRow)
    }

    return await finalWorkbook.xlsx.writeBuffer();
  }

  static recordRowToDest = async (row: Row, rowNumber: number, destRecord: rowInformation) => {
    const cellDataValues:  CellValue[] = [];
    const cellStyles: Partial<Style>[] = [];
    const cells: Cell[] = [];
    
    const copyCell = (cell: Cell, cellIndex: number) => {
      cellDataValues[cellIndex - 1] = cell.value;
      cellStyles[cellIndex - 1] = cell.style
      cells[cellIndex - 1] = cell;
    }
    
    row.eachCell({ includeEmpty: true }, copyCell);
    destRecord.lowestNumber++;
    destRecord.rowData.push({ cellData: cellDataValues, cellStyle: cellStyles, cells: cells, rowIndex: row.number});
  }

  static transferRow = async (rowInfo: rowDatum, offset: number, dstWorksheet: Worksheet) => {
    const destRow = dstWorksheet.getRow(rowInfo.rowIndex + offset);

    const transferCellData = (cell: CellValue, cellIndex: number) => {
      const destCell = destRow.getCell(cellIndex + 1);
      destCell.value = cell;
    }
    
    const transferCellStyles = (cell: Partial<Style>, cellIndex: number) => {
      const destCell = destRow.getCell(cellIndex + 1);
      this.copyPartialCellStyle(destCell, cell)
    }

    rowInfo.cellData.forEach(transferCellData);
    rowInfo.cellStyle.forEach(transferCellStyles);
    await destRow.commit();
  }

  static async copySheetData(dstWorksheet: Worksheet, srcWorksheet: Worksheet, dstStartRow: number) {
    const logger = getLogSidecar()
    
    const srcData: rowInformation = { rowData: [] as rowDatum[], lowestNumber: dstStartRow }
    srcData.lowestNumber++;

    const copyAndStoreSrcData = (row: Row, id: number) => this.recordRowToDest(row, id, srcData)

    const transferContentsToDest = (rowDatum: rowDatum) => this.transferRow(rowDatum, dstStartRow, dstWorksheet)

    srcWorksheet.eachRow(copyAndStoreSrcData);

    srcData.rowData.forEach(transferContentsToDest);
    
    srcWorksheet.columns.forEach((column, index) => {
        if (column.width) {
            dstWorksheet.getColumn(index + 1).width = column.width;
        }
    });

    srcWorksheet.eachRow((row, rowNumber) => {
        if (row.height) {
            dstWorksheet.getRow(rowNumber).height = row.height;
        }
    });

    await this.copyMergedCells(srcWorksheet, dstWorksheet, dstStartRow, srcData.lowestNumber + 2);

    logger.info(`[Report Merger] Copied ${srcData.lowestNumber} rows from ${srcWorksheet.name}`)

    return srcData.lowestNumber + 1; // Add 2 for spacing between merged sheets
  }

  static copyPartialCellStyle(destCell: Cell, srcCell: Partial<Style>) {
    if (srcCell.font) destCell.font = {...srcCell.font};

    if (srcCell.fill) destCell.fill = {...srcCell.fill};

    if (srcCell.alignment) destCell.alignment = {...srcCell.alignment};
    
    if (srcCell.border) destCell.border = {...srcCell.border};
    
    if (srcCell.numFmt) { destCell.numFmt = srcCell.numFmt;}

    if (srcCell.protection) destCell.protection = {...srcCell.protection};
  }

  static async copyMergedCells( srcWorksheet: Worksheet, dstWorksheet: Worksheet, dstStartRow: number, copiedRowCount: number){
    const logger = getLogSidecar();
    try {
      // Get all merged cell ranges from source worksheet
      const mergedCells = Array.from(srcWorksheet.model.merges || []);

      // Load them in
      for (let i = 0; i < copiedRowCount; i++) {
        await dstWorksheet.getRow(dstStartRow + i);
      }

      for (const srcRange of mergedCells) {
        logger.info(`[Merger] ==> ${srcRange}`)
        if (typeof srcRange !== 'string') continue;

        const rangeParts = srcRange.split(':');

        if (rangeParts.length !== 2) continue;

        const startCell = this.parseCellAddress(rangeParts[0]);
        const endCell = this.parseCellAddress(rangeParts[1]);

        // Check if the merged range is within our copied data
        if (!(startCell.row <= copiedRowCount && endCell.row <= copiedRowCount))
          continue;


        // Adjust row numbers for destination
        const dstStartCell = `${startCell.column}${startCell.row + dstStartRow}`;
        const dstEndCell = `${endCell.column}${endCell.row + dstStartRow}`;
        const dstRange = `${dstStartCell}:${dstEndCell}`;

        // Merge cells in destination worksheet
        logger.info(`[Merger] <== ${dstRange}`)
        await dstWorksheet.mergeCells(dstRange);
      }
      
      logger.info(`[Report Merger] Merged cells`);
    } catch (error) {
      logger.warn(`[Report Merger] Error copying merged cells: ${error}`);
    }
  }


  static parseCellAddress(cellAddress: string): { column: string, row: number } {
    const match = cellAddress.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error(`Invalid cell address: ${cellAddress}`);
    }
    
    return {
      column: match[1],
      row: parseInt(match[2], 10)
    };
  }

  static columnNumberToLetter(columnNumber: number): string {
    let columnLetter = '';
    while (columnNumber > 0) {
      const remainder = (columnNumber - 1) % 26;
      columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return columnLetter;
  }

  static columnLetterToNumber(columnLetter: string): number {
    let columnNumber = 0;
    for (let i = 0; i < columnLetter.length; i++) {
      columnNumber = columnNumber * 26 + (columnLetter.charCodeAt(i) - 64);
    }
    return columnNumber;
  }
}