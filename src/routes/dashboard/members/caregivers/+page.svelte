<script lang="ts">
    import Header from "../../../../components/Header.svelte";
    import FilterSearch from "../../../../components/styled-buttons/FilterSearch.svelte";
    import Table from "../../../../components/text/Table.svelte";
    import InputText from '../../../../components/input/InputText.svelte';
    import Select from '../../../../components/input/Select.svelte';
    import { onMount } from 'svelte';

    type CaregiverListItem = {
        id: string;
        firstName: string;
        lastName: string;
        contact: string;
        link: string;
    };

    let caregiverList: CaregiverListItem[] = $state([]);
    let filteredData: CaregiverListItem[] = $state([]);
    let loading = $state(true);
    let error = $state('');
    
    let filter = $state({
        main: "",
        firstName: "",
        lastName: "",
        contact: ""
    });

    onMount(async () => {
        await fetchCaregivers();
    });

    async function fetchCaregivers() {
        try {
            loading = true;
            const response = await fetch('/api/caregivers');
            
            if (!response.ok) {
                throw new Error('Failed to fetch caregivers');
            }
            
            const result = await response.json();
            
            // Transform API data to match component expectations
            caregiverList = result.data.map((caregiver: any) => ({
                id: caregiver.id,
                firstName: caregiver.members?.first_name || '',
                lastName: caregiver.members?.last_name || '',
                contact: caregiver.contact_number || '',
                link: `/dashboard/members/caregivers/profile?id=${caregiver.id}`
            }));
            
            filteredData = caregiverList;
            error = '';
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred';
            console.error('Error fetching caregivers:', err);
        } finally {
            loading = false;
        }
    }

    $effect(() => applyFilter());

    function applyFilter() {
        const search = filter.main?.toLowerCase();

        filteredData = caregiverList.filter(caregiver => {
            const matchesMain = !search ||
              Object.values(caregiver).some(val =>
                String(val).toLowerCase().includes(search)
              );

            const matchesSpecific =
              (!filter.firstName || caregiver.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) &&
              (!filter.lastName || caregiver.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) &&
              (!filter.contact || caregiver.contact.includes(filter.contact));

            return matchesMain && matchesSpecific;
        });
    }

    function resetFilters() {
        filter = {
            main: "",
            firstName: "",
            lastName: "",
            contact: ""
        }
        filteredData = caregiverList;
    }
</script>

<Header category="members" page="caregivers" />

<section id="main">
    <FilterSearch bind:searchedValue={filter.main}>
        <div slot="modal">
            <InputText label="First name" id="first-name" bind:value={filter.firstName} margin={false} />
            <InputText label="Last name" id="last-name" bind:value={filter.lastName} margin={false} />
            <InputText label="Contact" id="contact" bind:value={filter.contact} margin={false} />

            <div id="reset" class="flex justify-end">
                <button onclick={resetFilters}>Reset Filters</button>
            </div>
        </div>
    </FilterSearch>

    <br>
    
    {#if loading}
        <div class="flex justify-center items-center py-8">
            <p>Loading caregivers...</p>
        </div>
    {:else if error}
        <div class="flex justify-center items-center py-8">
            <div class="text-red-500">
                <p>Error: {error}</p>
                <button onclick={fetchCaregivers} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Retry
                </button>
            </div>
        </div>
    {:else}
        <Table
          data={filteredData}
          includedKeys={['firstName', 'lastName', 'contact']}
          hasLink={true}
        />
    {/if}
</section>