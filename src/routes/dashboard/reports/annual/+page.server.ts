export type Errors = {
	startYYYY: string,
	startMM: string,
	startDD: string,
	endYYYY: string,
	endMM: string,
	endDD: string,
	new_target_CWDS: string,
	old_target_CWDS: string
}

// it's called annual program in the database, but officially we've changed it to Report Period as it's more flexible
export type ReportPeriod = {
	id: number | null;
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





