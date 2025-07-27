import { membersModel } from "$lib/models/membersModel.js";
import { getLogSidecar } from "$lib/server/logging/log-sidecar.js";
import type { Alignment, Borders, Cell, Fill, FillPattern, Font, Protection, Worksheet } from "exceljs";
import { ReportGenerator } from "./reportTemplate.js";

const logger = getLogSidecar()

// Types for the member query results based on Supabase schema
interface Address {
  address: string;
}

interface City {
  city_name: string;
}

interface Barangay {
  name: string;
  city_id: City;
}

interface DisabilityCategory {
  name: string;
}

interface PwdId {
  pwd_id: string;
  expiry_date: string; // date string from Supabase
}

interface ServiceCategory {
  name: string;
}

interface Intervention {
  intervention: string; // text field
  status: string; // USER-DEFINED enum as string
  service_category_id: ServiceCategory;
}

interface EducationStatus {
  education_type: string; // USER-DEFINED enum as string
  year_start: number; // smallint
  year_end: number | null; // smallint, nullable
  grade_level: string | null; // character varying, nullable
  student_status_type: string; // USER-DEFINED enum as string
}

interface SocialParticipation {
  participation_type: string; // USER-DEFINED enum as string
  year: number; // integer
}

interface SocialProtectionStatus {
  participates_family_life: boolean | null; // boolean, defaults to false but can be null
  participates_community_club: boolean | null; // boolean, defaults to false but can be null
  fam_year_accessed: number | null; // integer, nullable
  comm_year_accessed: number | null; // integer, nullable
}

interface Member {
  first_name: string;
  last_name: string;
}

interface Caregiver {
  contact_number: string;
  facebook_link: string | null; // character varying, nullable
  email: string | null; // character varying, nullable
  occupation: string | null; // character varying, nullable
  member_id: Member;
}

interface RelationshipCc {
  relationship: string | null; // character varying, nullable
  caregiver: Caregiver;
}

interface Child {
  id: string; // uuid
  is_active: boolean; // boolean, defaults to true
  disability_nature: string | null; // text, nullable
  has_philhealth: boolean; // boolean, defaults to false
  has_birth_cert: boolean; // boolean, defaults to false
  has_medical_cert: boolean; // boolean, defaults to false
  has_barangay_cert: boolean; // boolean, defaults to false
  has_vote: boolean; // boolean, defaults to false
  has_national_id: boolean; // boolean, defaults to false
  remarks: string | null; // text, nullable
  disability_id: DisabilityCategory | null; // foreign key, nullable
  pwd_id: PwdId | null; // foreign key, nullable
  intervention: Intervention[]; // array from join
  education_status: EducationStatus[]; // array from join
  social_participation: SocialParticipation[]; // array from join
  social_protection_status: SocialProtectionStatus[]; // array from join
  relationship_cc: RelationshipCc[]; // array from join
}

interface EmploymentStatus {
  able_to_work: boolean; // boolean, defaults to false
  employment_type: string | null; // USER-DEFINED enum as string, nullable
}

interface MemberResult {
  id: string; // uuid
  first_name: string;
  last_name: string;
  sex: string; // USER-DEFINED enum as string
  birthday: string | null; // date as string, nullable
  admission_date: string | null; // timestamp as string, nullable
  address_id: Address | null; // foreign key, nullable
  barangay_id: Barangay | null; // foreign key, nullable
  children: Child[]; // array from inner join
  employment_status: EmploymentStatus[]; // array from join
}

// Type for the results array
type MemberResults = MemberResult[];

const memberListSelectClause = `
  id,
  first_name, 
  last_name,
  sex,
  birthday,
  admission_date,
  address_id:addresses(address),
  barangay_id:barangays(
    name,
    city_id:cities(city_name)
  ),
  children!inner(
    id,
    is_active,
    disability_nature,
    has_philhealth,
    has_birth_cert,
    has_medical_cert,
    has_barangay_cert,
    has_vote,
    has_national_id,
    remarks,
    disability_id:disability_category(name),
    pwd_id:pwd_ids(
      pwd_id,
      expiry_date
    ),
    intervention(
      intervention,
      status,
      service_category_id:service_category(name)
    ),
    education_status(
      education_type,
      year_start,
      year_end,
      grade_level,
      student_status_type
    ),
    social_participation(
      participation_type,
      year
    ),
    social_protection_status(
      participates_family_life,
      participates_community_club,
      fam_year_accessed,
      comm_year_accessed
    ),
    relationship_cc(
      relationship,
      caregiver:caregivers(
        contact_number,
        facebook_link,
        email,
        occupation,
        member_id:members(
          first_name,
          last_name
        )
      )
    )
  ),
  employment_status(
    able_to_work,
    employment_type
  )
`;

