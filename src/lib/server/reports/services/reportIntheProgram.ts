import { InterventionModel } from '$lib/models/interventionModel.js';
import { getLogSidecar } from '$lib/server/logging/log-sidecar.js';
import type QueryConfig from '$lib/types/manager.js'; // Import the proper type
import type { QueryConfigurationBuilder } from '$lib/types/manager.js';

// Remove this interface - we'll use the existing QueryConfig type
function getBirthdayRangeForAge(minAge: number, maxAge?: number | null) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // For minimum age: person must be born on or before this date to be at least minAge
  const maxBirthDate = new Date(currentYear - minAge, currentMonth, currentDay);
  
  // For maximum age: person must be born on or after this date to be at most maxAge
  const minBirthDate = maxAge !== null && maxAge !== undefined 
    ? new Date(currentYear - maxAge - 1, currentMonth, currentDay + 1)
    : null;

  return {
    gte: minBirthDate ? minBirthDate.toISOString().slice(0, 10) : undefined,
    lte: maxBirthDate.toISOString().slice(0, 10)
  };
}

export class ProgramReportGenerator {
  static async generateReport(currentYear: number) {
    const logger = getLogSidecar();
    logger.info('Started report for In the Program');

    // Define age groups with proper date ranges
    const ageGroups = [
      { min: 0,  max: 5,    label: '0-5 years'   },
      { min: 6,  max: 11,   label: '6-11 years'  },
      { min: 12, max: 17,   label: '12-17 years' },
      { min: 18, max: 25,   label: '18-25 years' },
      { min: 26, max: null, label: '26+ years'   }
    ];

    const disabilities = [
      { 
        filter: {}, 
        label: 'All' 
      },
      { 
        filter: { ilike: { 'disability_category.name': 'Down Syndrome' } }, 
        label: 'Down Syndrome' 
      }
    ];

    const genders = ['Male', 'Female'];

    const childrenResults = []

    const interventionResults = [];

    for (const [ageIndex, ageGroup] of ageGroups.entries()) {
      for (const [disabilityIndex, disability] of disabilities.entries()) {
        for (const [genderIndex, gender] of genders.entries()) {
                    
          const birthdayRange = getBirthdayRangeForAge(ageGroup.min, ageGroup.max);
          
          const childrenSelectClause = `*, intervention!inner(disability_category(name)), members!inner(first_name, last_name, sex, birthday)`         

          let cell_result = {
            ageGroup: ageGroup.label,
            disability: disability.label,
            gender: gender,
            indices: [ageIndex, disabilityIndex, genderIndex],
            count: 0,
            error: ""
          }

          try {
            const result = await InterventionModel.instance.findWithJoinAndCount(childrenSelectClause, {});
            cell_result.count = (result.count) ?? 0;
          } catch (error) {
            cell_result.error = JSON.stringify(error)
          } finally {
            logger.info(`Cell (${ageIndex}, ${disabilityIndex}, ${genderIndex}): ${JSON.stringify(cell_result.count)} - ${ageGroup.label}, ${disability.label}, ${gender}, ${cell_result.error}`);
            childrenResults.push(cell_result)
          }

          const interventionSelectClause = `*, children!inner(id, members(first_name, last_name, sex, birthday), disability_category(name))`;
          

          // Build the query config with proper structure
          const interventionConfig: QueryConfigurationBuilder = {
            eq: {
              'children.members.sex': gender,
              ...(disability.filter.ilike ? disability.filter.ilike : {})
            },
            ...(birthdayRange.gte ? { gte: { 'children.members.birthday': birthdayRange.gte } } : {}),
            ...(birthdayRange.lte && { lte: { 'children.members.birthday': birthdayRange.lte } }),
            is: {
              'children.disability_category': false,
              'children.members': false
            }
          };

          cell_result = {
            ageGroup: ageGroup.label,
            disability: disability.label,
            gender: gender,
            indices: [ageIndex, disabilityIndex, genderIndex],
            count: 0,
            error: ""
          }
          
          try {
            const result = await InterventionModel.instance.findWithJoinAndCount(interventionSelectClause, interventionConfig);
            cell_result.count = (result.count) ?? 0;
          } catch (error) {
            cell_result.error = JSON.stringify(error)
          } finally {
            logger.info(`Cell (${ageIndex}, ${disabilityIndex}, ${genderIndex}): ${JSON.stringify(cell_result.count)} - ${ageGroup.label}, ${disability.label}, ${gender}, ${cell_result.error}`);
            interventionResults.push(cell_result)
          }
        }
      }
    }

    return {
      results: interventionResults,
      summary: {
        totalQueries: interventionResults.length,
        successfulQueries: interventionResults.filter(r => r.count !== null).length,
        failedQueries: interventionResults.filter(r => r.count === null).length
      }
    };
  }
}

// Add this method to your TableManager if it doesn't exist
// You can add this to your InterventionModel class:
/*
public async countByJoinConfig(selectClause: string, config: QueryConfig<T>): Promise<number> {
  const result = await this.findWithJoinAndCount(selectClause, config);
  return result.count;
}
*/