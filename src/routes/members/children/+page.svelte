<script lang="ts">
import Header from "../../../components/Header.svelte";
import FilterSearch from "../../../components/styled-buttons/FilterSearch.svelte";
import Table from "../../../components/text/Table.svelte";
import InputText from '../../../components/input/InputText.svelte';
import InputDate from '../../../components/input/InputDate.svelte';
import Select from '../../../components/input/Select.svelte';



// test data

type ChildrenList = {
    firstName: string;
    lastName: string;
    birthday: string;
    category: string;
    nature: string;
    age: number;
    sex: string;
    school: string;
    educationLevel: string;
};

const childrenList: ChildrenList[] = [
    {
        firstName: "Roan",
        lastName: "Campo",
        birthday: "2005-05-25",
        category: "Learning Disability",
        nature: "Autism Spectrum Disorder",
        age: 18,
        sex: "Male",
        school: "Special (Exclusive school, blind / deaf)",
        educationLevel: "Grade 10"
    },
    {
        firstName: "Paolo",
        lastName: "Rivera",
        birthday: "2005-05-25",
        category: "Psychosocial Disability",
        nature: "Epilepsy",
        age: 18,
        sex: "Male",
        school: "Integrated / SPED classes",
        educationLevel: "Grade 11"
    },
    {
        firstName: "Mariella Jeans",
        lastName: "Dellosa",
        birthday: "2005-05-25",
        category: "Speech/Language Impairment",
        nature: "Cleft Palate",
        age: 18,
        sex: "Female",
        school: "Inclusive / General education",
        educationLevel: "Grade 12"
    },
    {
        firstName: "Bea Antoinette",
        lastName: "Uy",
        birthday: "2005-05-25",
        category: "Deaf/Hard of Hearing",
        nature: "Deaf",
        age: 18,
        sex: "Female",
        school: "Non-formal",
        educationLevel: "Vocational"
    },
    {
        firstName: "Gideon",
        lastName: "Chua",
        birthday: "2005-05-25",
        category: "Intellectual Disability",
        nature: "Intellectual",
        age: 18,
        sex: "Male",
        school: "Home program",
        educationLevel: "Basic Skills"
    },
];


let filteredData = $state(childrenList);

let filter = $state({
    main: "",
    firstName: "",
    lastName: "",
    birthday: "",
    age: "",
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
const options_disNature = [
    "ADHD",
    "Autism Spectrum Disorder",
    "Cerebral Palsy",
    "Cleft Lip Palate",
    "Cleft Palate",
    "Communication Disorder",
    "Congenital Michocephaly",
    "Deaf",
    "Down Syndrome",
    "Ducent Muscular Dystrophy",
    "Epilepsy",
    "GDD",
    "Hearing Impairment",
    "Hyperactive",
    "Intellectual",
    "Learning",
    "Low Vision",
    "Orthopedic",
    "Osteogenetic Imperfecta",
    "Psychosocial Disability",
    "Rubinstein Taybi Syndrome",
    "Speech",
    "Speech and Hearing Impairment",
    "Speech Delay",
    "Speech Problem",
    "Tb Spondylodiscitis of the Spine",
    "Visual Impairment"
]; // from KAISAKA's 2024-jan-nov-list-of-children
const options_school = ["Home program", "Non-formal", "Special (Exclusive school, blind / deaf)", "Integrated / SPED classes", "Inclusive / General education"]

// filter logic
$effect(() => applyFilter())

function applyFilter() {
    console.log($inspect(filter));
    const search = filter.main?.toLowerCase();

    filteredData = childrenList.filter(child => {
        const matchesMain =
          !search || Object.values(child).some(val =>
            String(val).toLowerCase().includes(search)
          );

        const matchesSpecific =
          (!filter.firstName || child.firstName.toLowerCase().includes(filter.firstName.toLowerCase())) &&
          (!filter.lastName || child.lastName.toLowerCase().includes(filter.lastName.toLowerCase())) &&
          (!filter.birthday || child.birthday.includes(filter.birthday)) &&
          (!filter.age || child.age?.toString().includes(filter.age)) &&
          (!filter.sex || child.sex === filter.sex) &&
          (!filter.disCategory || child.category === filter.disCategory) &&
          (!filter.disNature || child.nature === filter.disNature) &&
          (!filter.school || child.school === filter.school) &&
          (!filter.educationLevel || child.educationLevel?.toLowerCase().includes(filter.educationLevel.toLowerCase()));

        return matchesMain && matchesSpecific;
    });
}
function resetFilters() {
    filter = {
        main: "",
        firstName: "",
        lastName: "",
        birthday: "",
        age: "",
        sex: "",
        disNature: "",
        disCategory: "",
        school: "",
        educationLevel: ""
    }
    filteredData = childrenList;
}
</script>

<Header category="members" page="children" />

<section id="main">
    <FilterSearch bind:searchedValue={filter.main} addLink="/registration/child">
        <!-- to be rendered inside the Filter Search component-->
        <div slot="modal">
            <InputText label="First name" id="first-name" bind:value={filter.firstName} />
            <InputText label="Last name" id="last-name" bind:value={filter.lastName} />
            <InputDate label="Birthday" id="bday" bind:value={filter.birthday} />
            <InputText label="Age" id="age" bind:value={filter.age} />
            <Select label="Sex" id="sex" options={["Male", "Female"]} bind:value={filter.sex} />
            <Select label="Disability Category" id="dis-category" options={options_disCategory} bind:value={filter.disCategory} />
            <Select label="Disability Nature" id="dis-nature" options={options_disNature} bind:value={filter.disNature} />
            <Select label="School" id="" options={options_school} bind:value={filter.school}/>
            <InputText label="Education Level" id="education" bind:value={filter.educationLevel} />

            <div id="reset" class="flex justify-end"><button onclick={resetFilters}>Reset Filters</button></div>
        </div>
    </FilterSearch>

    <br>
    <Table data={filteredData} headers={['First Name', 'Last Name', 'Birthday', 'Disability Category', 'Disability Nature']} includedKeys={['firstName', 'lastName', 'birthday', 'category', 'nature']}/>
</section>