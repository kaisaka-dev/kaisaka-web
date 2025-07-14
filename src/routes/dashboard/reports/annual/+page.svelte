<script lang="ts">
    import Header from "../../../../components/Header.svelte";
    import FilterSearch from '../../../../components/styled-buttons/FilterSearch.svelte';
    import InputRange from '../../../../components/input/InputRange.svelte';
    import AnnualProgramModal from './AnnualProgramModal.svelte';

    let addModalIsOpen = $state(false);
    let editModalIsOpen = $state(false);
    let formIdx = $state(0);

    type AnnualProgram = {
        id: number;
        startYYYY: number;
        startMM?: number;
        startDD?: number;
        endYYYY: number;
        endMM?: number;
        endDD?: number;
        total_target_CWDS?: number;
        new_target_CWDS?: number;
        old_target_CWDS?: number;
        total_actual_CWDS?: number;
        new_actual_CWDS?: number;
        old_actual_CWDS?: number;
        general_reflection?: string;
        lessons_learned?: string;
    }



    const annualPrograms: AnnualProgram[] = [
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



    const tableData = annualPrograms.map(program => ({
        id: program.id,
        Start: formatDate(program.startYYYY, program.startMM, program.startDD),
        End: formatDate(program.endYYYY, program.endMM, program.endDD),
        startYYYY: program.startYYYY,
        startMM: program.startMM,
        startDD: program.startDD,
        endYYYY: program.endYYYY,
        endMM: program.endMM,
        endDD: program.endDD,
        total_target_CWDS: program.total_target_CWDS,
        new_target_CWDS: program.new_target_CWDS,
        old_target_CWDS: program.old_target_CWDS,
        total_actual_CWDS: program.total_actual_CWDS,
        new_actual_CWDS: program.new_actual_CWDS,
        old_actual_CWDS: program.old_actual_CWDS,
        general_reflection: program.general_reflection,
        lessons_learned: program.lessons_learned
    }));

    function formatDate(yyyy?: number, mm?: number, dd?: number): string {
        if (!yyyy) return '';
        if (yyyy && mm && dd) return `${yyyy}/${mm}/${dd}`;
        if (yyyy && mm) return `${yyyy}/${mm}`;
        return `${yyyy}`;
    }




    function handleSubmit() {
        addModalIsOpen = false;
    }
    function handleSave() {
        editModalIsOpen = false;
    }

    async function downloadExcel() {
    try {
      const response = await fetch('/api/reports/target_cwds', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales_report.xlsx';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error generating report.');
    }
  }

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
            result = result.filter(program =>
              Object.values(program).some(value =>
                String(value).toLowerCase().includes(searchTerm)
              )
            );
        }

        // Apply year range filter
        if (filter.yrStart || filter.yrEnd) {
            const startYear = filter.yrStart ? parseInt(filter.yrStart) : 0;
            const endYear = filter.yrEnd ? parseInt(filter.yrEnd) : Infinity;

            result = result.filter(program => {
                const programStartYear = program.Start.split('/')[0];
                const programYear = parseInt(programStartYear);
                return programYear >= startYear && programYear <= endYear;
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

    function editModalOpen(idx: number) {
        editModalIsOpen = true
        formIdx = idx
        console.log(formIdx)
    }
</script>

<Header category="reports" page="annual" />

<section>
    <h2>List of Annual Programs
    </h2>

    <div class="flex flex-row gap-4">
        <FilterSearch bind:searchedValue={filter.main}>
            <div slot="modal">
                <InputRange type="number" label="Year" id="year" bind:valueFrom={filter.yrStart} bind:valueTo={filter.yrEnd} margin={false} />

                <div id="reset" class="flex justify-end">
                    <button onclick={resetFilters}>Reset Filters</button>
                </div>
            </div>
        </FilterSearch>
        <!-- for adding a new annual program -->
        <div class=" flex-start">
            <AnnualProgramModal bind:modalIsOpen={addModalIsOpen} title="Add Another Annual Program">
                <div slot="footer"><button class="green" onclick={handleSubmit}>Submit</button></div>
            </AnnualProgramModal>
        </div>

    </div>



    <br>
    <!-- for adding a new annual program -->
    <AnnualProgramModal bind:modalIsOpen={addModalIsOpen} title="Add Another Annual Program">
        <div slot="footer"><button class="green" onclick={handleSubmit}>Submit</button></div>
    </AnnualProgramModal>

    <!-- for editing existing annual program -->
    <AnnualProgramModal bind:modalIsOpen={editModalIsOpen} title="Edit Annual Program" button_title="" bind:formData={filteredData[formIdx]}>
        <div slot="footer">
            <button onclick={() => editModalIsOpen = false}>Cancel</button>
            <button class="green" onclick={handleSave}>Save</button></div>
    </AnnualProgramModal>

</section>



<section>
    <table>
        <thead>
        <tr>
            <th>Start</th>
            <th>End</th>
            <th>Total Target CWDS</th>
            <th>New Target CWDS</th>
            <th>Old Target CWDS</th>
            <th>Total Actual CWDS</th>
            <th>New Actual CWDS</th>
            <th>Old Actual CWDS</th>
            <th>Edit</th>
            <th>Export</th>
        </tr>
        </thead>
        <tbody>
        {#each filteredData as row, index}
            <tr>
                <td>{row.Start}</td>
                <td>{row.End}</td>
                <td>{row.total_target_CWDS}</td>
                <td>{row.new_target_CWDS}</td>
                <td>{row.old_target_CWDS}</td>
                <td>{row.total_actual_CWDS}</td>
                <td>{row.new_actual_CWDS}</td>
                <td>{row.old_target_CWDS}</td>
                <td>
                    <button onclick={() => editModalOpen(index)}>Edit</button>
                </td>
                <td>
                    <button class="green" onclick={downloadExcel}>Export</button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

</section>
