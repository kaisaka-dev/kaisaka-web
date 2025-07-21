import { educationStatusModel } from "$lib/models/educationStatusModel.js";
import type { tableRow, viewRow } from "$lib/types/manager.js";
import ExcelJS, { type Worksheet } from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from "../../../../lib/types/supabase.js";
import { ReportGenerator } from "./reportTemplate.js";



export class ReportGeneratorEducationInfo extends ReportGenerator{
  
  static async insertAccessToEducValues(worksheet: ExcelJS.Worksheet){
      const { data: data1, error: err1 } = await supabase
      .from('education_access_summary')
      .select('*');
  
      const { data: data2, error: err2 } = await supabase
      .from('education_type_summary')
      .select('*')
      .ilike('disability_nature', '%down syndrome%');
  
      if (err1 || err2 || !data1 || !data2) {
          console.error('Error fetching data', err1 || err2);
          return false;
      }
      const allData = data1 as viewRow<'education_access_summary'>[]

      const downSyndromeData = data2 as viewRow<'education_type_summary'>[]
  
      console.log("All Data: ", allData)
      // Map for Excel cell positions
      const allCellMap: Record<string, string> = {
          "0-5 yrs old|Male|enrolled": "I6",
          "0-5 yrs old|Female|enrolled": "J6",
          "0-5 yrs old|Male|dropped_out": "K6",
          "0-5 yrs old|Female|dropped_out": "L6",
          "0-5 yrs old|Male|completed": "M6",
          "0-5 yrs old|Female|completed": "N6",
  
          "6-11 yrs old|Male|Inclusive": "I8",
          "6-11 yrs old|Female|Inclusive": "J8",
          "6-11 yrs old|Male|Integrated": "K8",
          "6-11 yrs old|Female|Integrated": "L8",
          "6-11 yrs old|Male|Special": "M8",
          "6-11 yrs old|Female|Special": "N8",
  
          "12-17 yrs old|Male|Inclusive": "I10",
          "12-17 yrs old|Female|Inclusive": "J10",
          "12-17 yrs old|Male|Integrated": "K10",
          "12-17 yrs old|Female|Integrated": "L10",
          "12-17 yrs old|Male|Special": "M10",
          "12-17 yrs old|Female|Special": "N10",
  
          "18-25 yrs old|Male|Inclusive": "I12",
          "18-25 yrs old|Female|Inclusive": "J12",
          "18-25 yrs old|Male|Integrated": "K12",
          "18-25 yrs old|Female|Integrated": "L12",
          "18-25 yrs old|Male|Special": "M12",
          "18-25 yrs old|Female|Special": "N12",
  
          "26 and older|Male|Inclusive": "I14",
          "26 and older|Female|Inclusive": "J14",
          "26 and older|Male|Integrated": "K14",
          "26 and older|Female|Integrated": "L14",
          "26 and older|Male|Special": "M14",
          "26 and older|Female|Special": "N14",
      };
  
      const dsCellMap: Record<string, string> = {
          "0-5 yrs old|Male|enrolled": "I7",
          "0-5 yrs old|Female|enrolled": "J7",
          "0-5 yrs old|Male|dropped_out": "K7",
          "0-5 yrs old|Female|dropped_out": "L7",
          "0-5 yrs old|Male|completed": "M7",
          "0-5 yrs old|Female|completed": "N7",
  
          "6-11 yrs old|Male|Inclusive": "I9",
          "6-11 yrs old|Female|Inclusive": "J9",
          "6-11 yrs old|Male|Integrated": "K9",
          "6-11 yrs old|Female|Integrated": "L9",
          "6-11 yrs old|Male|Special": "M9",
          "6-11 yrs old|Female|Special": "N9",
  
          "12-17 yrs old|Male|Inclusive": "I11",
          "12-17 yrs old|Female|Inclusive": "J11",
          "12-17 yrs old|Male|Integrated": "K11",
          "12-17 yrs old|Female|Integrated": "L11",
          "12-17 yrs old|Male|Special": "M11",
          "12-17 yrs old|Female|Special": "N11",
  
          "18-25 yrs old|Male|Inclusive": "I13",
          "18-25 yrs old|Female|Inclusive": "J13",
          "18-25 yrs old|Male|Integrated": "K13",
          "18-25 yrs old|Female|Integrated": "L13",
          "18-25 yrs old|Male|Special": "M13",
          "18-25 yrs old|Female|Special": "N13",
  
          "26 and older|Male|Inclusive": "I15",
          "26 and older|Female|Inclusive": "J15",
          "26 and older|Male|Integrated": "K15",
          "26 and older|Female|Integrated": "L15",
          "26 and older|Male|Special": "M15",
          "26 and older|Female|Special": "N15",
      };
  
      const updateCells = async (data: viewRow<'education_access_summary'>[] | viewRow<'education_type_summary'>[], map: Record<string, string>,) => {
          console.log('--- Updating Cells ---');
          await Promise.all(data.flatMap(async (row)=>{
            const key = `${row.age_group}|${row.sex}|${row.student_status_type}`;
            const cell = map[key];
            if (!cell) {
                console.log('[SKIP] No cell for:', key);
                return;
            }
            console.log("Key: ", key)
            console.log("Cell: ", cell)
            console.log("Total: ", row.total)
            worksheet.getCell(cell).value = row.total;
          }))
      };
  
      const addFormulas = () => {
      console.log('--- Adding Formulas ---');
      
      for (let i = 0; i < 10; i++) {
          const col = String.fromCharCode(69 + i); // ASCII 69 = 'E', goes E to N
  
          if (col === 'F' || col === 'H') continue; // Skip columns J and L
  
          //use rows in the MERGED sheet rather than the template.
          const oddRows = [111, 113, 115, 117, 119].map(r => `${col}${r}`).join(',');
          const evenRows = [112, 114, 116, 118, 120].map(r => `${col}${r}`).join(',');
  
          worksheet.getCell(`${col}16`).value = {
          formula: `IF(SUM(${oddRows})=0, "", SUM(${oddRows}))`
          };
  
          worksheet.getCell(`${col}17`).value = {
          formula: `IF(SUM(${evenRows})=0, "", SUM(${evenRows}))`
          };
      }
      };
  
      await Promise.all([
        await updateCells(allData, allCellMap),
        await updateCells(downSyndromeData, dsCellMap)
      ])
      addFormulas();
      return true;
  }
  