function getAge(birthday: Date | string): number {
  if (!birthday) return 0;
  
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

// Helper function to format interventions by category
function formatInterventions(interventions: Intervention[], category?: string): string {
  if (!interventions || interventions.length === 0) return "";
  
  let filteredInterventions = interventions;
  
  if (category) {
    filteredInterventions = interventions.filter(intervention => 
      intervention.service_category_id?.name?.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  return filteredInterventions
    .map(intervention => `${intervention.intervention} (${intervention.status})`)
    .join('; ');
}


// Helper function to format social participation
function formatSocialParticipation(participation: SocialParticipation[]): string {
  if (!participation || participation.length === 0) return "";
  
  return participation
    .map(p => `${p.participation_type} (${p.year})`)
    .join('; ');
}

interface CellStyleData {
    font: Partial<Font> | null;
    fill: Fill | null;
    alignment: Partial<Alignment> | null;
    border: Partial<Borders> | null;
    numFmt: string | null;
    protection: Partial<Protection> | null;
}

interface RowStyleData extends CellStyleData {
    height?: number;
}

interface StoredStyleData {
    rowStyle: RowStyleData;
    cellStyles: { [colNumber: number]: CellStyleData };
    lastColumn: number;
}

class ExcelRowStyleManager {
    private storedStyles: Map<string, StoredStyleData>;

    constructor() {
        this.storedStyles = new Map<string, StoredStyleData>();
    }
    
    // Capture and store a row's style
    captureRowStyle(worksheet: Worksheet, rowNumber: number, styleName: string): void {
        const row = worksheet.getRow(rowNumber);
        
        // Get row-level styles
        const rowStyle: RowStyleData = {
            font: row.font ? { ...row.font } : { color: { argb: '000000' } },
            fill: row.fill ? { ...row.fill } : { type: 'pattern', pattern: 'none' },
            alignment: row.alignment ? { ...row.alignment } : null,
            border: row.border ? { ...row.border } : null,
            numFmt: row.numFmt || null,
            protection: row.protection ? { ...row.protection } : null,
            height: row.height
        };
        
        // Override fill to 'none' if it's undefined or has default red coloring
        if (!row.fill || !('fgColor' in rowStyle.fill!) || !(rowStyle.fill as FillPattern).fgColor) {
            rowStyle.fill = { type: 'pattern', pattern: 'none' };
        }
        
        // Get individual cell styles
        const cellStyles: { [colNumber: number]: CellStyleData } = {};
        row.eachCell({ includeEmpty: true }, (cell: Cell, colNumber: number) => {
            cellStyles[colNumber] = {
                font: cell.font ? { ...cell.font } : { color: { argb: '000000' } },
                fill: cell.fill ? { ...cell.fill } : { type: 'pattern', pattern: 'none' },
                alignment: cell.alignment ? { ...cell.alignment } : null,
                border: cell.border ? { ...cell.border } : null,
                numFmt: cell.numFmt || null,
                protection: cell.protection ? { ...cell.protection } : null
            };
            
            // Override fill to 'none' if it's undefined or has default coloring
            if (!cell.fill || !('fgColor' in cellStyles[colNumber].fill!) || !(cellStyles[colNumber].fill as FillPattern).fgColor) {
                cellStyles[colNumber].fill = { type: 'pattern', pattern: 'none' };
            }
        });
        
        this.storedStyles.set(styleName, {
            rowStyle,
            cellStyles,
            lastColumn: row.cellCount
        });
        
        console.log(`Style "${styleName}" captured from row ${rowNumber}`);
    }
    
    // Apply stored style to a target row
    applyRowStyle(worksheet: Worksheet, targetRowNumber: number, styleName: string): void {
        const styleData = this.storedStyles.get(styleName);
        if (!styleData) {
            console.error(`Style "${styleName}" not found`);
            return;
        }
        
        const targetRow = worksheet.getRow(targetRowNumber);
        
        // Apply row-level styles
        const { rowStyle, cellStyles } = styleData;
        
        if (rowStyle.font) targetRow.font = rowStyle.font;
        if (rowStyle.fill) targetRow.fill = rowStyle.fill;
        if (rowStyle.alignment) targetRow.alignment = rowStyle.alignment;
        if (rowStyle.border) targetRow.border = rowStyle.border;
        if (rowStyle.numFmt) targetRow.numFmt = rowStyle.numFmt;
        if (rowStyle.protection) targetRow.protection = rowStyle.protection;
        if (rowStyle.height) targetRow.height = rowStyle.height;
        
        // Apply individual cell styles
        Object.keys(cellStyles).forEach((colNumberStr: string) => {
            const colNumber = parseInt(colNumberStr);
            const cellStyle = cellStyles[colNumber];
            const targetCell = targetRow.getCell(colNumber);
            
            if (cellStyle.font) targetCell.font = cellStyle.font;
            if (cellStyle.fill) targetCell.fill = cellStyle.fill;
            if (cellStyle.alignment) targetCell.alignment = cellStyle.alignment;
            if (cellStyle.border) targetCell.border = cellStyle.border;
            if (cellStyle.numFmt) targetCell.numFmt = cellStyle.numFmt;
            if (cellStyle.protection) targetCell.protection = cellStyle.protection;
        });
        
        console.log(`Style "${styleName}" applied to row ${targetRowNumber}`);
    }
    
    // List all stored styles
    listStoredStyles(): string[] {
        return Array.from(this.storedStyles.keys());
    }
    
    // Remove a stored style
    removeStyle(styleName: string): boolean {
        return this.storedStyles.delete(styleName);
    }

    // Get stored style data (useful for inspection)
    getStoredStyle(styleName: string): StoredStyleData | undefined {
        return this.storedStyles.get(styleName);
    }

    // Check if style exists
    hasStyle(styleName: string): boolean {
        return this.storedStyles.has(styleName);
    }

    // Clear all stored styles
    clearAllStyles(): void {
        this.storedStyles.clear();
    }
}
export class ReportGeneratorChildList extends ReportGenerator {
  /**
   * Entry point for generating the full Excel report.
   *
   * @returns {Promise<Buffer>} - Buffer containing the Excel file.
   */
  static async generateReport() {
    logger.info('Started report for ChildList');
    const {data, error} = await this.generateWorkbook('TEMPLATE_ChildList.xlsx');
    
    if (error) throw error

    await this.generateData(data.sheet);

    return await data.workbook.xlsx.writeBuffer();
  }

  static async generateWorkbookReport() {
    logger.info('Started report for ChildList');
    const {data, error} = await this.generateWorkbook('TEMPLATE_ChildList.xlsx');
    
    if (error) throw error
    await this.generateData(data.sheet);

    return await data.workbook;
  }


  
  /**
   * Populates the Excel worksheet with all layers of report data.
   *
   * @param {Worksheet} worksheet - ExcelJS worksheet instance.
   */
  static async generateData(worksheet: Worksheet) {
    const results = await membersModel.instance.findWithJoin(memberListSelectClause) as MemberResults;
    logger.info(`Retrieved ${results?.length || 0} records for ChildList report`);

    if (!results || results.length === 0) {
      logger.warn('No results found for ChildList report');
      return;
    }
    const styleManager = new ExcelRowStyleManager()
    const rowOffset = 12

    const stylePositions = [
      { row: rowOffset, name: 'start_row' },
      { row: rowOffset + 1, name: 'middle_row' },
      { row: rowOffset + 2, name: 'end_row'   }
    ]

    stylePositions.forEach(async (stylePosition) => styleManager.captureRowStyle(worksheet, stylePosition.row, stylePosition.name))

  
    results.forEach(async (result, index) => {
      const row = worksheet.getRow(rowOffset + index);
      const cellOffset = 2;
      const age = getAge(result.birthday ?? new Date());
      
      // Get the first child record (since we're using inner join, there should be at least one)
      const child = result.children?.[0];
      
      if (!child) {
        logger.warn(`No child record found for member ${result.id}`);
        return;
      }

      // Format address
      const address = [
        result.address_id?.address || "",
        result.barangay_id?.name || "",
        result.barangay_id?.city_id?.city_name || ""
      ].filter(Boolean).join('; ');

      // Format interventions by category
      const healthInterventions = formatInterventions(child.intervention || [], 'health');
      const educationInterventions = formatInterventions(child.intervention || [], 'education');
      const socialInterventions = formatInterventions(child.intervention || [], 'social');
      const livelihoodInterventions = formatInterventions(child.intervention || [], 'livelihood');

      // Format social participation for social interventions
      const socialParticipation = formatSocialParticipation(child.social_participation || []);

      const rowInformation = [
        index + 1, // Child #
        result.id, // Child Id
        result.first_name, // First name
        result.last_name, // Last Name
        address, // Address
        result.sex, // Sex
        age, // Age
        result.birthday ? new Date(result.birthday).toLocaleDateString() : "", // Date of Birth
        result.admission_date ? new Date(result.admission_date).toLocaleDateString() : "", // Date of Admission
        child.disability_id?.name || "", // Categories of Disability (Based on DOH Profiler)
        child.disability_nature || "", // Nature of Disability / Impression
        child.remarks || "", // Case per Disability (Based on CBM)
        child.is_active ? "" : new Date().toLocaleDateString(), // Date of Termination (if applicable)
        healthInterventions, // Health (Intervention)
        educationInterventions, // Education (Intervention)
        socialInterventions + (socialParticipation ? '; ' + socialParticipation : ''), // Social (Intervention)
        livelihoodInterventions, // Livelihood (Intervention)
        "" // Cost (with child story) - placeholder as this data isn't in the schema
      ];

      rowInformation.forEach((cellInfo, cellIndex) => {
        row.getCell(cellOffset + cellIndex).value = cellInfo;
      });

      if (index == 0) styleManager.applyRowStyle(worksheet, rowOffset + index, 'start_row')

      else if (index >= 0 && index < results.length) styleManager.applyRowStyle(worksheet, rowOffset + index, 'middle_row')

      else if (index == results.length - 1) styleManager.applyRowStyle(worksheet, rowOffset + index, 'end_row')

      await row.commit();
    });

    logger.info(`Completed ChildList report generation with ${results.length} records`);
  }
}