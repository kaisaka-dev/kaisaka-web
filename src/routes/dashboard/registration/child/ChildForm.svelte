<script lang="ts">
    import InputText from '$components/input/InputText.svelte';
    import Select from '$components/input/Select.svelte';
    import Textarea from '$components/input/InputTextarea.svelte';
    import Checkbox from '$components/input/Checkbox.svelte';
    import Validation from '$components/text/Validation.svelte';
    import InputRange from '$components/input/InputRange.svelte';
    import { dropdownOptions } from '$lib/types/options.js';

    // Props
    export let formData: any;
    export let errors: any;
    export let options: any;
    export let index: number;
    export let deleteChild: (index: number) => void;
    export let disabled: boolean = false;           // used for fields which are

    // Auto-calculate age based on birthday
    $: if (formData.birthday) {
        const birthDate = new Date(formData.birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasHadBirthdayThisYear) {
            calculatedAge -= 1;
        }
        formData.age = calculatedAge.toString();
    }

    // Education management functions
    function addEducationRecord() {
        const thisYear = new Date().getFullYear();
        const newEducation = {
            type: "",
            year_start: thisYear,
            year_end: thisYear + 1,
            grade_level: "",
            status: ""
        };
        formData.education = [...formData.education, newEducation];
    }

    function deleteEducationRecord(index: number) {
        formData.education = formData.education.filter((_, i) => i !== index);
    }

    // Initialize education array if it doesn't exist, and add first record if empty
    $: {
        if (!formData.education) {
            formData.education = [];
        }
        if (formData.education.length === 0) {
            addEducationRecord();
        }
    }
</script>

