<script lang="ts">
    import Header from "$components/Header.svelte";
    import FilterSearch from '$components/styled-buttons/FilterSearch.svelte';
    import InputRange from '$components/input/InputRange.svelte';
    import ReportPeriodModal from './ReportPeriodModal.svelte';
    import ReportPeriodTable from './ReportPeriodTable.svelte';
    import type { ReportPeriod } from './+page.server.js';
    import type { PageData } from './$types';

    // load the data
    const { data } = $props<{ data: PageData }>();
    let reportPeriods: ReportPeriod[] = $state(data.periodList);
    let filteredData: ReportPeriod[] = $state(data.periodList);
    let error = $state(data.error || '');
    
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


    let addModalIsOpen = $state(false);
    let filter = $state({
        main: "",
        yrStart: "",
        yrEnd: ""
    });
    $effect(() => applyFilter());

    function applyFilter() {
        let result = [...reportPeriods];

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
        filteredData = reportPeriods;
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
    {#if error}
        <div class="flex justify-center items-center py-8">
            <div class="text-red-500">
                <p>Error: {error}</p>
                <button onclick={() => window.location.reload()} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Retry
                </button>
            </div>
        </div>
    {:else}
    <span style="color:var(--green)">Results: {filteredData.length}</span>

    <ReportPeriodTable data={filteredData} headers={[
  "Start", "End", /*"Total Target CWDs",*/ "New Target CWDs", "Old Target CWDs", /*"Total Actual CWDs",*/ "New Actual CWDs", "Old Actual CWDs"]}
                       includedKeys={['Start', 'End', /*'total_target_CWDS', */'new_target_CWDS', 'old_target_CWDS', /*'total_actual_CWDS',*/ 'new_actual_CWDS', 'old_actual_CWDS']} hasLink={true}/>
    {/if}

</section>