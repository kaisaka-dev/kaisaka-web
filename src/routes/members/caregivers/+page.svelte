<script lang="ts">
    import Header from "../../../components/Header.svelte";
    import FilterSearch from "../../../components/styled-buttons/FilterSearch.svelte";
    import Table from "../../../components/text/Table.svelte";
    import InputText from '../../../components/input/InputText.svelte';
    import Select from '../../../components/input/Select.svelte';

    type caregiverList = {
        firstName: string;
        lastName: string;
        contact: string;
        link: string;
    };

    const caregiverList: caregiverList[] = [
        { firstName: "Roan", lastName: "Campo", contact: "0912 123 1234", link: "/caregiverProfile"},
        { firstName: "Paolo", lastName: "Rivera", contact: "0912 123 1234", link: "/caregiverProfile" },
        { firstName: "Mariella Jeans", lastName: "Dellosa", contact: "0912 123 1234", link: "/caregiverProfile" },
        { firstName: "Bea Antoinette", lastName: "Uy", contact: "0912 123 1234", link: "/caregiverProfile" },
        { firstName: "Gideon", lastName: "Chua", contact: "0912 123 1234", link: "/caregiverProfile" }
    ];

    let filteredData = $state(caregiverList);
    let filter = $state({
        main: "",
        firstName: "",
        lastName: "",
        contact: ""
    });

    $effect(() => applyFilter());

    function applyFilter() {
        const search = filter.main?.toLowerCase();

        filteredData = caregiverList.filter(child => {
            const matchesMain = !search ||
              Object.values(child).some(val =>
                String(val).toLowerCase().includes(search)
              );

            const matchesSpecific =
              (!filter.firstName || child.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) &&
              (!filter.lastName || child.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) &&
              (!filter.contact || child.contact.includes(filter.contact));

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
    <Table
      data={filteredData}
      includedKeys={['firstName', 'lastName', 'contact']}
      hasLink={true}
    />
</section>