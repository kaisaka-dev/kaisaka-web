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
</script>

<div class="child-form">

    <section id="child-info">
        <h1 class="flex justify-between items-center">
            Beneficiary / CYWD Information
            <button class="green" onclick={() => deleteChild(index)}>
                <i class="fa-solid fa-trash"></i>
            </button>
        </h1>

        <InputText label="First name" bind:value={formData.first_name} required msg={errors.firstName} {disabled}/>
        <InputText label="Middle name" bind:value={formData.middle_name} {disabled}/>
        <InputText label="Last name" bind:value={formData.last_name} required msg={errors.lastName} {disabled}/>
        <InputText label="Birthday" bind:value={formData.birthday} type="date" required msg={errors.birthday} {disabled}/>
        <InputText label="Age" value={formData.age} disabled />
        <Select label="Sex" options={options.sex} bind:value={formData.sex} required msg={errors.sex} {disabled}/>
        <InputText label="Address" bind:value={formData.address} required msg={errors.address} {disabled}/>
        <InputText label="Barangay" bind:value={formData.barangay} required msg={errors.barangay} {disabled}/>
        <Select label="Disability Category" options={options.disability_category} bind:value={formData.disability.category_id} required msg={errors.disCategory} {disabled}/>
        <Textarea label="Disability Nature" bind:value={formData.disability.nature} {disabled}/>
        <Textarea label="Remarks" bind:value={formData.remarks} {disabled}/>
    </section>

    <section id="education-info">
        <h1>Education Information</h1>
        <Select label="Education" options={options.education_type} required bind:value={formData.educ.type} msg={errors.educType} {disabled}/>
        {#if formData.educ.type !== "Not enrolled" && formData.educ.type !== ""}
            <Select label="Education Level" options={options.education_level} bind:value={formData.educ.grade_level} required msg={errors.educLvl} {disabled}/>
            <Select label="Education Status" options={options.education_status} required bind:value={formData.educ.status} msg={errors.educStatus} {disabled}/>
            <InputRange label="School Year" bind:valueFrom={formData.educ.year_start} bind:valueTo={formData.educ.year_end} type="number" required msg={errors.ayStart + " " + errors.ayEnd}  {disabled}/>
        {/if}
    </section>

    <section id="documents">
        <h1>Documents</h1>
        <Checkbox label="PWD ID" bind:checked={formData.has.pwd_id} {disabled}/>
        {#if formData.has.pwd_id}
            <div style="margin-left: 35px">
                <InputText label="ID #" required msg={errors.pwdId} bind:value={formData.has.pwd.id} {disabled}/>
                <InputText label="Expiry Date" type="date" required msg={errors.pwdExpy} bind:value={formData.has.pwd.expiry_date} {disabled}/>
            </div>
        {/if}
        <Checkbox label="PhilHealth" bind:checked={formData.has.philhealth} {disabled}/>
        <Checkbox label="Voters Registration" bind:checked={formData.has.vote} {disabled}/>
        <Checkbox label="National ID" bind:checked={formData.has.national_id} {disabled}/>
    </section>

    <section id="social-participation-status">
        <h1>Social Participation</h1>
        <Checkbox label="Participation in family life" style="width: 30rem" bind:checked={formData.part.family_life} {disabled}/>
        {#if formData.part.family_life}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" bind:value={formData.part.fam_year} type="number" required msg={errors.partFamilyYear}  {disabled}/>
            </div>
        {/if}
        <Checkbox label="Participation in community life / clubs" style="width: 30rem" bind:checked={formData.part.community} {disabled}/>
        {#if formData.part.community}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" bind:value={formData.part.com_year} type="number" required msg={errors.partCommunityYear}  {disabled}/>
            </div>
        {/if}
    </section>

    <section id="labour-market-status">
        <h1>Labor Market Status</h1>
        <Checkbox label="Able to work" bind:checked={formData.employment.able_to_work} {disabled}/>
        {#if formData.employment.able_to_work}
            <div style="margin-left: 35px">
                <Select label="Employment Type" options={options.employment_type} bind:value={formData.employment.type} {disabled}/>
            </div>
        {/if}
    </section>

    <section id="certificate-verification">
        <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px;"/>
        <Checkbox label="Medical Certificate" bind:checked={formData.has.medical_cert} {disabled}/>
        <Checkbox label="Birth Certificate" bind:checked={formData.has.birth_cert} {disabled}/>
        <Checkbox label="Barangay Certificate" bind:checked={formData.has.barangay_cert} {disabled}/>
    </section>

    <section id="staff-only">
        <h1 style="margin-bottom: 0.5rem;">Other Information</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px;"/>
        <InputText type="month" label="Admission Date" bind:value={formData.date_admission} msg={errors.admissionDate}  {disabled}/>
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
</style>