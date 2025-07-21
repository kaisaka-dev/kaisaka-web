<script lang="ts">
    import Header from "$components/Header.svelte";
    import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
    import Table from "$components/text/Table.svelte";
    import InputText from '$components/input/InputText.svelte';
    import type { PageData } from './$types';

    // load the data
    const { data } = $props<{ data: PageData }>();
    let caregiverList: CaregiverListItem[] = $state(data.caregiverList);
    let filteredData: CaregiverListItem[] = $state(data.caregiverList);
    let error = $state(data.error || '');
    
    let filter = $state({
        main: "",
        firstName: "",
        lastName: "",
        contact: ""
    });

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
    <h2 class="!px-0 !text-[var(--pink)]">List of Caregivers</h2>

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

        <Table
          data={filteredData}
          includedKeys={['firstName', 'lastName', 'contact']}
          hasLink={true}
        />
    {/if}
</section>