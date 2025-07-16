import { supabase } from "../../../../lib/types/supabase.js";
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '../../../../lib/server/reports/templates/');
const fileName = 'TEMPLATE_B2-EduInfo.xlsx'

async function insertAccessToEducValues(worksheet: ExcelJS.Worksheet){
    return true
}

async function insertTypeOfEducValues(worksheet: ExcelJS.Worksheet) {

    console.log('Using worksheet:', worksheet.name);

  // Fetch all records
  const { data: allData, error: err1 } = await supabase
    .from('education_type_summary')
    .select('*');

  const { data: downSyndromeData, error: err2 } = await supabase
    .from('education_type_summary')
    .select('*')
    .ilike('disability_nature', '%down syndrome%');

  if (err1 || err2 || !allData || !downSyndromeData) {
    console.error('Error fetching data', err1 || err2);
    return false;
  }

  console.log("All Data: ", allData)
  // Map for Excel cell positions
  /**
   * "Home Program", "Nonformal", "Integrated/SNED","Inclusive/Gen. Ed."
   * , ,, , 
   */
  const allCellMap: Record<string, string> = {
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
    "12-17 yrs old|Male|Home Program": "I27",
    "12-17 yrs old|Female|Home Program": "K27",
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

  const dsCellMap: Record<string, string> = {
    "0-5 yrs old|Male|Inclusive/Gen. Ed.": "E24",
    "0-5 yrs old|Female|Inclusive/Gen. Ed.": "F24",
    "0-5 yrs old|Male|Integrated/SNED": "G24",
    "0-5 yrs old|Female|Integrated/SNED": "H24",
    "0-5 yrs old|Male|Home Program": "I24",
    "0-5 yrs old|Female|Home Program": "K24",
    "0-5 yrs old|Male|Nonformal": "M24",
    "0-5 yrs old|Female|Nonformal": "N24",

    "6-11 yrs old|Male|Inclusive/Gen. Ed.": "E26",
    "6-11 yrs old|Female|Inclusive/Gen. Ed.": "F26",
    "6-11 yrs old|Male|Integrated/SNED": "G26",
    "6-11 yrs old|Female|Integrated/SNED": "H26",
    "6-11 yrs old|Male|Home Program": "I26",
    "6-11 yrs old|Female|Home Program": "K26",
    "6-11 yrs old|Male|Nonformal": "M26",
    "6-11 yrs old|Female|Nonformal": "N26",

    "12-17 yrs old|Male|Inclusive/Gen. Ed.": "E28",
    "12-17 yrs old|Female|Inclusive/Gen. Ed.": "F28",
    "12-17 yrs old|Male|Integrated/SNED": "G28",
    "12-17 yrs old|Female|Integrated/SNED": "H28",
    "12-17 yrs old|Male|Home Program": "I28",
    "12-17 yrs old|Female|Home Program": "K28",
    "12-17 yrs old|Male|Nonformal": "M28",
    "12-17 yrs old|Female|Nonformal": "N28",

    "18-25 yrs old|Male|Inclusive": "E30",
    "18-25 yrs old|Female|Inclusive": "F30",
    "18-25 yrs old|Male|Integrated": "G30",
    "18-25 yrs old|Female|Integrated": "H30",
    "18-25 yrs old|Male|Home Program": "I30",
    "18-25 yrs old|Female|Home Program": "K30",
    "18-25 yrs old|Male|Nonformal": "M30",
    "18-25 yrs old|Female|Nonformal": "N30",

    "26 and older|Male|Inclusive": "E32",
    "26 and older|Female|Inclusive": "F32",
    "26 and older|Male|Integrated": "G32",
    "26 and older|Female|Integrated": "H32",
    "26 and older|Male|Home Program": "I32",
    "26 and older|Female|Home Program": "K32",
    "26 and older|Male|Nonformal": "M32",
    "26 and older|Female|Nonformal": "N32",
  };

  const updateCells = (
    data: any[],
    map: Record<string, string>,
  ) => {
    console.log('--- Updating Cells ---');
    for (const row of data) {
      const key = `${row.age_group}|${row.sex}|${row.education_type}`;
      const cell = map[key];
      if (!cell) {
        console.log('[SKIP] No cell for:', key);
        continue;
      }
      console.log("Key: ", key)
      console.log("Cell: ", cell)
      console.log("Total: ", row.total)
      worksheet.getCell(cell).value = row.total;
    }
  };

  const addFormulas = () => {
  console.log('--- Adding Formulas ---');
  
  for (let i = 0; i < 10; i++) {
    const col = String.fromCharCode(69 + i); // ASCII 69 = 'E', goes E to N

    if (col === 'J' || col === 'L') continue; // Skip columns J and L

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

  updateCells(allData, allCellMap);
  //updateCells(downSyndromeData, dsCellMap);
  addFormulas();
  return true;
}


export async function POST(){
    try {
        const workbook = new ExcelJS.Workbook();  
        await workbook.xlsx.readFile(path.join(templateDir, fileName));
        const worksheet = workbook.getWorksheet('B2-EduInfo'); 

        if (!worksheet)
            throw new Error('Error opening worksheet');

        const res1 = await insertAccessToEducValues(worksheet);
        const res2 = await insertTypeOfEducValues(worksheet); // This now queries the view

        if (!res1 || !res2)
            throw new Error('Failed to insert values');

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })
    } catch (err) {
        console.log(err);
    }
}