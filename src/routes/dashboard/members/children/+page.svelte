<script lang="ts">
import Header from "$components/Header.svelte";
import FilterSearch from "$components/styled-buttons/FilterSearch.svelte";
import Table from "$components/text/Table.svelte";
import InputText from '$components/input/InputText.svelte';
import Select from '$components/input/Select.svelte';
import InputRange from '$components/input/InputRange.svelte';


import type { PageData } from './$types';

const { data } = $props<{ data: PageData }>();

// load the data

let childrenData = $state(data.children || []);
let filteredData = $state(childrenData);

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
    school: "",
    educationLevel: ""
})

// options for the dropdown
const options_disCategory = [
    "Deaf/Hard of Hearing",
    "Intellectual Disability",
    "Learning Disability",
    "Mental Disability",
    "Physical Disability",
    "Psychosocial Disability",
    "Speech and Language Impairment",
    "Visual Disability",
    "Cancer",
    "Rare Disease (RA10747)",
    "Multiple Disability"
];  // from KAISAKA's 2024-jan-nov-list-of-children
const options_school = ["Home program", "Non-formal", "Special (Exclusive school, blind / deaf)", "Integrated / SPED classes", "Inclusive / General education"]

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
          (!filter.school || child.educType === filter.school) &&  // Changed from school to educType
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
        school: "",
        educationLevel: ""
    }
    filteredData = childrenData;
}
</script>

<Header category="members" page="children" />

<section id="main">
    <h2 class="!px-0 !text-[var(--pink)]">List of Children</h2>

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
            <Select label="Sex" id="sex" options={["Male", "Female"]} bind:value={filter.sex} margin={false}/>
            <Select label="Disability Category" id="dis-category" options={options_disCategory} bind:value={filter.disCategory} margin={false}/>
            <InputText label="Disability Nature" id="dis-nature" bind:value={filter.disNature} margin={false}/>
            <Select label="School" id="" options={options_school} bind:value={filter.school} margin={false}/>
            <InputText label="Education Level" id="education" bind:value={filter.educationLevel} margin={false}/>

            <div id="reset" class="flex justify-end"><button onclick={resetFilters}>Reset Filters</button></div>
        </div>
    </FilterSearch>

    <br>
    <span style="color:var(--green)">Results: {filteredData.length}</span>

    <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Disability Category', 'Disability Nature']}
           includedKeys={['firstName', 'lastName', 'birthday', 'category', 'nature']} hasLink={true}/>
</section>