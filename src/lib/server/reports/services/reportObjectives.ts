import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { ExcelMerger } from '../merger/report-merger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class HealthReportService {
  static async generate(): Promise<ExcelJS.Buffer> {
    // Define the templates to merge for health report
    const templateDir = path.resolve(__dirname, '../templates/');
    const templateFiles = [
      'TEMPLATE_A2-Health.xlsx',
      'TEMPLATE_B1-EduObject.xlsx', 
      'TEMPLATE_C1-SocObject.xlsx',
      'TEMPLATE_D1-LivObject.xlsx'
    ];
    
    // Load all template workbooks
    const workbooks: ExcelJS.Workbook[] = [];
    
    for (const fileName of templateFiles) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(path.join(templateDir, fileName));
      workbooks.push(workbook);
    }
    
    // Merge all templates into a single workbook
    const mergedBuffer = await ExcelMerger.mergeWorkbooks(workbooks);
    
    return mergedBuffer;
  }
}