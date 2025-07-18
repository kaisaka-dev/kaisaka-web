<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
	import ReportPeriodModal from './ReportPeriodModal.svelte';
	import type { ReportPeriod } from './+page.server.js';
	import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';


	/**
	 * an array of object, where object is a row of data
	 */
	export let data: ReportPeriod[];

	/**
	 * an array of column keys (strings) to be INCLUDED in the table view
	 * EX: includedKeys={['firstName', 'lastName', 'age']}
	 */
	export let includedKeys: string[] = [];

	/**
	 * (optional) list of column headers to be displayed
	 * EX: headers={['First Name', 'Last Name', 'Contact No.', 'Relationship']}
	 */
	export let headers: string[] = [];

	/**
	 * (optional) key for the link property in each row
	 * Defaults to 'link' if not specified
	 */
	export let linkKey: string = 'link';

	/**
	 * (optional) whether to enable clickable rows with links
	 * Defaults to false
	 */
	export let hasLink: boolean = false;


	let editModalIsOpen = false;
	let formIdx = -1;
	let sortKey: string = '';
	let sortAsc: boolean = true;
	let loadingExport: boolean = false;
	let exportIndex = -1;


	function editModalOpen(idx: number) {
		editModalIsOpen = true
		formIdx = idx
		// console.log(data[formIdx])
	}

	// Sort the data based on sortKey and direction
	$: sortedData = [...data].sort((a, b) => {
		if (!sortKey) return 0;
		const aVal = a[sortKey];
		const bVal = b[sortKey];
		if (aVal === bVal) return 0;
		return (aVal > bVal ? 1 : -1) * (sortAsc ? 1 : -1);
	});

	// Toggle sort
	function sortBy(key: string) {
		if (sortKey === key) {
			sortAsc = !sortAsc;
		} else {
			sortKey = key;
			sortAsc = true;
		}
	}

	// Extract visible keys (in order)
	$: visibleKeys = includedKeys.length > 0
		? includedKeys.filter(key => data[0]?.hasOwnProperty(key) && (!hasLink || key !== linkKey))
		: Object.keys(data[0] ?? {}).filter(key => !hasLink || key !== linkKey);

	// Create pairs of [key, headerLabel]
	$: displayColumns = visibleKeys.map((key, i) => ({
		key,
		label: headers[i] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) // camelCase -> Camel Case
	}));

	async function downloadExcel(row: ReportPeriod) {
		loadingExport = true;
		try {
			const response = await fetch('/api/reports/target_cwds', {
				method: 'POST',
				body: JSON.stringify(row)
			});

			if(response.status === 401)
				  throw new Error('401 Not Authorized.');
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
		loadingExport = false;
	}

</script>


<!-- for editing existing report period -->
<ReportPeriodModal bind:modalIsOpen={editModalIsOpen} title="Edit Report Period" button_title=""
									 formData={sortedData[formIdx]} />

{#if sortedData.length > 0}
	<table>
		<thead>
		<tr>
			{#each displayColumns as col}
				<th onclick={() => sortBy(col.key)} style="cursor: pointer;">
					{col.label}
					<i
						class={
                          sortKey === col.key
                            ? sortAsc
                              ? 'fa-solid fa-arrow-up active'
                              : 'fa-solid fa-arrow-down active'
                            : 'fa-solid fa-sort'
                        }
						style="margin-left: 0.5rem; opacity: {sortKey === col.key ? 1 : 0.5}; transition: opacity 0.2s ease; color: var(--background)"
						aria-hidden="true"
					></i>
				</th>
			{/each}
			<th>Edit</th>
			<th>Export</th>
		</tr>
		</thead>
		<tbody>
		{#each sortedData as row, index}
			<tr>
				{#each displayColumns as col}
					<td>
						{#if hasLink && row[linkKey]}
							<a href={row[linkKey]} style="color: inherit; text-decoration: none;">
								{row[col.key]}
							</a>
						{:else}
							{row[col.key]}
						{/if}
					</td>
				{/each}
				<td>
					<button onclick={() => editModalOpen(index)}>Edit</button>
				</td>
				<td>
					{#if loadingExport && index === exportIndex}
						<LoadingBtn label="Export" disableCover={false}/>
					{:else}
						<button class="green" onclick={() => {downloadExcel(row); exportIndex = index}}>Export</button>
					{/if}
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
{:else}
	<p>No data to show.</p>
{/if}


<style>
    tr:has(td a:hover) {
        text-decoration: underline !important;
    }
</style>