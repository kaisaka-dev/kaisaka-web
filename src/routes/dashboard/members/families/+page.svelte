<script lang="ts">
	import Header from "$components/Header.svelte";
	import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
	import InputText from '$components/input/InputText.svelte';
	import InputRange from '$components/input/InputRange.svelte';
	import { onMount } from 'svelte';

	const thisYear = new Date().getFullYear();

	/**
	 * surnames: all unique surnames in a family, separated by comma
	 * caregivers: all caregivers, separated by comma
	 * children: all children, separated by comma
	 * yrLastPaid: the last year that they paid their membership fee
	 */
	type FamiliesList = {
		id: string;
		surnames: string;
		caregivers: string;
		children: string;
		yrLastPaid: number;
	};

	let familiesList: FamiliesList[] = $state([]);
	let filteredData: FamiliesList[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	let filter = $state({
		main: "",
		caregivers: "",
		children: "",
		yrLastPaidStart: "",
		yrLastPaidEnd: ""
	});

	onMount(async () => {
		await fetchFamilies();
	});

	async function fetchFamilies() {
		try {
			loading = true;
			const response = await fetch('/api/families');
			
			if (!response.ok) {
				throw new Error('Failed to fetch families');
			}
			
			const result = await response.json();
			
			// Transform API data to match component expectations
			familiesList = transformFamilyData(result.data);
			filteredData = familiesList;
			error = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Error fetching families:', err);
		} finally {
			loading = false;
		}
	}

	function transformFamilyData(rawData: any[]): FamiliesList[] {
		// Group by family ID and process each family
		const familyMap = new Map<string, any>();
		
		rawData.forEach(item => {
			if (!familyMap.has(item.id)) {
				familyMap.set(item.id, {
					id: item.id,
					surnames: new Set<string>(),
					caregivers: [],
					children: [],
					yrLastPaid: 0
				});
			}
			
			const family = familyMap.get(item.id);
			
			// Process family members
			item.family_members?.forEach((member: any) => {
				const memberInfo = member.members;
				if (memberInfo) {
					// Add surname to set
					family.surnames.add(memberInfo.last_name);
					
					// Add to appropriate list based on is_child flag
					const fullName = `${memberInfo.first_name} ${memberInfo.last_name}`;
					if (member.is_child) {
						family.children.push(fullName);
					} else {
						family.caregivers.push(fullName);
					}
				}
			});
			
			// Get latest membership year from last_updated
			item.membership_annual_renewal?.forEach((renewal: any) => {
				if (renewal.updated_at) {
					const year = new Date(renewal.updated_at).getFullYear();
					if (year > family.yrLastPaid) {
						family.yrLastPaid = year;
					}
				}
			});
		});
		
		// Convert to final format
		return Array.from(familyMap.values()).map(family => ({
			id: family.id,
			surnames: Array.from(family.surnames).join(', '),
			caregivers: family.caregivers.join(', '),
			children: family.children.join(', '),
			yrLastPaid: family.yrLastPaid || 0
		}));
	}

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

	{#if loading}
		<div class="flex justify-center items-center py-8">
			<p>Loading families...</p>
		</div>
	{:else if error}
		<div class="flex justify-center items-center py-8">
			<div class="text-red-500">
				<p>Error: {error}</p>
				<button onclick={fetchFamilies} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
					Retry
				</button>
			</div>
		</div>
	{:else}
		<span style="color:var(--green)">Results: {filteredData.length}</span>

		{#each filteredData as family}
			<div style="border: 3px solid var(--border); max-width: 70rem; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
				<div style="display: flex; flex-direction: row; justify-content: space-between">
					<h3>{family.surnames}</h3>
					<span style="color: {family.yrLastPaid === thisYear ? 'var(--green)' : 'var(--pink)'}">
						Membership: Last paid {family.yrLastPaid || 'Never'}</span>
				</div>
				<div class="family-info" style="display:grid; grid-template-columns: max-content auto; gap: 0 1rem;">
					<div>Caregivers: </div> <div>{family.caregivers || 'None'}</div>
					<div>CWDs: </div> <div>{family.children || 'None'}</div>
				</div>
			</div>
		{/each}
	{/if}
</section>

<style>
    .family-info > div {
        font-size: var(--small-text);
        color: darkgray;
        width: fit-content;
    }
</style>