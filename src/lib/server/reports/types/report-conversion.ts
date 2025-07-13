import ExcelJS, { type Cell } from 'exceljs';
import type { CellStyle } from './report-types.js';


export class reportConversion {
  public static columnLetterToNumber(letter: string): number{
    let result = 0;
    for (let i = 0; i < letter.length; i++) {
      result = result * 26 + (letter.charCodeAt(i) - 64);
    }
    return result;
  }

  public static parseAddress(address: string): { column: string; row: number } {
    const match = address.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error(`Invalid address format: ${address}`);
    }
    return {
      column: match[1],
      row: parseInt(match[2], 10)
    };
  }

  /**
   * Adjust cell range by adding row and column offsets
   */
  public static adjustCellRange(range: string, rowOffset: number, colOffset: number): string {
    const [start, end] = range.split(':');
    const adjustedStart = this.adjustCellAddress(start, rowOffset, colOffset);
    const adjustedEnd = this.adjustCellAddress(end, rowOffset, colOffset);
    return `${adjustedStart}:${adjustedEnd}`;
  }

  /**
   * Adjust cell address by adding row and column offsets
   */
  public static adjustCellAddress(address: string, rowOffset: number, colOffset: number): string {
    const match = address.match(/^([A-Z]+)(\d+)$/);
    if (!match) return address;
    
    const [, colStr, rowStr] = match;
    const row = parseInt(rowStr) + rowOffset;
    const col = this.columnNameToNumber(colStr) + colOffset;
    const newColStr = this.numberToColumnName(col);
    
    return `${newColStr}${row}`;
  }

  /**
   * Convert Excel column name to number (A = 1, B = 2, etc.)
   */
  public static columnNameToNumber(colName: string): number {
    let result = 0;
    for (let i = 0; i < colName.length; i++) {
      result = result * 26 + (colName.charCodeAt(i) - 64);
    }
    return result;
  }

  /**
   * Convert column number to Excel column name (1 = A, 2 = B, etc.)
   */
  public static numberToColumnName(num: number): string {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  }


  /**
   * Convert internal CellStyle to ExcelJS style
   */
  public static applyCellStyle(cell: Cell, style: CellStyle): Partial<ExcelJS.Style> {
    
    if (style.font) {
      cell.style.font = {
        bold: style.font.bold,
        italic: style.font.italic,
        underline: style.font.underline,
        size: style.font.size,
        color: style.font.color ? { argb: style.font.color.replace('#', '') } : { argb: '000000' },
        name: style.font.name
      };
    }
    
    if (style.fill) {
      cell.style.fill = {
        type: 'pattern',
        pattern: style.fill.pattern || 'solid',
        fgColor: { argb: style.fill.fgColor?.replace('#', '') || 'FFFFFF' },
        bgColor: { argb: style.fill.bgColor?.replace('#', '') || 'FFFFFF' }
      };
    }
    
    if (style.border) {
      cell.style.border = {};
      ['top', 'bottom', 'left', 'right'].forEach(side => {
        const borderSide = style.border![side as keyof typeof style.border];
        if (borderSide) {
          cell.style.border![side as keyof ExcelJS.Borders] = {
            style: borderSide.style as ExcelJS.BorderStyle,
            color: { argb: borderSide.color?.replace('#', '') || '000000' }
          };
        }
      });
    }
    
    if (style.alignment) {
      cell.style.alignment = {
        horizontal: style.alignment.horizontal as ExcelJS.Alignment['horizontal'],
        vertical: style.alignment.vertical as ExcelJS.Alignment['vertical'],
        wrapText: style.alignment.wrapText,
        textRotation: style.alignment.textRotation
      };
    }
    
    if (style.numberFormat) {
      cell.style.numFmt = style.numberFormat;
    }
    
    return cell;
  }
    
}