  static async insertTypeOfEducValues(worksheet: ExcelJS.Worksheet) {
    // Fetch all records (should be within a given year/month)
    const { data: data1, error: err1 } = await supabase
      .from('education_type_summary')
      .select('*');
    
    const { data: data2, error: err2 } = await supabase
      .from('education_type_summary')
      .select('*')
      .ilike('disability_nature', '%down syndrome%');
  
    if (err1 || err2 || !data1 || !data2) {
      console.error('Error fetching data', err1 || err2);
      return false;
    }
  
    const allData = data1 as viewRow<'education_type_summary'>[]

    const downSyndromeData = data2 as viewRow<'education_access_summary'>[]

    console.log("All Data: ", allData)

    // Map for Excel cell positions
    const allDisabilitiesCellMap: Record<string, string> = {
      "0-5 yrs old|Male|Inclusive": "E23",
      "0-5 yrs old|Female|Inclusive": "F23",
      "0-5 yrs old|Male|Integrated": "G23",
      "0-5 yrs old|Female|Integrated": "H23",
      "0-5 yrs old|Male|Special": "I23",
      "0-5 yrs old|Female|Special": "K23",
      "0-5 yrs old|Male|Nonformal": "M23",
      "0-5 yrs old|Female|Nonformal": "N23",
  
      "6-11 yrs old|Male|Inclusive": "E25",
      "6-11 yrs old|Female|Inclusive": "F25",
      "6-11 yrs old|Male|Integrated": "G25",
      "6-11 yrs old|Female|Integrated": "H25",
      "6-11 yrs old|Male|Special": "I25",
      "6-11 yrs old|Female|Special": "K25",
      "6-11 yrs old|Male|Nonformal": "M25",
      "6-11 yrs old|Female|Nonformal": "N25",
  
      "12-17 yrs old|Male|Inclusive": "E27",
      "12-17 yrs old|Female|Inclusive": "F27",
      "12-17 yrs old|Male|Integrated": "G27",
      "12-17 yrs old|Female|Integrated": "H27",
      "12-17 yrs old|Male|Special": "I27",
      "12-17 yrs old|Female|Special": "K27",
      "12-17 yrs old|Male|Nonformal": "M27",
      "12-17 yrs old|Female|Nonformal": "N27",
  
      "18-25 yrs old|Male|Inclusive": "E29",
      "18-25 yrs old|Female|Inclusive": "F29",
      "18-25 yrs old|Male|Integrated": "G29",
      "18-25 yrs old|Female|Integrated": "H29",
      "18-25 yrs old|Male|Special": "I29",
      "18-25 yrs old|Female|Special": "K29",
      "18-25 yrs old|Male|Nonformal": "M29",
      "18-25 yrs old|Female|Nonformal": "N29",
  
      "26 and older|Male|Inclusive": "E31",
      "26 and older|Female|Inclusive": "F31",
      "26 and older|Male|Integrated": "G31",
      "26 and older|Female|Integrated": "H31",
      "26 and older|Male|Special": "I31",
      "26 and older|Female|Special": "K31",
      "26 and older|Male|Nonformal": "M31",
      "26 and older|Female|Nonformal": "N31",
    };
  
    const downSyndromeCellMap: Record<string, string> = {
      "0-5 yrs old|Male|Inclusive": "E24",
      "0-5 yrs old|Female|Inclusive": "F24",
      "0-5 yrs old|Male|Integrated": "G24",
      "0-5 yrs old|Female|Integrated": "H24",
      "0-5 yrs old|Male|Special": "I24",
      "0-5 yrs old|Female|Special": "K24",
      "0-5 yrs old|Male|Nonformal": "M24",
      "0-5 yrs old|Female|Nonformal": "N24",
  
      "6-11 yrs old|Male|Inclusive": "E26",
      "6-11 yrs old|Female|Inclusive": "F26",
      "6-11 yrs old|Male|Integrated": "G26",
      "6-11 yrs old|Female|Integrated": "H26",
      "6-11 yrs old|Male|Special": "I26",
      "6-11 yrs old|Female|Special": "K26",
      "6-11 yrs old|Male|Nonformal": "M26",
      "6-11 yrs old|Female|Nonformal": "N26",
  
      "12-17 yrs old|Male|Inclusive": "E28",
      "12-17 yrs old|Female|Inclusive": "F28",
      "12-17 yrs old|Male|Integrated": "G28",
      "12-17 yrs old|Female|Integrated": "H28",
      "12-17 yrs old|Male|Special": "I28",
      "12-17 yrs old|Female|Special": "K28",
      "12-17 yrs old|Male|Nonformal": "M28",
      "12-17 yrs old|Female|Nonformal": "N28",
  
      "18-25 yrs old|Male|Inclusive": "E30",
      "18-25 yrs old|Female|Inclusive": "F30",
      "18-25 yrs old|Male|Integrated": "G30",
      "18-25 yrs old|Female|Integrated": "H30",
      "18-25 yrs old|Male|Special": "I30",
      "18-25 yrs old|Female|Special": "K30",
      "18-25 yrs old|Male|Nonformal": "M30",
      "18-25 yrs old|Female|Nonformal": "N30",
  
      "26 and older|Male|Inclusive": "E32",
      "26 and older|Female|Inclusive": "F32",
      "26 and older|Male|Integrated": "G32",
      "26 and older|Female|Integrated": "H32",
      "26 and older|Male|Special": "I32",
      "26 and older|Female|Special": "K32",
      "26 and older|Male|Nonformal": "M32",
      "26 and older|Female|Nonformal": "N32",
    };
  
    const updateCells = async (data: viewRow<'education_type_summary'>[] | viewRow<'education_access_summary'>[], map: Record<string, string>) => {
      console.log('--- Updating Cells ---');
      await Promise.all(data.flatMap(async (row)=>{
        const key = `${row.age_group}|${row.sex}|${row.education_type}`;
        const cell = map[key];
        if (!cell) {
          console.log('[SKIP] No cell for:', key);
          return;
        }
        console.log("Key: ", key)
        console.log("Cell: ", cell)
        console.log("Total: ", row.total)
        worksheet.getCell(cell).value = row.total;
      }))
    };
  
    const addFormulas = () => {
      console.log('--- Adding Formulas ---');
      
      for (let i = 0; i < 10; i++) {
        const col = String.fromCharCode(69 + i); // ASCII 69 = 'E', goes E to N
  
        if (col === 'J' || col === 'L') continue; // Skip columns J and L
  
        //use rows in the MERGED sheet rather than the template.
        const oddRows = [128, 130, 132, 134, 136].map(r => `${col}${r}`).join(',');
        const evenRows = [129, 131, 133, 135, 137].map(r => `${col}${r}`).join(',');
  
        worksheet.getCell(`${col}33`).value = {
          formula: `IF(SUM(${oddRows})=0, "", SUM(${oddRows}))`
        };
  
        worksheet.getCell(`${col}34`).value = {
          formula: `IF(SUM(${evenRows})=0, "", SUM(${evenRows}))`
        };
      }
    };
    await Promise.all([
      await updateCells(allData, allDisabilitiesCellMap),
      await updateCells(downSyndromeData, downSyndromeCellMap)
    ])
    
  
    addFormulas();
  
    return true;
  }
  
  static async generateData(workbook: ExcelJS.Workbook, sheet: Worksheet) {
    let res1 = false, res2 = false

    const writeEducationValues = async () => res1 = await this.insertAccessToEducValues(sheet)

    const writeTypeOfEducValues = async() => res2 = await this.insertTypeOfEducValues(sheet)

    await Promise.all([ writeEducationValues(), writeTypeOfEducValues()])

    if (!res1 || !res2) throw new Error('Failed to insert values');

    return await workbook.xlsx.writeBuffer();
  }

  static async generateReport(): Promise<ExcelJS.Buffer> { 
    const { data, error } = await this.generateWorkbook('TEMPLATE_B2-EduInfo.xlsx')

    if (error) throw new Error('Error opening worksheet');

    const { sheet, workbook } = data
    
    return await this.generateData(workbook, sheet);
  }
}