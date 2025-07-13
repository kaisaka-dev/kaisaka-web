// src/lib/reports/definitions/AccomplishmentReport.ts
import type { ExcelReportData } from '../types/report-types.js';

export const AccomplishmentReport: ExcelReportData = {
  title: 'KAISAKA INC. Accomplishment Report',
  rowOffset: 5,
  // Define columns in the order they appear once the data starts
  columns: [
    { key: 'age', title: 'Age', alignment: 'left', type: 'text' },
    { key: 'totalEnrolled', title: 'Total Number of Children and Youngsters in the Program', alignment: 'center', type: 'number' },
    { key: 'withIntervention', title: 'Total of children and youngsters with an individual intervention', alignment: 'center', type: 'number' },
    { key: 'improved', title: 'Total no of children improved in line with the targets of the individual intervention plan', alignment: 'center', type: 'number' },
    { key: 'transition', title: 'Total no of children with a transition and/or graduation plan', alignment: 'center', type: 'number' },
    { key: 'boys', title: 'Boys', alignment: 'center', type: 'number' },
    { key: 'girls', title: 'Girls', alignment: 'center', type: 'number' },
  ],

  // Actual row-by-row data
  data: [
    { age: '0–5 years old with Down Syndrome', totalEnrolled: 44, withIntervention: 18, improved: 27, transition: 12, boys: 22, girls: 22 },
    { age: '6–11 years old with Down Syndrome', totalEnrolled: 25, withIntervention: 13, improved: 17, transition: 8, boys: 13, girls: 12 },
    { age: '12–17 years old with Down Syndrome', totalEnrolled: 7, withIntervention: 1, improved: 3, transition: 5, boys: 4, girls: 3 },
    { age: '18–25 years old with Down Syndrome', totalEnrolled: 1, withIntervention: 1, improved: 1, transition: 1, boys: 1, girls: 0 },
    { age: 'TOTAL BOYS AND GIRLS ALL DISABILITY', totalEnrolled: 87, withIntervention: 38, improved: 52, transition: 29, boys: 45, girls: 42 },
    { age: 'TOTAL BOYS AND GIRLS OTHER DISABILITIES EXCEPT DOWN SYNDROME', totalEnrolled: 85, withIntervention: 36, improved: 50, transition: 27, boys: 43, girls: 42 },
    { age: 'Total (children and youth with DS)', totalEnrolled: 2, withIntervention: 2, improved: 2, transition: 2, boys: 2, girls: 0 },
  ],

  // Merge cells for titles and summary information
  mergedCells: [
    // Main title across all columns
    { 
      range: 'A1:G1', 
      value: 'KAISAKA INC. Accomplishment Report', 
      style: { 
        font: { bold: true, size: 16 }, 
        alignment: { horizontal: 'center' },
        fill: { fgColor: 'E6F3FF', pattern: 'solid' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      } 
    },
    // Subtitle/note across all columns
    { 
      range: 'A2:G2', 
      value: 'Note: Use your Project Proposal and Activity and Budget in Reporting', 
      style: { 
        font: { italic: true, size: 10 }, 
        alignment: { horizontal: 'center' },
        fill: { fgColor: 'F0F8FF', pattern: 'solid' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      } 
    },
  ],

  // Floating cells for summary statistics
  floatingCells: [
    // TARGET section (row 4)
    {
      address: 'A4',
      value: 'TARGET No. of CWDS',
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'FFFFCC', pattern: 'solid' },
        alignment: { horizontal: 'left' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    {
      address: 'B4',
      value: 150,
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'FFFFCC', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    
    // Old cases carried over (row 4)
    {
      address: 'D4',
      value: 'old cases carried over',
      style: {
        font: { bold: true, size: 10 },
        fill: { fgColor: 'E6F3FF', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    {
      address: 'E4',
      value: 120,
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'E6F3FF', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    
    // New children current year (row 4)
    {
      address: 'F4',
      value: 'new child (current year)',
      style: {
        font: { bold: true, size: 10 },
        fill: { fgColor: 'FFE6E6', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    {
      address: 'G4',
      value: 5,
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'FFE6E6', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    
    // ACTUAL SERVED section (row 5)
    {
      address: 'A5',
      value: 'ACTUAL SERVED Total CWDS',
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'D9E1F2', pattern: 'solid' },
        alignment: { horizontal: 'left' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
    {
      address: 'B5',
      value: 125,
      style: {
        font: { bold: true, size: 11 },
        fill: { fgColor: 'D9E1F2', pattern: 'solid' },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: '000000' },
          bottom: { style: 'thin', color: '000000' },
          left: { style: 'thin', color: '000000' },
          right: { style: 'thin', color: '000000' }
        }
      }
    },
  ],

  // Table-wide header styling
  headerStyle: {
    font: { bold: true, size: 11 },
    fill: { fgColor: 'D9E1F2', pattern: 'solid' },
    alignment: { horizontal: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: '000000' },
      bottom: { style: 'thin', color: '000000' },
      left: { style: 'thin', color: '000000' },
      right: { style: 'thin', color: '000000' }
    }
  },

  // Table-wide data styling
  dataStyle: {
    alignment: { horizontal: 'center', wrapText: true },
    border: {
      top: { style: 'thin', color: '000000' },
      bottom: { style: 'thin', color: '000000' },
      left: { style: 'thin', color: '000000' },
      right: { style: 'thin', color: '000000' }
    }
  },

  // Metadata for the "Metadata" sheet
  metadata: {
    generatedAt: new Date(),
    generatedBy: 'KAISAKA INC. System',
    totalRecords: 7,
    filters: { 
      reportMonth: 'June', 
      reportYear: '2024',
      downSyndrome: true,
      organization: 'KAISAKA INC.'
    },
  },
};