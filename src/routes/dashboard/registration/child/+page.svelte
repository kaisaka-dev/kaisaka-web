<script lang="ts">
    import InputText from '../../../../components/input/InputText.svelte';
    import Select from '../../../../components/input/Select.svelte';
    import Textarea from '../../../../components/input/InputTextarea.svelte';
    import Checkbox from '../../../../components/input/Checkbox.svelte';
    import Validation from '../../../../components/text/Validation.svelte';
    import Header from '../../../../components/Header.svelte';

    
    import { childFormData } from '../../../../lib/stores/childForm.js';
    import { goto } from '$app/navigation';

    let firstName = "";
    let middleName = "";
    let lastName = "";
    let birthday = "";
    let sex = "";
    let address = "";
    let barangay = -1;
    let educType = "";
    let educStatus = "";
    let educLvl = "";
    let hasPhId = false;
    let hasVote = false;
    let hasNatId = false;
    let hasPwdId = false;
    let pwdId = "";
    let pwdExpy = "";
    let ableToWork = false;
    let employmentType = "";

    let disCategory = "";
    let disNature = "";

    let hasMedCert = false;
    let hasBrgyCert = false;
    let hasBrthCert = false;
    let remarks = "";
    let partFamily = false;
    let partCommunity = false;
    let partFamilyYear = new Date().getFullYear();
    let partCommunityYear = new Date().getFullYear();
    let ayStart = new Date().getFullYear();
    let ayEnd = new Date().getFullYear() + 1;
    let admissionDate = new Date().toISOString().slice(0, 7);

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
    ]; // from KAISAKA's 2024-jan-nov-list-of-
    const options_educStatus = [
        "Past student",
        "New student",
        "Dropped",
        "Completed"
    ];


    /* special fields */
    let age = "";
    $: if (birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasHadBirthdayThisYear) {
            calculatedAge -= 1;
        }
        age = calculatedAge.toString();
    }


    let errors = {
        overall: "",
        firstName: "",
        lastName: "",
        birthday: "",
        sex: "",
        address: "",
        barangay: "",
        disCategory: "",
        disNature: "",
        educType: "",
        educLvl: "",
        educStatus: "",
        pwdId: "",
        pwdExpy: "",
        admissionDate: "",
        partFamilyYear: "",
        ayStart: "",
        ayEnd: "",
        partCommunityYear: ""
    };

    function validateForm() {
        errors.overall = "";        // resets it

        errors.firstName = firstName.trim() === "" ? "first name: field is required" : "";
        errors.lastName = lastName.trim() === "" ? "last name: field is required" : "";
        errors.birthday = birthday.trim() === "" ? "birthday: field is required" : "";
        errors.sex = sex.trim() === "" ? "sex: field is required" : "";
        errors.address = address.trim() === "" ? "address: field is required" : "";
        errors.barangay = barangay === -1 ? "barangay: field is required" : "";
        errors.disCategory = disCategory.trim() === "" ? "disCategory: field is required" : "";
        errors.disNature = disNature.trim() === "" ? "disNature: field is required" : "";
        errors.educType = educType.trim() === "" ? "educType: field is required" : "";
        errors.educLvl = educLvl.trim() === "" ? "educLvl: field is required" : "";
        errors.educStatus = educStatus.trim() === "" ? "educStatus: field is required" : "";
        // errors.admissionDate = admissionDate.trim() === "" ? "admission date: field is required" : "";

        // only check if the child has pwd id
        if (hasPwdId) {
            errors.pwdId = pwdId.trim() === "" ? "pwdId: field is required" : "";
            errors.pwdExpy = pwdExpy.trim() === "" ? "pwdExpy: field is required" : "";
        } else {
            errors.pwdId = "";
            errors.pwdExpy = "";
        }

        // only check if the child has participation
        if (partFamily) {
            errors.partFamilyYear = partFamilyYear.toString().trim() === "" ? "year: field is required" : "";
        } else {
            errors.partFamilyYear = "";
        }
        if (partCommunity) {
            errors.partCommunityYear = partCommunityYear.toString().trim() === "" ? "year: field is required" : "";
        } else {
            errors.partCommunityYear = "";
        }

        for (const error of Object.values(errors)) {
            if (error) {
                console.log("error found: ", error)
                errors.overall = "Please fill out the required fields";
                return false;
            }
        }

        return true;
    }

    function handleNext() {
        if (validateForm()) {
            childFormData.update(current => ({
                ...current,
                address: {
                    barangay_id: barangay,
                    address: address,
                    street_id: 1 //set to 1 for now xpp
                },
                member: {
                    first_name: firstName,
                    last_name: lastName, 
                    birthday: birthday,
                    sex: sex
                },
                child: {
                    has_barangay_cert: hasBrgyCert,
                    has_birth_cert: hasBrthCert,
                    has_medical_cert: hasMedCert,
                    is_active: true,
                    philhealth_id: null, //null for now
                    disability_id: null, //null for now
                    disability_nature: null, //null for now
                    remarks: remarks
                },
                education_status: {
                    year_start: 2025, //2025 for now
                    education_type: educType,
                    year_end: null, //for now
                    grade_level: educLvl
                },
                social_protection_status: {
                    participates_community_club: partCommunity,
                    participates_family_life: partFamily
                },
                employment_status: {
                    able_to_work: ableToWork,
                    employment_type: employmentType
                },
                //only if theres pwdId
                ...(hasPwdId && pwdId
				? {
						pwd_id: {
							pwd_id: pwdId,
							expiry_date: pwdExpy
						}
				  }
				: {})
            }));

            goto('/registration/family-info');
            console.log("Form submitted")
        }
    }
    


