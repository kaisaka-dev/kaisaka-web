<script lang="ts">
	import Header from "$components/Header.svelte";
	import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
	import InputText from '$components/input/InputText.svelte';
	import InputRange from '$components/input/InputRange.svelte';

	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const thisYear = new Date().getFullYear();

	let familiesList: FamiliesList[] = $state(data.families || []);
	let filteredData: FamiliesList[] = $state(familiesList);

	let filter = $state({
		main: "",
		caregivers: "",
		children: "",
		yrLastPaidStart: "",
		yrLastPaidEnd: ""
	});


	$effect(() => applyFilter());

	function applyFilter() {
		const search = filter.main?.toLowerCase();

		filteredData = familiesList.filter(family => {
			// Main search across all fields
			const matchesMain = !search ||
				Object.values(family).some(val =>
					String(val).toLowerCase().includes(search)
				);

			// Specific field filters
			const matchesCaregivers = !filter.caregivers ||
				family.caregivers.toLowerCase().includes(filter.caregivers.toLowerCase());

			const matchesChildren = !filter.children ||
				family.children.toLowerCase().includes(filter.children.toLowerCase());

			// Year range filter
			const startYear = filter.yrLastPaidStart ? parseInt(filter.yrLastPaidStart) : null;
			const endYear = filter.yrLastPaidEnd ? parseInt(filter.yrLastPaidEnd) : null;

			const matchesYear =
				(!startYear || family.yrLastPaid >= startYear) &&
				(!endYear || family.yrLastPaid <= endYear);

			return matchesMain && matchesCaregivers && matchesChildren && matchesYear;
		});
	}

	function resetFilters() {
		filter = {
			main: "",
			caregivers: "",
			children: "",
			yrLastPaidStart: "",
			yrLastPaidEnd: ""
		}
		filteredData = familiesList;
	}
</script>

<Header category="members" page="families" />

<section id="main">
	<h2 class="!px-0 !text-[var(--pink)]">List of Families</h2>

	<FilterSearch bind:searchedValue={filter.main}>
		<div slot="modal">
			<InputText label="Caregiver's name" id="caregiver" bind:value={filter.caregivers} margin={false} />
			<InputText label="Child's name" id="child" bind:value={filter.children} margin={false} />

			<InputRange type="number" label="Last paid" id="last-paid" bind:valueFrom={filter.yrLastPaidStart} bind:valueTo={filter.yrLastPaidEnd} margin={false} />

			<div id="reset" class="flex justify-end">
				<button onclick={resetFilters}>Reset Filters</button>
			</div>
		</div>
	</FilterSearch>

	<br>

	{#each filteredData as family}
		<div style="border: 3px solid var(--border); max-width: 70rem; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
			<div style="display: flex; flex-direction: row; justify-content: space-between">
				<h3>{family.surnames}</h3>
				<span style="color: {family.yrLastPaid === thisYear ? 'var(--green)' : 'var(--pink)'}">
						Membership: Last paid {family.yrLastPaid || 'Never'}</span>
			</div>
			<div class="family-info" style="display:grid; grid-template-columns: max-content auto; gap: 0 1rem;">
				<div>Caregivers: </div> <div>{family.caregivers || 'None'}</div>
				<div>CYWDs (Beneficiaries): </div> <div>{family.children || 'None'}</div>
			</div>
		</div>
	{/each}
</section>

<style>
    .family-info > div {
        font-size: var(--small-text);
        color: darkgray;
        width: fit-content;
    }
</style>