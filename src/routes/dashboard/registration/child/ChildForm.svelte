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
        
        // Initialize participation array if it doesn't exist
        if (!formData.participation) {
            formData.participation = [];
        }
        if (formData.participation.length === 0) {
            addParticipationRecord();
        }
    }
    
    // Participation management functions
    function addParticipationRecord() {
        const thisYear = new Date().getFullYear();
        const newParticipation = {
            year_start: thisYear,
            year_end: thisYear + 1,
            social_protection: false,
            family_life: false,
            community_life: false
        };
        formData.participation = [...formData.participation, newParticipation];
    }

    function deleteParticipationRecord(index: number) {
        formData.participation = formData.participation.filter((_, i) => i !== index);
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

        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead class="minor">
                    <tr class="bg-gray-100">
                        <th class="w-48">School Year</th>
                        <th class="">Education Details</th>
                        {#if formData.education.length > 1}
                            <th class="w-20">Actions</th>
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#each formData.education as educRecord, educIndex (educIndex)}
                        <tr>
                            <td>
                                {#if educRecord.type !== "Not enrolled" && educRecord.type !== ""}
                                    <InputRange bind:valueFrom={educRecord.year_start} bind:valueTo={educRecord.year_end} type="number" required msg={errors.ayStart + " " + errors.ayEnd} {disabled}/>
                                {:else}
                                    -
                                {/if}
                            </td>
                            <td>
                                <div class="space-y-2">
                                    <Select label="Education Type" options={options.education_type} required bind:value={educRecord.type} msg={errors.educType} {disabled}/>
                                    {#if educRecord.type !== "Not enrolled" && educRecord.type !== ""}
                                        <Select label="Education Level" options={options.education_level} bind:value={educRecord.grade_level} required msg={errors.educLvl} {disabled}/>
                                        <Select label="Education Status" options={options.education_status} required bind:value={educRecord.status} msg={errors.educStatus} {disabled}/>
                                    {/if}
                                </div>
                            </td>
                            {#if formData.education.length > 1}
                                <td class="text-center">
                                    <button class="delete" onclick={() => deleteEducationRecord(educIndex)} {disabled} aria-label="delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                    <tr>
                        <td colspan="{formData.education.length > 1 ? 3 : 2}">
                            <button class="green !text-[1rem] !p-0 !px-[12px]" aria-label="add education record" onclick={addEducationRecord} {disabled}>
                                <i class="bi bi-plus-lg mr-1 !text-[inherit]"></i>
                                Add Education Record
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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

        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead class="minor">
                    <tr class="bg-gray-100">
                        <th class="w-48">Time Period</th>
                        <th class="">Participated In</th>
                        {#if formData.participation.length > 1}
                            <th class="w-20">Actions</th>
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#each formData.participation as partRecord, partIndex (partIndex)}
                        <tr>
                            <td>
                                <InputRange bind:valueFrom={partRecord.year_start} bind:valueTo={partRecord.year_end} type="number" {disabled}/>
                            </td>
                            <td>
                                <div class="space-y-2">
                                    <Checkbox label="Social Protection" id="part-social-{partIndex}" bind:checked={partRecord.social_protection} {disabled}/>
                                    <Checkbox label="Family Life" id="part-family-{partIndex}" bind:checked={partRecord.family_life} {disabled}/>
                                    <Checkbox label="Community Life" id="part-community-{partIndex}" bind:checked={partRecord.community_life} {disabled}/>
                                </div>
                            </td>
                            {#if formData.participation.length > 1}
                                <td class="text-center">
                                    <button class="delete" onclick={() => deleteParticipationRecord(partIndex)} {disabled} aria-label="delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                    <tr>
                        <td colspan="{formData.participation.length > 1 ? 3 : 2}">
                            <button class="green !text-[1rem] !p-0 !px-[12px]" aria-label="add participation record" onclick={addParticipationRecord} {disabled}>
                                <i class="bi bi-plus-lg mr-1 !text-[inherit]"></i>
                                Add Participation Record
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    .fa-plus {
        color: var(--green);
        cursor: pointer;
    }
    .fa-plus:hover {
        cursor: pointer;
        transition-duration: 0.2s;
    }
</style>