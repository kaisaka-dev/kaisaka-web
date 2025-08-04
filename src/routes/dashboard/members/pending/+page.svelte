<script lang="ts">
    import Header from "$components/Header.svelte";
    import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
    import Table from "$components/text/Table.svelte";
    import InputText from '$components/input/InputText.svelte';
    import Select from '$components/input/Select.svelte';
    import type { PageData } from '../../../../../.svelte-kit/types/src/routes/dashboard/members/families/$types.js';

    // load data
    const { data } = $props<{ data: PageData }>();

    let pendingList = $state(data.pendingList || []);
    let filteredData = $state(pendingList);

    
    let filter = $state({
        main: "",
        firstName: "",
        lastName: "",
        medCert: "",
        birthCert: "",
        brgyCert: "",
        interventionPlan: ""
    });

    const documentStatusOptions = ["All", "❌", "✅"];


    $effect(() => applyFilter());

    function applyFilter() {
        filteredData = pendingList.filter(child => {
            const matchesMain = !filter.main ||
              Object.values(child).some(val =>
                String(val).toLowerCase().includes(filter.main.toLowerCase()));

            const matchesSpecific =
              (!filter.firstName || child.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) &&
              (!filter.lastName || child.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) &&
              (!filter.medCert || filter.medCert === "All" || child.medCert === filter.medCert) &&
              (!filter.birthCert || filter.birthCert === "All" || child.birthCert === filter.birthCert) &&
              (!filter.brgyCert || filter.brgyCert === "All" || child.brgyCert === filter.brgyCert) &&
              (!filter.interventionPlan || filter.interventionPlan === "All" || child.interventionPlan === filter.interventionPlan);

            return matchesMain && matchesSpecific;
        });
    }

    function resetFilters() {
        filter = {
            main: "",
            firstName: "",
            lastName: "",
            medCert: "",
            birthCert: "",
            brgyCert: "",
            interventionPlan: ""
        };
        filteredData = pendingList;
    }
</script>

<Header category="members" page="pending" />

<section id="main">
    <h2 class="!px-0 !text-[var(--pink)]">List of CYWDs with Pending Verification</h2>

    <FilterSearch bind:searchedValue={filter.main}>
        <div slot="modal" class="pending-filters">
            <InputText label="First name" id="first-name" bind:value={filter.firstName} margin={false} />
            <InputText label="Last name" id="last-name" bind:value={filter.lastName} margin={false} />

            <Select
              label="Medical Certificate"
              id="med-cert"
              options={documentStatusOptions}
              bind:value={filter.medCert} margin={false}
            />
            <Select
              label="Birth Certificate"
              id="birth-cert"
              options={documentStatusOptions}
              bind:value={filter.birthCert} margin={false}
            />
            <Select
              label="Barangay Certificate"
              id="brgy-cert"
              options={documentStatusOptions}
              bind:value={filter.brgyCert} margin={false}
            />
            <Select
              label="Intervention Plan"
              id="intervention-plan"
              options={documentStatusOptions}
              bind:value={filter.interventionPlan} margin={false}
            />

            <div id="reset" class="flex justify-end">
                <button onclick={resetFilters}>Reset Filters</button>
            </div>
        </div>
    </FilterSearch>

    <br>

    <span style="color:var(--green)">Results: {filteredData.length}</span>

    <Table
      data={filteredData}
      includedKeys={['firstName', 'lastName', 'medCert', 'birthCert', 'brgyCert', 'interventionPlan']}
      hasLink={true}
    />
</section>