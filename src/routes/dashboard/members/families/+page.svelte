<script lang="ts">
	import Header from "../../../../components/Header.svelte";
	import FilterSearch from "../../../../components/styled-buttons/FilterSearch.svelte";
	import InputText from '../../../../components/input/InputText.svelte';
	import InputRange from '../../../../components/input/InputRange.svelte';


	const thisYear = new Date().getFullYear();

	/**
	 * surnames: all unique surnames in a family, separated by comma
	 * caregivers: all caregivers, separated by comma
	 * children: all children, separated by comma
	 * yrLastPaid: the last year that they paid their membership fee
	 */
	type FamiliesList = {
		surnames: string;
		caregivers: string;
		children: string;
		yrLastPaid: number;
	};

	const familiesList: FamiliesList[] = [
		{ surnames: "Jeans, Rivera, Uy", caregivers: "Mariella Jeans", children: "Paolo Rivera, Bea Uy", yrLastPaid: 2025 },
		{ surnames: "Amon, Campo", caregivers: "Roan Campo", children: "Mika Amon, Gideon Chua", yrLastPaid: 2024 },
		{ surnames: "Chua", caregivers: "Chloe Chua", children: "Gideon (the 2nd) Chua, Gian Chua, Gabrielle Chua", yrLastPaid: 2024 },
		{ surnames: "Benigno, Corpuz, Helbling", caregivers: "Thara Corpuz", children: "James Khalel Benigno, John Patrick Helbling", yrLastPaid: 2025 }
	];

	let filteredData = $state(familiesList);
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
					Membership: Last paid {family.yrLastPaid}</span>
			</div>
			<div class="family-info" style="display:grid; grid-template-columns: max-content auto; gap: 0 1rem;">
				<div>Caregivers: </div> <div>{family.caregivers}</div>
				<div>Children: </div> <div>{family.children}</div>
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