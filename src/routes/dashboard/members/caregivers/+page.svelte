<script lang="ts">
    import Header from "$components/Header.svelte";
    import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
    import Table from "$components/text/Table.svelte";
    import InputText from '$components/input/InputText.svelte';
    import type { PageData } from './$types';
    import Select from '$components/input/Select.svelte';

    // load the data
    const { data } = $props<{ data: PageData }>();
    let caregiverList = $state(data.caregiverList);
    let filteredData = $state(data.caregiverList);
    let error = $state(data.error || '');
    const options = { active_status: [
            { id: "🟩", name: "🟩 Active" },
            { id: "⬛", name: "⬛ Inactive" }
        ]}
    
    let filter = $state({
        main: "",
        firstName: "",
        lastName: "",
        contact: "",
        active: ""
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
              (!filter.contact || caregiver.contact.includes(filter.contact)) &&
              (!filter.active || caregiver.active === filter.active);

            return matchesMain && matchesSpecific;
        });
    }

    function resetFilters() {
        filter = {
            main: "",
            firstName: "",
            lastName: "",
            contact: "",
            active: ""
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
            <Select label="Active" id="active-status" options={options.active_status} bind:value={filter.active} margin={false}/>

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
          includedKeys={['firstName', 'lastName', 'contact', 'active']}
          hasLink={true}
        />
    {/if}
</section>