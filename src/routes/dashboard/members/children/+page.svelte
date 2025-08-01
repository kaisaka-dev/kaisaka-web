<script lang="ts">
import Header from "$components/Header.svelte";
import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
import Table from "$components/text/Table.svelte";
import InputText from '$components/input/InputText.svelte';
import Select from '$components/input/Select.svelte';
import InputRange from '$components/input/InputRange.svelte';


import type { PageData } from './$types';
import { dropdownOptions } from '$lib/types/options.js';
import Checkbox from '$components/input/Checkbox.svelte';

const { data } = $props<{ data: PageData }>();

// load the data
let childrenData = $state(data.children || []);
let filteredData = $state(childrenData);
let options = $state({
    disability_category: data.options.disCategory,
    // education_status: dropdownOptions.education_status,
    education_level: dropdownOptions.education_level,
    education_type: dropdownOptions.education_type,
    // employment_type: dropdownOptions.employment_type,
    sex: dropdownOptions.sex
});

let showAllColumns = $state(false);
let filter = $state({
    main: "",
    firstName: "",
    lastName: "",
    birthdayFrom: "",
    birthdayTo: "",
    ageFrom: "",
    ageTo: "",
    sex: "",
    disNature: "",
    disCategory: "",
    educType: "",
    educationLevel: ""
})

// filter logic
$effect(() => applyFilter())

function applyFilter() {
    const search = filter.main?.toLowerCase();

    filteredData = childrenData.filter(child => {
        const matchesMain = !search ||
          Object.values(child).some(val =>
            String(val).toLowerCase().includes(search)
          );

        const childBirthday = new Date(child.birthday);

        // Birthday range filtering with null checks
        const birthdayFromValid = filter.birthdayFrom && !isNaN(new Date(filter.birthdayFrom).getTime());
        const birthdayToValid = filter.birthdayTo && !isNaN(new Date(filter.birthdayTo).getTime());

        const matchesBirthday =
          (!filter.birthdayFrom || (birthdayFromValid && childBirthday >= new Date(filter.birthdayFrom))) &&
          (!filter.birthdayTo || (birthdayToValid && childBirthday <= new Date(filter.birthdayTo)));

        // Age range filtering with null checks
        const ageFrom = filter.ageFrom ? Number(filter.ageFrom) : null;
        const ageTo = filter.ageTo ? Number(filter.ageTo) : null;

        const matchesAge =
          (ageFrom === null || child.age >= ageFrom) &&
          (ageTo === null || child.age <= ageTo);

        const matchesSpecific =
          (!filter.firstName || child.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) &&
          (!filter.lastName || child.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) &&
          matchesBirthday &&
          matchesAge &&
          (!filter.sex || child.sex === filter.sex) &&
          (!filter.disCategory || child.category === filter.disCategory) &&
          (!filter.disNature || child.nature === filter.disNature) &&
          (!filter.educType || child.educType === filter.educType ||
            (filter.educType === "Not enrolled" && child.educType === "")) &&
          (!filter.educationLevel || child.gradeLevel?.toLowerCase().includes(filter.educationLevel.toLowerCase()));

        return matchesMain && matchesSpecific;
    });
}
function resetFilters() {
    filter = {
        main: "",
        firstName: "",
        lastName: "",
        birthdayFrom: "",
        birthdayTo: "",
        ageFrom: "",
        ageTo: "",
        sex: "",
        disNature: "",
        disCategory: "",
        educType: "",
        educationLevel: ""
    }
    filteredData = childrenData;
}
</script>

<Header category="members" page="children" />

<section id="main">
    <h2 class="!px-0 !text-[var(--pink)]">List of Children/Youngsters with Disability</h2>

    <FilterSearch bind:searchedValue={filter.main}>
        <!-- to be rendered inside the Filter Search component-->
        <div slot="button-list">
            <button onclick={() => location.href="/dashboard/registration/child"}>Register</button>
            <button onclick={() => console.log("Export")}  class="green">Export</button>
        </div>
        <div slot="modal">
            <InputText label="First name" id="first-name" bind:value={filter.firstName} margin={false}/>
            <InputText label="Last name" id="last-name" bind:value={filter.lastName} margin={false}/>
            <InputRange type="date" label="Birthday" id="bday" bind:valueFrom={filter.birthdayFrom} bind:valueTo={filter.birthdayTo} margin={false}/>
            <InputRange type="number" label="Age" id="age" bind:valueFrom={filter.ageFrom} bind:valueTo={filter.ageTo} margin={false}/>
            <Select label="Sex" id="sex" options={options.sex} bind:value={filter.sex} margin={false}/>
            <Select label="Disability Category" id="dis-category" options={options.disability_category} bind:value={filter.disCategory} margin={false}/>
            <InputText label="Disability Nature" id="dis-nature" bind:value={filter.disNature} margin={false}/>
            <Select label="Education Type" id="education-type" options={options.education_type} bind:value={filter.educType} margin={false}/>
            <Select label="Education Level" id="education" options={options.education_level} bind:value={filter.educationLevel} margin={false}/>

            <div id="reset" class="flex justify-end"><button onclick={resetFilters}>Reset Filters</button></div>
        </div>
    </FilterSearch>

    <br>
    <div class="flex flex-row">
        <span style="color:var(--green)">Results: {filteredData.length}</span>
        <Checkbox label="Show age, education" id="show-all-columns" bind:checked={showAllColumns}/>
    </div>


    {#if showAllColumns}
        <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Age', 'Disability Category', 'Disability Nature', 'Education Level', 'Education Type']}
               includedKeys={['firstName', 'lastName', 'birthday', 'age', 'category', 'nature', 'gradeLevel', 'educType']} hasLink={true}/>
    {:else}
        <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Disability Category', 'Disability Nature']}
               includedKeys={['firstName', 'lastName', 'birthday', 'category', 'nature']} hasLink={true}/>
    {/if}
</section>