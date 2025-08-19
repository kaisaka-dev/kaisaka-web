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
            CYWD Information
            <button class="green" onclick={() => deleteChild(index)}>
                <i class="fa-solid fa-trash"></i>
            </button>
        </h1>

        <InputText label="First name" bind:value={formData.first_name} required msg={errors.firstName}/>
        <InputText label="Middle name" bind:value={formData.middle_name} />
        <InputText label="Last name" bind:value={formData.last_name} required msg={errors.lastName}/>
        <InputText label="Birthday" bind:value={formData.birthday} type="date" required msg={errors.birthday}/>
        <InputText label="Age" value={formData.age} disabled />
        <Select label="Sex" options={options.sex} bind:value={formData.sex} required msg={errors.sex}/>
        <InputText label="Address" bind:value={formData.address} required msg={errors.address}/>
        <InputText label="Barangay" bind:value={formData.barangay} required msg={errors.barangay}/>
        <Select label="Disability Category" options={options.disability_category} bind:value={formData.disability.category_id} required msg={errors.disCategory}/>
        <Textarea label="Disability Nature" bind:value={formData.disability.nature} />
        <Textarea label="Remarks" bind:value={formData.remarks}/>
    </section>

    <section id="education-info">
        <h1>Education Information</h1>
        <Select label="Education" options={options.education_type} required bind:value={formData.educ.type} msg={errors.educType}/>
        {#if formData.educ.type !== "Not enrolled" && formData.educ.type !== ""}
            <Select label="Education Level" options={options.education_level} bind:value={formData.educ.grade_level} required msg={errors.educLvl}/>
            <Select label="Education Status" options={options.education_status} required bind:value={formData.educ.status} msg={errors.educStatus}/>
            <InputRange label="School Year" bind:valueFrom={formData.educ.year_start} bind:valueTo={formData.educ.year_end} type="number" required msg={errors.ayStart + " " + errors.ayEnd} />
        {/if}
    </section>

    <section id="documents">
        <h1 class="text-lg font-bold mb-4">Documents</h1>
        <Checkbox label="PWD ID" bind:checked={formData.has.pwd_id}/>
        {#if formData.has.pwd_id}
            <div style="margin-left: 35px">
                <InputText label="ID #" required msg={errors.pwdId} bind:value={formData.has.pwd.id}/>
                <InputText label="Expiry Date" type="date" required msg={errors.pwdExpy} bind:value={formData.has.pwd.expiry_date}/>
            </div>
        {/if}
        <Checkbox label="PhilHealth" bind:checked={formData.has.philhealth}/>
        <Checkbox label="Voters Registration" bind:checked={formData.has.vote}/>
        <Checkbox label="National ID" bind:checked={formData.has.national_id}/>
    </section>

    <section id="social-participation-status">
        <h1 class="text-lg font-bold mb-4">Social Participation</h1>
        <Checkbox label="Participation in family life" bind:checked={formData.part.family_life}/>
        {#if formData.part.family_life}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" bind:value={formData.part.fam_year} type="number" required msg={errors.partFamilyYear} />
            </div>
        {/if}
        <Checkbox label="Participation in community life / clubs" bind:checked={formData.part.community}/>
        {#if formData.part.community}
            <div style="margin-left: 35px">
                <InputText label="Year accessed" bind:value={formData.part.com_year} type="number" required msg={errors.partCommunityYear} />
            </div>
        {/if}
    </section>

    <section id="labour-market-status">
        <h1 class="text-lg font-bold mb-4">Labor Market Status</h1>
        <Checkbox label="Able to work" bind:checked={formData.employment.able_to_work}/>
        {#if formData.employment.able_to_work}
            <div style="margin-left: 35px">
                <Select label="Employment Type" options={options.employment_type} bind:value={formData.employment.type} />
            </div>
        {/if}
    </section>

    <section id="certificate-verification">
        <h1 class="text-lg font-bold mb-4">Certificate Verification</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
        <Checkbox label="Medical Certificate" bind:checked={formData.has.medical_cert}/>
        <Checkbox label="Birth Certificate" bind:checked={formData.has.birth_cert}/>
        <Checkbox label="Barangay Certificate" bind:checked={formData.has.barangay_cert}/>
    </section>

    <section id="staff-only">
        <h1 class="text-lg font-bold mb-4">Other Information</h1>
        <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
        <InputText type="month" label="Admission Date" bind:value={formData.date_admission} msg={errors.admissionDate} />
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