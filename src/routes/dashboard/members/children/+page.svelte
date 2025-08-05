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
import { goto } from '$app/navigation';
import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';

const { data } = $props<{ data: PageData }>();

// load the data
let childrenData = $state(data.children || []);
let filteredData = $state(childrenData);
let options = $state({
    disability_category: data.options.disCategory,
    education_level: dropdownOptions.education_level,
    education_type: dropdownOptions.education_type,
    sex: dropdownOptions.sex,
    active_status: [
        { id: "🟩", name: "🟩 Active" },
        { id: "⬛", name: "⬛ Inactive" }
    ]
    // education_status: dropdownOptions.education_status,
    // employment_type: dropdownOptions.employment_type,
});

let loadingExport = $state(false);
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
    educationLevel: "",
    active: ""
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
          (!filter.educationLevel || child.gradeLevel?.toLowerCase().includes(filter.educationLevel.toLowerCase())) &&
          (!filter.active || child.active === filter.active);

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
        educationLevel: "",
        active: ""
    }
    filteredData = childrenData;
}

async function exportChildList() {
    loadingExport = true;
    try {
			const response = await fetch('/api/reports/childList', {
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`Failed to generate report: ${response.status}`);
			}

			const blob = await response.blob();

			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `Kaisaka Child List ${new Date().toISOString()}.xlsx`;
			document.body.appendChild(a);
			a.click();

			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error(err);
			alert('Error generating report.');
		}
    loadingExport = false;
	}

</script>

<Header category="members" page="children" />

<section id="main">
    <h2 class="!px-0 !text-[var(--pink)]">List of Children/Youngsters with Disability</h2>

    <FilterSearch bind:searchedValue={filter.main}>
        <!-- to be rendered inside the Filter Search component-->
        <div slot="button-list">
            <button onclick={() => goto("/dashboard/registration/child")}>Register</button>
            {#if loadingExport}
                <LoadingBtn label="Export" disableCover={false}/>
            {:else}
                <button onclick={() => exportChildList()}  class="green">Export</button>
            {/if}
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
            <Select label="Active" id="active-status" options={options.active_status} bind:value={filter.active} margin={false}/>

            <div id="reset" class="flex justify-end"><button onclick={resetFilters}>Reset Filters</button></div>
        </div>
    </FilterSearch>

    <br>
    <div class="flex flex-row">
        <span style="color:var(--green)">Results: {filteredData.length}</span>
        <Checkbox label="Show age, education" id="show-all-columns" bind:checked={showAllColumns}/>
    </div>


    {#if showAllColumns}
        <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Age', 'Disability Category', 'Disability Nature', 'Education Level', 'Education Type', 'Active']}
               includedKeys={['firstName', 'lastName', 'birthday', 'age', 'category', 'nature', 'gradeLevel', 'educType', 'active']} hasLink={true}/>
    {:else}
        <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Disability Category', 'Disability Nature', 'Active']}
               includedKeys={['firstName', 'lastName', 'birthday', 'category', 'nature', 'active']} hasLink={true}/>
    {/if}
</section>