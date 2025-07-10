// src/lib/reports/ExcelGenerator.ts
import * as XLSX from 'xlsx';
import type { CellStyle, ExcelReportData, MergedCell, PositionedCell, ReportMetadata } from './report-types.js';

export class ExcelGenerator {
  /**
   * Generate the excelsheet
   * @param reportData Report Data to append
   * @returns 
   */
  static generateExcel(reportData: ExcelReportData): Buffer {
    const workbook = XLSX.utils.book_new();
    const sheetName = reportData.title.replace(/[^\w\s]/gi, '').substring(0, 31);
    
    // Calculate starting row for data (after merged cells)
    const dataStartRow = reportData.mergedCells ? 3 : 1;
    
    // Create worksheet structure
    const worksheet = this.createWorksheet(reportData, dataStartRow);
    
    // Apply merged cells
    if (reportData.mergedCells) this.applyMergedCells(worksheet, reportData.mergedCells);
    
    if (reportData.floatingCells) this.applyFloatingCells(worksheet, reportData.floatingCells);


    // Apply formatting
    this.applyAdvancedFormatting(worksheet, reportData, dataStartRow);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Add metadata sheet
    const metadataSheet = this.createMetadataSheet(reportData.metadata);

    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');
    
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
  
  /**
   * Create a Worksheet page
   * @param reportData 
   * @param dataStartRow 
   * @returns XLSX.WorkSheet
   */
  private static createWorksheet(reportData: ExcelReportData, dataStartRow: number): XLSX.WorkSheet {
    const headers = reportData.columns.map(col => col.title);
    const data = reportData.data.map(row => 
      reportData.columns.map(col => row[col.key])
    );
    
    // Create empty rows for merged cells if needed
    const emptyRows = Array(dataStartRow - 1).fill(Array(headers.length).fill(''));
    
    const allData = [
      ...emptyRows,
      headers,
      ...data
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    
    return worksheet;
  }

  private static convertCellStyle(style: CellStyle): Partial<CellStyle> {
    const excelStyle: any = {};
    if (style.font) {
      excelStyle.font = {
        bold: style.font.bold,
        italic: style.font.italic,
        underline: style.font.underline,
        sz: style.font.size,
        color: style.font.color ? { rgb: style.font.color } : '000000',
        name: style.font.name
      };
    }
    
    if (style.fill) {
      excelStyle.fill = {
        fgColor: { rgb: style.fill.fgColor },
        bgColor: { rgb: style.fill.bgColor },
        patternType: style.fill.pattern || 'solid'
      };
    }
    
    if (style.border) {
      excelStyle.border = {};
      ['top', 'bottom', 'left', 'right'].forEach(side => {
        const borderSide = style.border![side as keyof typeof style.border];
        if (borderSide) {
          excelStyle.border[side] = {
            style: borderSide.style,
            color: { rgb: borderSide.color || '000000' }
          };
        }
      });
    }
    
    if (style.alignment) {
      excelStyle.alignment = {
        horizontal: style.alignment.horizontal,
        vertical: style.alignment.vertical,
        wrapText: style.alignment.wrapText,
        textRotation: style.alignment.textRotation
      };
    }
    
    if (style.numberFormat) {
      excelStyle.numFmt = style.numberFormat;
    }
    
    return excelStyle;
  }
  
  private static applyFloatingCells(worksheet: XLSX.WorkSheet, floatingCells?: PositionedCell[]): void {
    if (!floatingCells) return;

    floatingCells.forEach(cell => {
      worksheet[cell.address] = {
        v: cell.value,
        t: typeof cell.value === 'number' ? 'n' : 's'
      };
      if (cell.style) {
        worksheet[cell.address].s = this.convertCellStyle(cell.style);
      }
    });
}

  private static applyMergedCells(worksheet: XLSX.WorkSheet, mergedCells: MergedCell[]): void {
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    
    mergedCells.forEach(mergedCell => {
      const range = XLSX.utils.decode_range(mergedCell.range);
      
      worksheet['!merges']?.push(range);
      
      // Set the value in the top-left cell of the merged range
      const topLeftCell = XLSX.utils.encode_cell(range.s);

      worksheet[topLeftCell] = {
        v: mergedCell.value,
        t: 's'
      };
      
      // Apply style to merged cell
      if (mergedCell.style) worksheet[topLeftCell].s = this.convertCellStyle(mergedCell.style);
      
    });
  }

  private static appendHeaderFormatting(worksheet: XLSX.WorkSheet, reportData: ExcelReportData, dataStartRow: number, range: XLSX.Range) {
    if (!reportData.headerStyle) return worksheet
      
    const startingColumn = range.s.c;
    const endingColumn = range.e.c;
    
    for (let col = startingColumn; col <= endingColumn; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: dataStartRow, c: col });
      
      if (headerCell && worksheet[headerCell]) {
        const style = this.convertCellStyle(reportData.headerStyle)

        worksheet[headerCell].s = style 
      };
    }

    return worksheet
  }

  private static appendDataFormatting(worksheet: XLSX.WorkSheet, reportData: ExcelReportData, dataStartRow: number, range: XLSX.Range) {
    // Apply data formatting
    if (!reportData.dataStyle) return worksheet
    

    for (let row = dataStartRow + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        
        if (worksheet[cellAddress]) worksheet[cellAddress].s = this.convertCellStyle(reportData.dataStyle);
      }
    }

    return worksheet
  }
  
  private static applyAdvancedFormatting(worksheet: XLSX.WorkSheet, reportData: ExcelReportData, dataStartRow: number): void {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    [this.appendHeaderFormatting.bind(this), this.appendDataFormatting.bind(this)].forEach((el)=>{
      worksheet = el.call(this, worksheet, reportData, dataStartRow, range)
    })    
    
    // Apply column-specific formatting
    reportData.columns.forEach((col, colIndex) => {
      const columnStyle: CellStyle = {
        alignment: { horizontal: col.alignment ?? 'left' }
      };
      
      if (col.type === 'currency') {
        columnStyle.numberFormat = col.format || '$#,##0.00';
      } else if (col.type === 'percentage') {
        columnStyle.numberFormat = '0.00%';
      } else if (col.type === 'date') {
        columnStyle.numberFormat = col.format || 'mm/dd/yyyy';
      }
      
      // Apply to data cells
      for (let row = dataStartRow + 1; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            ...this.convertCellStyle(columnStyle)
          };
        }
      }
    });
  }

  
  
  
  private static createMetadataSheet(metadata: ReportMetadata): XLSX.WorkSheet {
    const metadataData = [
      ['Report Metadata', ''],
      ['Generated At', metadata.generatedAt.toISOString()],
      ['Generated By', metadata.generatedBy],
      ['Total Records', metadata.totalRecords],
      ['Filters', JSON.stringify(metadata.filters, null, 2)]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(metadataData);
    
    // Style the metadata sheet
    const headerStyle = {
      font: { bold: true, sz: 14 },
      fill: { fgColor: { rgb: '366092' } },
      alignment: { horizontal: 'center' }
    };
    
    if (worksheet['A1']) {
      worksheet['A1'].s = headerStyle;
    }
    
    return worksheet;
  }
}

