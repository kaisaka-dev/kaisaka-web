<script lang="ts">
    import Header from "../../../../components/Header.svelte";
    import FilterSearch from "../../../../components/styled-buttons/FilterSearch.svelte";
    import Table from "../../../../components/text/Table.svelte";
    import InputText from '../../../../components/input/InputText.svelte';
    import Select from '../../../../components/input/Select.svelte';

    type PendingDocument = {
        firstName: string;
        lastName: string;
        medCert: string;
        birthCert: string;
        brgyCert: string;
        interventionPlan: string;
        link: string;
    };

    const pendingList: PendingDocument[] = [
        { firstName: "Roan", lastName: "Campo", medCert: "❌", birthCert: "❌", brgyCert: "❌", interventionPlan: "❌", link: "/profile" },
        { firstName: "Paolo", lastName: "Rivera", medCert: "❌", birthCert: "❌", brgyCert: "❌", interventionPlan: "❌", link: "/profile" },
        { firstName: "Mariella Jeans", lastName: "Dellosa", medCert: "❌", birthCert: "✅", brgyCert: "✅", interventionPlan: "✅", link: "/profile" },
        { firstName: "Bea Antoinette", lastName: "Uy", medCert: "❌", birthCert: "❌", brgyCert: "✅", interventionPlan: "❌", link: "/profile" },
        { firstName: "Gideon", lastName: "Chua", medCert: "❌", birthCert: "❌", brgyCert: "❌", interventionPlan: "❌", link: "/profile" }
    ];

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
    <Table
      data={filteredData}
      includedKeys={['firstName', 'lastName', 'medCert', 'birthCert', 'brgyCert', 'interventionPlan']}
      hasLink={true}
    />
</section>