<div class="child-form">

    <section id="child-info">
        <h1 class="flex justify-between items-center">
            Beneficiary / CYWD Information
            <button class="green" onclick={() => deleteChild(index)}>
                <i class="fa-solid fa-trash"></i>
            </button>
        </h1>

        <InputText label="First name" id="first-name" bind:value={formData.first_name} required msg={errors.firstName} {disabled}/>
        <InputText label="Middle name" id="middle-name" bind:value={formData.middle_name} {disabled}/>
        <InputText label="Last name" id="last-name" bind:value={formData.last_name} required msg={errors.lastName} {disabled}/>
        <InputText label="Birthday" id="bday" bind:value={formData.birthday} type="date" required msg={errors.birthday} {disabled}/>
        <InputText label="Age" id="age" value={formData.age} disabled />
        <Select label="Sex" options={options.sex} bind:value={formData.sex} required msg={errors.sex} {disabled}/>
        <InputText label="Address" id="address" bind:value={formData.address} required msg={errors.address} {disabled}/>
        <InputText label="Barangay" id="barangay" bind:value={formData.barangay} required msg={errors.barangay} {disabled}/>
        <Select label="Disability Category" options={options.disability_category} bind:value={formData.disability.category_id} required msg={errors.disCategory} {disabled}/>
        <Textarea label="Disability Nature" bind:value={formData.disability.nature} {disabled}/>
        <Textarea label="Remarks" bind:value={formData.remarks} {disabled}/>
    </section>

    <section id="education-info">
        <h1>Education Information</h1>

        {#each formData.education as educRecord, educIndex (educIndex)}
            <div class="education-record p-4 mb-4 border-b border-gray-300">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <Select label="Education Type" options={options.education_type} required bind:value={educRecord.type} msg={errors.educType} {disabled}/>

                        {#if educRecord.type !== "Not enrolled" && educRecord.type !== ""}
                            <Select label="Education Level" options={options.education_level} bind:value={educRecord.grade_level} required msg={errors.educLvl} {disabled}/>
                            <Select label="Education Status" options={options.education_status} required bind:value={educRecord.status} msg={errors.educStatus} {disabled}/>
                            <InputRange label="School Year" bind:valueFrom={educRecord.year_start} bind:valueTo={educRecord.year_end} type="number" required msg={errors.ayStart + " " + errors.ayEnd} {disabled}/>
                        {/if}
                    </div>
                    {#if formData.education.length > 1}
                        <button class="delete !-mt-4" onclick={() => deleteEducationRecord(educIndex)} {disabled} aria-label="delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    {/if}
                </div>
                

            </div>
        {/each}

        <button class="green !text-[1rem] !p-0 !px-[12px]" aria-label="add education record" onclick={addEducationRecord} {disabled}>
            <i class="bi bi-plus-lg mr-1 !text-[inherit]"></i>
            Add Education Record
        </button>
    </section>

    <section id="documents">
        <h1>Documents</h1>
        <Checkbox label="PWD ID" id="pwd" bind:checked={formData.has.pwd_id} {disabled}/>
        {#if formData.has.pwd_id}
            <div style="margin-left: 35px">
                <InputText label="ID #" id="pwd-id" required msg={errors.pwdId} bind:value={formData.has.pwd.id} {disabled}/>
                <InputText label="Expiry Date" id="pwd-expiry" type="date" required msg={errors.pwdExpy} bind:value={formData.has.pwd.expiry_date} {disabled}/>
            </div>
        {/if}
        <Checkbox label="PhilHealth" id="ph-id" bind:checked={formData.has.philhealth} {disabled}/>
        <Checkbox label="Voters Registration" id="vote-id" bind:checked={formData.has.vote} {disabled}/>
        <Checkbox label="National ID" id="nat-id" bind:checked={formData.has.national_id} {disabled}/>
    </section>

    <section id="social-participation-status">
        <h1>Social Participation</h1>
        <Checkbox label="Participation in family life" id="participation-family" style="width: 30rem" bind:checked={formData.part.family_life} {disabled}/>
        {#if formData.part.family_life}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" id="part-family-accessed" bind:value={formData.part.fam_year} type="number" required msg={errors.partFamilyYear}  {disabled}/>
            </div>
        {/if}
        <Checkbox label="Participation in community life / clubs" id="participation-community" style="width: 30rem" bind:checked={formData.part.community} {disabled}/>
        {#if formData.part.community}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" id="part-community-accessed" bind:value={formData.part.com_year} type="number" required msg={errors.partCommunityYear}  {disabled}/>
            </div>
        {/if}
    </section>

    <section id="labour-market-status">
        <h1>Labor Market Status</h1>
        <Checkbox label="Able to work" id="able-to-work" bind:checked={formData.employment.able_to_work} {disabled}/>
        {#if formData.employment.able_to_work}
            <div style="margin-left: 35px">
                <Select label="Employment Type" options={options.employment_type} bind:value={formData.employment.type} {disabled}/>
            </div>
        {/if}
    </section>

    <section id="certificate-verification">
        <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px;"/>
        <Checkbox label="Medical Certificate" id="med-cert" bind:checked={formData.has.medical_cert} {disabled}/>
        <Checkbox label="Birth Certificate" id="birth-cert" bind:checked={formData.has.birth_cert} {disabled}/>
        <Checkbox label="Barangay Certificate" id="brgy-cert" bind:checked={formData.has.barangay_cert} {disabled}/>
    </section>

    <section id="staff-only">
        <h1 style="margin-bottom: 0.5rem;">Other Information</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px;"/>
        <InputText type="month" id="admission" label="Admission Date" bind:value={formData.date_admission} msg={errors.admissionDate}  {disabled}/>
    </section>
</div>

<style>
    section {
        margin-bottom: 2rem;
    }
    i {
        color: var(--error-color);
    }
    i:hover {
        cursor: pointer;
        transition-duration: 0.2s;
        color: var(--background);
    }
    h1 button:hover {
        background-color: transparent;
    }
    .delete {
        background-color: transparent;
    }
    .delete > i:hover {
        color: var(--error-color);
    }
</style>