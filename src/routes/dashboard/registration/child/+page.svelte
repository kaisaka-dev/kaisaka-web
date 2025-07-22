<script lang="ts">
    /**
     * NOTE: THIS PAGE IS EXACTLY THE SAME FOR /dashboard/registration/child and /registration/child
     * when editing this page, just copy the file and move it to its counterpart in the other folder
     */
    import InputText from '$components/input/InputText.svelte';
    import Select from '$components/input/Select.svelte';
    import Textarea from '$components/input/InputTextarea.svelte';
    import Checkbox from '$components/input/Checkbox.svelte';
    import Validation from '$components/text/Validation.svelte';
    import Header from '$components/Header.svelte';

    import { page } from '$app/state';
    import { childFormData } from '$lib/stores/childForm.js';
    import { goto } from '$app/navigation';
    import InputRange from '$components/input/InputRange.svelte';

    // variables affecting the type of view
    /**
     * note: /dashboard/registration and /registration is just the same, the constant is to hide
     * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
     * staffView = false if it is the parent who is accessing the page
     * staffView = true if it is the staff who is accessing the page
     */
    const staffView = /dashboard/i.test(page.url.pathname);
    const thisYear = new Date().getFullYear();  // used to verify participation in family life, community life

    // field variables
    let firstName = "";
    let middleName = "";
    let lastName = "";
    let birthday = $state("");
    let sex = "";
    let address = "";
    let barangay = "";
    let educType = $state("");
    let educStatus = "";
    let educLvl = "";
    let hasPhId = false;
    let hasVote = false;
    let hasNatId = false;
    let hasPwdId = $state(false);
    let pwdId = "";
    let pwdExpy = "";
    let ableToWork = $state(false);
    let employmentType = "";

    let disCategory = "";
    let disNature = "";

    let hasMedCert = false;
    let hasBrgyCert = false;
    let hasBrthCert = false;
    let remarks = "";
    let partFamily = $state(false);
    let partCommunity = $state(false);
    let partFamilyYear = new Date().getFullYear();
    let partCommunityYear = new Date().getFullYear();
    let ayStart = new Date().getFullYear();
    let ayEnd = new Date().getFullYear() + 1;
    let admissionDate = new Date().toISOString().slice(0, 7);

    // let options_disCategory = $state();
    //
    // async function getOptionsDisCategory() {
    //     const response = await fetch('/api/disability_category');
    //     options_disCategory = await response.json();
    // }
    // getOptionsDisCategory()

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
    const options_educStatus = [
        "Past student",
        "New student",
        "Dropped",
        "Completed"
    ];
    const options_educLevel = [
      "Nursery", "Kinder", "SNED", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
      "High School", "Senior High School", "College", "ALS", "Home-based", "EIC"
    ];
    const options_educType = [
      "Not enrolled", "Home program", "Non-formal", "Special (Exclusive school, blind/deaf)", "Integrated / SPED classes", "Inclusive / General education"
    ];
    const options_laborMarketStatus = [
        "Wage-emplyed",
        "Self-employed",
        "Sheltered workshop",
        "None of the above"
    ]


    /* special fields */
    let age = $state("");
    $effect (() => {
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
    )


    let errors = $state(
      {
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
      }
    );

    function validateForm() {
        errors.overall = "";        // resets it

        errors.firstName = firstName.trim() === "" ? "Required" : "";
        errors.lastName = lastName.trim() === "" ? "Required" : "";
        errors.birthday = birthday.trim() === "" ||  Number(age) < 0? "Invalid" : "";
        errors.sex = sex.trim() === "" ? "Required" : "";
        errors.address = address.trim() === "" ? "Required" : "";
        errors.barangay = barangay === "" ? "Required" : "";
        errors.disCategory = disCategory.trim() === "" ? "Required" : "";
        errors.disNature = disNature.trim() === "" ? "Required" : "";
        errors.educType = educType.trim() === "" ? "Required" : "";

        // throws an error if the admission date is blank or is the future
        errors.admissionDate = admissionDate.trim() === "" ? "Required" : "";
        if (errors.admissionDate === "") {
            const admissionDateInt = parseInt(admissionDate.replace("-", ""), 10);
            const todayDateInt = new Date().getFullYear()*100 + new Date().getMonth()+1;
            errors.admissionDate = admissionDateInt > todayDateInt ? "Invalid" : "";
        }


        // only check if the child has pwd id
        if (hasPwdId) {
            errors.pwdId = pwdId.trim() === "" ? "Required" : "";
            errors.pwdExpy = pwdExpy.trim() === "" ? "Required" : "";
        } else {
            errors.pwdId = "";
            errors.pwdExpy = "";
        }

        // only check if the child has participation
        if (partFamily) {
            errors.partFamilyYear = partFamilyYear.toString().trim() === "" || partFamilyYear > thisYear ? "Invalid" : "";
        } else {
            errors.partFamilyYear = "";
        }
        if (partCommunity) {
            errors.partCommunityYear = partCommunityYear.toString().trim() === "" || partCommunityYear > thisYear ? "Invalid" : "";
        } else {
            errors.partCommunityYear = "";
        }

        // only check if the child has education
        if (educType !== "" && educType !== "Not enrolled") {
            errors.educLvl = educLvl.trim() === "" ? "Required" : "";
            errors.educStatus = educStatus.trim() === "" ? "Required" : "";
            errors.ayStart = ayStart === null || ayStart < 1900 || ayStart > 20000
                || ayEnd === null || ayEnd < 1900 || ayEnd > 20000 ||  ayEnd < ayStart
                ? "Invalid" : "";
        } else {
            errors.educLvl = "";
            errors.educStatus = "";
            errors.ayStart = "";
            errors.ayEnd = "";
        }

        for (const error of Object.values(errors)) {
            if (error) {
                console.log("error found: ", error)
                errors.overall = "Please fill out the required fields";
                goto('#child-info');    // scrolls to top
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

            goto('family-info');
            console.log("Form submitted")
        }
    }
    


</script>
{#if staffView}
<Header category="members" page="children" />
{/if}

<section id="child-info">
    <h1>Child Registration</h1>



    <InputText label="First name" id="first-name" bind:value={firstName} required msg={errors.firstName}/>
    <InputText label="Middle name" id="middle-name" bind:value={middleName} />
    <InputText label="Last name" id="last-name" bind:value={lastName} required msg={errors.lastName}/>
    <InputText label="Birthday" id="bday" bind:value={birthday} type="date" required msg={errors.birthday}/>
    <InputText label="Age" id="age" value={age} disabled />
    <Select label="Sex" id="sex" options={["Male", "Female", "Other"]} bind:value={sex} required msg={errors.sex}/>
    <InputText label="Address" id="address" bind:value={address} required msg={errors.address}/>
    <InputText label="Barangay" id="barangay" bind:value={barangay} required msg={errors.barangay}/>
    <Select label="Disability Category" id="dis-category" options={options_disCategory} bind:value={disCategory} required msg={errors.disCategory}/>
    <Textarea label="Disability Nature" id="dis-nature" bind:value={disNature} required msg={errors.disNature}/>

    <Textarea label="Remarks" id="remarks" bind:value={remarks}/>


</section>

<section id="education-info">
    <h1>Education Information</h1>
    <Select label="Education" id="educ-type" options={options_educType} required bind:value={educType} msg={errors.educType}/>
    {#if educType !== "Not enrolled" && educType !== ""}
        <Select label="Education Level" id="educ-lvl" options={options_educLevel} bind:value={educLvl} required msg={errors.educLvl}  />
        <Select label="Education Status" id="educ-status" options={options_educStatus} required bind:value={educStatus} msg={errors.educStatus}/>
        <InputRange label="School Year" id="ay-range" bind:valueFrom={ayStart} bind:valueTo={ayEnd} type="number" required msg={errors.ayStart + " " + errors.ayEnd} />
    {/if}

</section>

<section id="documents">
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
            <Select label="Employment Type" id="employment" options={options_laborMarketStatus} bind:value={employmentType} />
        </div>
    {/if}
</section>

<!-- hide this if user is not signed in, show: please prepare the following documents to show the officer physically on your scheduled visit
you may contact them here xxxxx -->
{#if staffView}
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
    <InputText type="month" label="Admission Date" id="admission" bind:value={admissionDate} msg={errors.admissionDate} />

</section>
{:else}
    <section id="certificate-verification">
        <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>

        <div class="!mx-[35px]">
            For your registration to be confirmed, <span style="color:var(--green)"> please schedule a visit to KAISAKA </span>, and
            prepare to present the following documents to show the KAISAKA officer physically during your visit
            <ul>
                <li>Medical Certificate</li>
                <li>Birth Certificate</li>
                <li>Barangay Certificate</li>
            </ul>

            For more information on how to schedule a visit, please reach out to us at <span style="color:var(--green); text-decoration: underline"> kaisakainc@gmail.com </span>
        </div>
    </section>
{/if}

<section style="text-align: center;">
    <Validation msg={errors.overall} style="color:var(--error-color); margin-bottom: 25px; padding: 0 35px;"/>
    <button onclick={handleNext}>Next</button>
</section>
