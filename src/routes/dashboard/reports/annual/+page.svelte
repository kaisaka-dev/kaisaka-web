<script lang="ts">
    import Header from "../../../../components/Header.svelte";
    import Table from "../../../../components/text/Table.svelte";
    import Modal from "../../../../components/Modal.svelte";
    import InputText from "../../../../components/input/InputText.svelte";
    import Textarea from "../../../../components/input/InputTextarea.svelte";

    let modalIsOpen = $state(false);

    type AnnualProgram = {
        id: number;
        startYYYY: number;
        startMM?: number;
        startDD?: number;
        endYYYY: number;
        endMM?: number;
        endDD?: number;
    }

    const annualPrograms: AnnualProgram[] = [
        {
            id: 2023,
            startYYYY: 2023,
            startMM: 1,
            startDD: 1,
            endYYYY: 2023,
            endMM: 12,
            endDD: 31
        },
        {
            id: 2024,
            startYYYY: 2024,
            startMM: 3,
            startDD: 15,
            endYYYY: 2024,
            endMM: 11,
            endDD: 30
        },
        {
            id: 2025,
            startYYYY: 2025,
            startMM: 6,
            startDD: 1,
            endYYYY: 2026,
            endMM: 5,
            endDD: 31
        },
        {
            id: 2026,
            startYYYY: 2026,
            startMM: 2,
            startDD: 1,
            endYYYY: 2026,
            endMM: 12,
            endDD: 15
        },
        {
            id: 2027,
            startYYYY: 2027,
            startMM: 9,
            startDD: 10,
            endYYYY: 2028,
            endMM: 6,
            endDD: 20
        },
        {
            id: 2028,
            startYYYY: 2028,
            startMM: 1,
            startDD: 5,
            endYYYY: 2028,
            endMM: 12,
            endDD: 31
        },
        {
            id: 2029,
            startYYYY: 2029,
            startMM: 4,
            startDD: 10,
            endYYYY: 2030,
            endMM: 3,
            endDD: 25
        }
    ];

    function formatDate(yyyy?: number, mm?: number, dd?: number): string {
        if (!yyyy) return '';
        return `${yyyy}/${mm ?? 1}/${dd ?? 1}`;
    }

    const tableData = annualPrograms.map(program => ({
        id: program.id,
        Start: formatDate(program.startYYYY, program.startMM, program.startDD),
        End: formatDate(program.endYYYY, program.endMM, program.endDD)
    }));

    function handleSubmit() {
        modalIsOpen = false;
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
</script>

<Header category="reports" page="annual" />

<section>
    <h2>List of Annual Programs
    </h2>
    <Modal buttonText="Add New Annual Program" width="50%" isOpen={modalIsOpen}>
        <div slot="modal">
            <h2>Add New Annual Program</h2>

            <InputText type="number" label="Start Year" id="startYYYY" required/>
            <InputText type="number" label="Start Month" id="startMM" />
            <InputText type="number" label="Start Date" id="startDD" />
            <InputText type="number" label="End Year" id="endYYYY" required/>
            <InputText type="number" label="End Month" id="endMM" />
            <InputText type="number" label="End Date" id="endDD" />

            <InputText type="number" label="Target New CWDs" id="targetCWDs" />
            <Textarea label="General Reflection" id="reflection" />
            <Textarea label="Lessons Learned" id="lessons" />


<!--            <button class="green" onclick={handleSubmit}>Submit</button>-->

        </div>
    </Modal>

</section>



<section>
    <table>
        <thead>
        <tr>
            <th>Start</th>
            <th>End</th>
            <th>Export</th>
        </tr>
        </thead>
        <tbody>
        {#each tableData as row}
            <tr>
                <td>{row.Start}</td>
                <td>{row.End}</td>
                <td>
                    <button class="green" onclick={downloadExcel}>Export</button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

</section>
