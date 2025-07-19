<script lang="ts">
    import Header from "$components/Header.svelte";
    import FilterSearch from '$components/styled-buttons/FilterSearch.svelte';
    import InputRange from '$components/input/InputRange.svelte';
    import ReportPeriodModal from './ReportPeriodModal.svelte';
    import ReportPeriodTable from './ReportPeriodTable.svelte';
    import type { ReportPeriod } from './+page.server.js';


    const reportPeriods: ReportPeriod[] = [
        {
            id: 2023,
            startYYYY: 2023,
            startMM: 1,
            startDD: 1,
            endYYYY: 2023,
            endMM: 12,
            endDD: 31,
            total_target_CWDS: 100,
            new_target_CWDS: 40,
            old_target_CWDS: 60,
            total_actual_CWDS: 92,
            new_actual_CWDS: 38,
            old_actual_CWDS: 54,
            general_reflection: "Strengthened community ties through consistent outreach.",
            lessons_learned: "Early planning improved caregiver coordination."
        },
        {
            id: 2024,
            startYYYY: 2024,
            startMM: 3,
            startDD: 15,
            endYYYY: 2024,
            endMM: 11,
            endDD: 30,
            total_target_CWDS: 120,
            new_target_CWDS: 50,
            old_target_CWDS: 70,
            total_actual_CWDS: 115,
            new_actual_CWDS: 47,
            old_actual_CWDS: 68,
            general_reflection: "Youth participation increased via new programs.",
            lessons_learned: "Clear documentation reduced onboarding delays."
        },
        {
            id: 2025,
            startYYYY: 2025,
            startMM: 6,
            startDD: 1,
            endYYYY: 2026,
            endMM: 5,
            endDD: 31,
            total_target_CWDS: 140,
            new_target_CWDS: 60,
            old_target_CWDS: 80,
            total_actual_CWDS: 138,
            new_actual_CWDS: 58,
            old_actual_CWDS: 80,
            general_reflection: "Expanded digital tools improved data accuracy.",
            lessons_learned: "Testing workflows before launch prevented duplication issues."
        },
        {
            id: 2026,
            startYYYY: 2026,
            startMM: 2,
            startDD: 1,
            endYYYY: 2026,
            endMM: 12,
            endDD: 15,
            total_target_CWDS: 160,
            new_target_CWDS: 65,
            old_target_CWDS: 95,
            total_actual_CWDS: 154,
            new_actual_CWDS: 61,
            old_actual_CWDS: 93,
            general_reflection: "Integrated health assessments with registration.",
            lessons_learned: "Training sessions boosted volunteer efficiency."
        },
        {
            id: 2027,
            startYYYY: 2027,
            startMM: 9,
            startDD: 10,
            endYYYY: 2028,
            endMM: 6,
            endDD: 20,
            total_target_CWDS: 180,
            new_target_CWDS: 80,
            old_target_CWDS: 100,
            total_actual_CWDS: 176,
            new_actual_CWDS: 78,
            old_actual_CWDS: 98,
            general_reflection: "Introduced caregiver mentorship with strong feedback.",
            lessons_learned: "Inclusive design enhanced form accessibility."
        },
        {
            id: 2028,
            startYYYY: 2028,
            endYYYY: 2028,
            total_target_CWDS: 200,
            new_target_CWDS: 85,
            old_target_CWDS: 115,
            total_actual_CWDS: 193,
            new_actual_CWDS: 81,
            old_actual_CWDS: 112,
            general_reflection: "Collaborated with local schools for outreach.",
            lessons_learned: "Modular form structure helped adapt to new requirements."
        },
        {
            id: 2029,
            startYYYY: 2029,
            startMM: 4,
            startDD: 10,
            endYYYY: 2030,
            endMM: 3,
            endDD: 25,
            total_target_CWDS: 220,
            new_target_CWDS: 95,
            old_target_CWDS: 125,
            total_actual_CWDS: 213,
            new_actual_CWDS: 90,
            old_actual_CWDS: 123,
            general_reflection: "Engagement metrics guided session improvements.",
            lessons_learned: "API logging clarified registration flow issues."
        }
    ];


    let newPeriod = {
        id: null,
        startYYYY: null,
        startMM: null,
        startDD: null,
        endYYYY: null,
        endMM: null,
        endDD: null,
        total_target_CWDS: null,
        new_target_CWDS: null,
        old_target_CWDS: null,
        total_actual_CWDS: null,
        new_actual_CWDS: null,
        old_actual_CWDS: null,
        general_reflection: "",
        lessons_learned: ""
    }

    const tableData = reportPeriods.map(period => ({
        id: period.id,
        Start: formatDate(period.startYYYY, period.startMM, period.startDD),
        End: formatDate(period.endYYYY, period.endMM, period.endDD),
        startYYYY: period.startYYYY,
        startMM: period.startMM,
        startDD: period.startDD,
        endYYYY: period.endYYYY,
        endMM: period.endMM,
        endDD: period.endDD,
        total_target_CWDS: period.total_target_CWDS,
        new_target_CWDS: period.new_target_CWDS,
        old_target_CWDS: period.old_target_CWDS,
        total_actual_CWDS: period.total_actual_CWDS,
        new_actual_CWDS: period.new_actual_CWDS,
        old_actual_CWDS: period.old_actual_CWDS,
        general_reflection: period.general_reflection,
        lessons_learned: period.lessons_learned
    }));

    function formatDate(yyyy?: number, mm?: number, dd?: number): string {
        if (!yyyy) return '';
        if (yyyy && mm && dd) return `${yyyy}/${mm}/${dd}`;
        if (yyyy && mm) return `${yyyy}/${mm}`;
        return `${yyyy}`;
    }


    let addModalIsOpen = $state(false);
    let filteredData = $state(tableData);
    let filter = $state({
        main: "",
        yrStart: "",
        yrEnd: ""
    });
    $effect(() => applyFilter());

    function applyFilter() {
        let result = [...tableData];

        // Apply main search filter
        if (filter.main) {
            const searchTerm = filter.main.toLowerCase();
            result = result.filter(period =>
              Object.values(period).some(value =>
                String(value).toLowerCase().includes(searchTerm)
              )
            );
        }

        // Apply year range filter
        if (filter.yrStart || filter.yrEnd) {
            const startYear = filter.yrStart ? parseInt(filter.yrStart) : 0;
            const endYear = filter.yrEnd ? parseInt(filter.yrEnd) : Infinity;

            result = result.filter(period => {
                const periodStartYear = period.Start.split('/')[0];
                const periodYear = parseInt(periodStartYear);
                return periodYear >= startYear && periodYear <= endYear;
            });
        }

        filteredData = result;
    }

    function resetFilters() {
        filter = {
            main: "",
            yrStart: "",
            yrEnd: ""
        }
        filteredData = tableData;
    }


