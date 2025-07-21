import type { PageLoad} from '../../../../../.svelte-kit/types/src/routes/$types.js';

export type Errors = {
	startYYYY: string,
	startMM: string,
	startDD: string,
	endYYYY: string,
	endMM: string,
	endDD: string,
	new_target_CWDS: string,
	old_target_CWDS: string,
	new_actual_CWDS: string,
	old_actual_CWDS: string
}

// it's called list program in the database, but officially we've changed it to Report Period as it's more flexible
export type ReportPeriod = {
	id: number | null;
	Start: string;
	End: string;
	startYYYY: number | null;
	startMM?: number | null;
	startDD?: number | null;
	endYYYY: number | null;
	endMM?: number | null;
	endDD?: number | null;
	total_target_CWDS?: number | null;
	new_target_CWDS?: number | null;
	old_target_CWDS?: number | null;
	total_actual_CWDS?: number | null;
	new_actual_CWDS?: number | null;
	old_actual_CWDS?: number | null;
	general_reflection?: string;
	lessons_learned?: string;
}



export const load: PageLoad = async ({fetch}) => {
	try {
		const response = await fetch('/api/annual_program');
		if (!response.ok) {
			throw new Error('Failed to fetch report periods');
		}

		const result = await response.json();
		const periodList: ReportPeriod[] = result.data.map((period: any) => {
			return {
				id: period.id,
				Start: formatDate(period.start_year, period.start_month, period.start_date),
				End: formatDate(period.end_year, period.end_month, period.end_date),
				startYYYY: period.start_year,
				startMM: period.start_month,
				startDD: period.start_date,
				endYYYY: period.end_year,
				endMM: period.end_month,
				endDD: period.end_date,
				total_target_CWDS: "",
				new_target_CWDS: period.target_new_cwds,
				old_target_CWDS: "",		// missing field in the database
				total_actual_CWDS: "",	// missing field in the database
				new_actual_CWDS: "",		// missing field in the database
				old_actual_CWDS: "",		// missing field in the database
				general_reflection: period.general_reflection || "",
				lessons_learned: period.lessons_learned || ""
			}
		});
		return { periodList, error: null };


	} catch (err) {
			return {
				periodList: [],
				error: err instanceof Error ? err.message : 'Failed to load report period data'
			}
	}
}

/**
 * to format dates
 * @param yyyy number representing the year to be formatted
 * @param mm number representing the month to be formatted
 * @param dd number representing the date to be formatted
 */
function formatDate(yyyy?: number, mm?: number, dd?: number): string {
	if (!yyyy) return '';
	// pad start is to add leading 0s, so that the data can be sorted quickly
	const formattedMonth = mm ? String(mm).padStart(2, '0') : undefined;
	const formattedDay = dd ? String(dd).padStart(2, '0') : undefined;

	if (yyyy && mm && dd) return `${yyyy}/${formattedMonth}/${formattedDay}`;
	if (yyyy && mm) return `${yyyy}/${formattedMonth}`;
	return `${yyyy}`;
}


