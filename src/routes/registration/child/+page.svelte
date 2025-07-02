<script lang="ts">
    import InputDate from '../../../components/input/InputDate.svelte'
    import InputText from '../../../components/input/InputText.svelte';
    import Select from '../../../components/input/Select.svelte';
    import Textarea from '../../../components/input/InputTextarea.svelte';
    import Checkbox from '../../../components/input/Checkbox.svelte';
    import Validation from '../../../components/text/Validation.svelte';
    import Header from '../../../components/Header.svelte';
    
    import { childFormData } from '../../../lib/stores/childForm.js';
    import { goto } from '$app/navigation';

    let firstName = "";
    let lastName = "";
    let birthday = "";
    let sex = "";
    let address = "";
    let barangay = "";
    let school = "";
    let educationLevel = "";
    let hasPwdId = false;
    let pwdId = "";
    let pwdExpy = "";
    let ableToWork = false;
    let employmentType = "";

    let has_med_cert = false;
    let has_brgy_cert = false;
    let has_brth_cert = false;
    let remarks = "";
    let part_family = false;
    let part_community = false;


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
        firstName: "",
        lastName: "",
        birthday: "",
        sex: "",
        address: "",
        barangay: "",
        school: "",
        educationLevel: "",
        pwdId: "",
        pwdExpy: ""
    };

    function validateForm() {
        errors.firstName = firstName.trim() === "" ? "First name: field is required" : "";
        errors.lastName = lastName.trim() === "" ? "Last name: field is required" : "";
        errors.birthday = birthday.trim() === "" ? "birthday: field is required" : "";
        errors.sex = sex.trim() === "" ? "sex: field is required" : "";
        errors.address = address.trim() === "" ? "address: field is required" : "";
        errors.barangay = !barangay ? "barangay: field is required" : "";
        errors.school = school.trim() === "" ? "school: field is required" : "";
        errors.educationLevel = educationLevel.trim() === "" ? "educationLevel: field is required" : "";

        // only check if the child has pwd id
        if (hasPwdId) {
            errors.pwdId = pwdId.trim() === "" ? "pwdId: field is required" : "";
            errors.pwdExpy = pwdExpy.trim() === "" ? "pwdExpy: field is required" : "";
        } else {
            errors.pwdId = "";
            errors.pwdExpy = "";
        }

        for (const error of Object.values(errors)) {
            if (error) {
                console.log("error found: ", error)
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
                    has_barangay_cert: has_brgy_cert,
                    has_birth_cert: has_brth_cert,
                    has_medical_cert: has_med_cert,
                    is_active: true,
                    philhealth_id: null, //null for now
                    disability_id: null, //null for now
                    disability_nature: null, //null for now
                    remarks: remarks
                },
                education_status: {
                    year_start: 2025, //2025 for now
                    education_type: school,
                    year_end: null, //for now
                    grade_level: educationLevel
                },
                social_protection_status: {
                    participates_community_club: part_community,
                    participates_family_life: part_family
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
    <InputText label="Last name" id="last-name" bind:value={lastName} required msg={errors.lastName}/>
    <InputDate label="Birthday" id="bday" bind:value={birthday} required msg={errors.birthday}/>
    <InputText label="Age" id="age" value={age} disabled />
    <Select label="Sex" id="sex" options={["Male", "Female", "Other"]} bind:value={sex} required msg={errors.sex}/>
    <InputText label="Address" id="address" bind:value={address} required msg={errors.address}/>
    <Select label="Barangay" id="barangay" options={[
        { label: "Barangay 1", value: 1 },
        { label: "Barangay 2", value: 2 },
        { label: "Barangay 3", value: 3 }]} bind:value={barangay} required msg={errors.barangay}/>
    <Textarea label="Remarks" id="remarks" bind:value={remarks}/>


</section>

<section>
    <h1>Education Information</h1>
    <Select label="School" id="" options={[
        { label: "Home Program", value: "Home Program" },
        { label: "Non-formal", value: "Nonformal" },
        { label: "Integrated / SPED classes", value: "Integrated/SPED" },
        { label: "Inclusive / General education", value: "Inclusive/Gen. Ed." }]} required bind:value={school} msg="{errors.school}"/>
    <InputText label="Education Level" id="education" required msg="{errors.educationLevel}" bind:value={educationLevel} />
</section>

<section>
    <h1>Documents</h1>
    <Checkbox label="PWD ID" id="pwd" bind:checked={hasPwdId}/>
        {#if hasPwdId}
            <div style="margin-left: 35px">
                <InputText label="ID #" required msg="{errors.pwdId}" bind:value={pwdId}/>
                <InputDate label="Expiry Date" required msg="{errors.pwdExpy}" bind:value={pwdExpy}/>
            </div>
        {/if}
    <Checkbox label="Philhealth" id="ph-id"/>

</section>

<section id="social-protection-status">
    <h1 style="margin-bottom: 0.5rem;">Social Protection Status</h1>
    <Checkbox label="Participation in family life" style="width:30rem" id="participation-family" bind:checked={part_family}/>
    <Checkbox label="Participation in community life / clubs" style="width:30rem" id="participation-community" bind:checked={part_community}/>
</section>

<section id="labour-market-status">
    <h1 style="margin-bottom: 0.5rem;">Labor Market Status</h1>
    <Checkbox label="Able to work" id="pwd" bind:checked={ableToWork}/>
    {#if ableToWork}
        <div style="margin-left: 35px">
            <Select label="Employment Type" id="employment" options={["Wage Employed","Self-Employed","Sheltered Workshop"]} bind:value={employmentType} />
        </div>
    {/if}
</section>

<!-- hide this if user is not signed in, show: please prepare the following documents to show the officer physically on your scheduled visit
you may contact them here xxxxx -->
<section id="certificate-verification">
    <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:lightgray; margin-bottom: 25px; padding: 0 35px;"/>
    <Checkbox label="Medical Certificate" id="med-cert" bind:checked={has_med_cert}/>
    <Checkbox label="Birth Certificate" id="birth-cert" bind:checked={has_brth_cert}/>
    <Checkbox label="Barangay Certificate" id="brgy-cert" bind:checked={has_brgy_cert}/>

</section>

<!-- also hide this if not signed in -->
<section id="staff-only">

</section>


<section style="text-align: center;">
    <button onclick={handleNext}>Next</button>
</section>