</script>

<Header category="reports" page="annual" />

<section id="main">
    <h2 class="!px-0 !text-[var(--pink)]">List of Report Periods</h2>

    <FilterSearch bind:searchedValue={filter.main}>
        <div slot="button-list">
            <!-- for adding a new report period -->
            <ReportPeriodModal bind:modalIsOpen={addModalIsOpen} title="Add Another Report Period"
                               formData={newPeriod} />
        </div>
        <div slot="modal">
            <InputRange type="number" label="Year" id="year" bind:valueFrom={filter.yrStart} bind:valueTo={filter.yrEnd} margin={false} />

            <div id="reset" class="flex justify-end">
                <button onclick={resetFilters}>Reset Filters</button>
            </div>
        </div>
    </FilterSearch>
</section>


<section>
    <span style="color:var(--green)">Results: {filteredData.length}</span>

    <ReportPeriodTable data={filteredData} headers={[
  "Start", "End", "Total Target CWDS", "New Target CWDS", "Old Target CWDS", "Total Actual CWDS", "New Actual CWDS", "Old Actual CWDS"]}
                       includedKeys={['Start', 'End', 'total_target_CWDS', 'new_target_CWDS', 'old_target_CWDS', 'total_actual_CWDS', 'new_actual_CWDS', 'old_actual_CWDS']} hasLink={true}/>
</section>