</script>
<Header category="members" page="children" />

<section>
    <h1>Child Registration</h1>



    <InputText label="First name" id="first-name" bind:value={firstName} required msg={errors.firstName}/>
    <InputText label="Middle name" id="middle-name" bind:value={middleName} />
    <InputText label="Last name" id="last-name" bind:value={lastName} required msg={errors.lastName}/>
    <InputText label="Birthday" id="bday" bind:value={birthday} type="date" required msg={errors.birthday}/>
    <InputText label="Age" id="age" value={age} disabled />
    <Select label="Sex" id="sex" options={["Male", "Female", "Other"]} bind:value={sex} required msg={errors.sex}/>
    <InputText label="Address" id="address" bind:value={address} required msg={errors.address}/>
    <Select label="Barangay" id="barangay" options={[
        { label: "Barangay 1", value: 1 },
        { label: "Barangay 2", value: 2 },
        { label: "Barangay 3", value: 3 }]} bind:value={barangay} required msg={errors.barangay}/>
    <Select label="Disability Category" id="dis-category" options={options_disCategory} bind:value={disCategory} required msg={errors.disCategory}/>
    <Select label="Disability Nature" id="dis-nature" options={options_disNature} bind:value={disNature} required msg={errors.disNature}/>

    <Textarea label="Remarks" id="remarks" bind:value={remarks}/>


</section>

<section>
    <h1>Education Information</h1>
    <Select label="Education" id="educ-type" options={[
        { label: "Home Program", value: "Home Program" },
        { label: "Non-formal", value: "Nonformal" },
        { label: "Integrated / SPED classes", value: "Integrated/SPED" },
        { label: "Inclusive / General education", value: "Inclusive/Gen. Ed." }]} required bind:value={educType} msg="{errors.educType}"/>
    <InputText label="Education Level" id="educ-lvl" required msg="{errors.educLvl}" bind:value={educLvl} />
    <Select label="Education Status" id="educ-status" options={options_educStatus} required bind:value={educStatus} msg="{errors.educStatus}"/>
    <InputText label="School Year Start" id="ay-start" bind:value={ayStart} type="number" required msg={errors.ayStart} />
    <InputText label="School Year End" id="ay-end" bind:value={ayEnd} type="number" required msg={errors.ayEnd} />

</section>

<section>
    <h1>Documents</h1>
    <Checkbox label="PWD ID" id="pwd" bind:checked={hasPwdId}/>
        {#if hasPwdId}
            <div style="margin-left: 35px">
                <InputText label="ID #" required msg="{errors.pwdId}" bind:value={pwdId}/>
                <InputText label="Expiry Date" type="date" required msg="{errors.pwdExpy}" bind:value={pwdExpy}/>
            </div>
        {/if}
    <Checkbox label="PhilHealth" id="ph-id" bind:checked={hasPhId}/>
    <Checkbox label="Voters Registration" id="vote-id" bind:checked={hasVote}/>
    <Checkbox label="National ID" id="nat-id" bind:checked={hasNatId}/>

</section>

<section id="social-protection-status">
    <h1 style="margin-bottom: 0.5rem;">Social Protection Status</h1>
    <Checkbox label="Participation in family life" style="width:30rem" id="participation-family" bind:checked={partFamily}/>
        {#if partFamily}
            <div style="margin-left: 35px">
            <InputText label="Year accessed" id="part-family-accessed" bind:value={partFamilyYear} type="number" required msg={errors.partFamilyYear} />
            </div>
        {/if}
    <Checkbox label="Participation in community life / clubs" style="width:30rem" id="participation-community" bind:checked={partCommunity}/>
        {#if partCommunity}
            <div style="margin-left: 35px">
            <InputText label="Year accessed" id="part-family-accessed" bind:value={partCommunityYear} type="number" required msg={errors.partCommunityYear} />
            </div>
        {/if}
</section>

<section id="labour-market-status">
    <h1 style="margin-bottom: 0.5rem;">Labor Market Status</h1>
    <Checkbox label="Able to work" id="able-to-work" bind:checked={ableToWork}/>
    {#if ableToWork}
        <div style="margin-left: 35px">
            <Select label="Employment Type" id="employment" options={["Wage-employed", "Self-employed", "Sheltered workshop"]} bind:value={employmentType} />
        </div>
    {/if}
</section>

<!-- hide this if user is not signed in, show: please prepare the following documents to show the officer physically on your scheduled visit
you may contact them here xxxxx -->
<section id="certificate-verification">
    <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
    <Checkbox label="Medical Certificate" id="med-cert" bind:checked={hasMedCert}/>
    <Checkbox label="Birth Certificate" id="birth-cert" bind:checked={hasBrthCert}/>
    <Checkbox label="Barangay Certificate" id="brgy-cert" bind:checked={hasBrgyCert}/>
</section>

<!-- also hide this if not signed in -->
<section id="staff-only">
    <h1 style="margin-bottom: 0.5rem;">Other Information</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
    <InputText type="month" label="Admission Date" id="admission" bind:value={admissionDate} />

</section>


<section style="text-align: center;">
    <Validation msg={errors.overall} style="color:var(--error-color); margin-bottom: 25px; padding: 0 35px;"/>
    <button onclick={handleNext}>Next</button>
</section>
