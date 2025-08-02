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
    import type  { PageData } from '../../../../../.svelte-kit/types/src/routes/$types.js';
    import { dropdownOptions } from '$lib/types/options.js';
    import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';


    // load the data
    const { data } = $props<{ data: PageData }>();
    let options = $state({
        disability_category: data.options.disCategory,
        education_status: dropdownOptions.education_status,
        education_level: dropdownOptions.education_level,
        education_type: dropdownOptions.education_type,
        employment_type: dropdownOptions.employment_type,
        sex: dropdownOptions.sex

    });

    // variables affecting the type of view
    /**
     * note: /dashboard/registration and /registration is just the same, the constant is to hide
     * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
     * staffView = false if it is the parent who is accessing the page
     * staffView = true if it is the staff who is accessing the page
     */
    const staffView = /dashboard/i.test(page.url.pathname);
    const thisYear = new Date().getFullYear();  // used to verify participation in family life, community life
    let loadingNext = $state(false);

    // field variables
    let formData = $state({
        first_name: '',
        middle_name: '',
        last_name: '',
        birthday: '',
        age: '',
        sex: '',
        address: '',
        barangay: '',
        remarks: '',
        date_admission: new Date().toISOString().slice(0, 7),
        disability: {
            category_id: null,  // dropdown, key-value pair
            nature: ''
        },
        educ: {
            type: "",   // enum (required)
            year_start: thisYear,
            year_end: thisYear + 1,
            grade_level: "",   // dropdown, but string in db
            status: ""    // student_status_type: enum (required)
        },
        has: {
            birth_cert: false,
            medical_cert: false,
            barangay_cert: false,
            philhealth: false,
            pwd_id: false,
            pwd: {
                expiry_date: '',
                id: ''
            },
            vote: false,
            national_id: false,
        },
        employment: {
            able_to_work: false,
            type: ''
        },
        part: {
            family_life: false,
            fam_year: thisYear,
            community: false,
            com_year: thisYear
        }
    })


    // returns true if the year is within the range of this year-100 to this year
    function yearValid(year: number) {
        return year >= thisYear-100 && year <= thisYear;
    }
    // returns true if year is within range of this year +- 100
    function schoolYearValid(year: number) {
        return year >= thisYear-100 && year <= thisYear+100;
    }


    /* special fields */
    $effect (() => {
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

        errors.firstName = formData.first_name.trim() === "" ? "Required" : "";
        errors.lastName = formData.last_name.trim() === "" ? "Required" : "";
        errors.birthday = formData.birthday.trim() === "" ||  Number(formData.age) < 0? "Invalid" : "";
        errors.sex = formData.sex.trim() === "" ? "Required" : "";
        errors.address = formData.address.trim() === "" ? "Required" : "";
        errors.barangay = formData.barangay === "" ? "Required" : "";
        errors.disCategory = formData.disability.category_id == null ? "Required" : "";
        // errors.disNature = formData.disability.nature.trim() === "" ? "Required" : "";   // not required na raw
        errors.educType = formData.educ.type.trim() === "" ? "Required" : "";

        // throws an error if the admission date is blank or is the future
        errors.admissionDate = formData.date_admission.trim() === "" ? "Required" : "";
        if (errors.admissionDate === "") {
            const admissionDateInt = parseInt(formData.date_admission.replace("-", ""), 10);
            const todayDateInt = new Date().getFullYear()*100 + new Date().getMonth()+1;
            errors.admissionDate = admissionDateInt > todayDateInt ? "Invalid" : "";
        }


        // only check if the child has pwd id
        if (formData.has.pwd_id) {
            errors.pwdId = formData.has.pwd.id.trim() === "" ? "Required" : "";
            errors.pwdExpy = formData.has.pwd.expiry_date.trim() === "" ? "Required" : "";
        } else {
            errors.pwdId = "";
            errors.pwdExpy = "";
        }

        // only check if the child has participation
        if (formData.part.family_life) {
            errors.partFamilyYear = !yearValid(formData.part.fam_year)? "Invalid" : "";
        } else {
            errors.partFamilyYear = "";
        }
        if (formData.part.community) {
            errors.partCommunityYear = !yearValid(formData.part.com_year) ? "Invalid" : "";
        } else {
            errors.partCommunityYear = "";
        }

        // only check if the child has education
        if (formData.educ.type !== "" && formData.educ.type !== "Not enrolled") {
            errors.educLvl = formData.educ.grade_level.trim() === "" ? "Required" : "";
            errors.educStatus = formData.educ.status.trim() === "" ? "Required" : "";
            errors.ayStart = !schoolYearValid(formData.educ.year_start) || !schoolYearValid(formData.educ.year_end)
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
        loadingNext = true;
        if (validateForm()) {
            childFormData.update(current => ({
                ...current,
                address: {
                    address: formData.address,
                },
                barangay: {
                    name: formData.barangay,
                },
                member: {
                    first_name: formData.first_name,
                    middle_name: formData.middle_name,
                    last_name: formData.last_name,
                    birthday: formData.birthday,
                    sex: formData.sex,
                    admission_date: `${formData.date_admission}-01T00:00:00Z` // "2024-03-01T00:00:00Z"
                },
                child: {
                    has_barangay_cert: formData.has.barangay_cert,
                    has_birth_cert: formData.has.birth_cert,
                    has_medical_cert: formData.has.medical_cert,
                    has_vote: formData.has.vote,
                    has_national_id: formData.has.national_id,
                    has_philhealth: formData.has.philhealth,
                    is_active: true,
                    disability_id: formData.disability.category_id,
                    disability_nature: formData.disability.nature,
                    remarks: formData.remarks
                },


                // documents: only if theres pwdId
                ...(formData.has.pwd_id
                ? {
                    pwd_id: {
                      pwd_id: formData.has.pwd.id,
                      expiry_date: formData.has.pwd.expiry_date
                    }
                  }
                : {}),
                // social participation: only if they're part of family life group
                ...(formData.part.family_life ? {
                    social_participation_fam: {
                        child_id: "",
                        participation_type: "Family Life",
                        year: formData.part.fam_year
                    }
                }: {}),
                // social participation: only if they're part of community group
                ...(formData.part.community ? {
                    social_participation_com: {
                        child_id: "",
                        participation_type: "Community Life",
                        year: formData.part.com_year
                    }
                }: {}),
                // labor market status: only if they're able to work
                ...(formData.employment.able_to_work ? {
                    employment_status: {
                        able_to_work: formData.employment.able_to_work,
                        employment_type: formData.employment.type || null
                    }
                }: {}),
                // education status: only if they're part of community group
                ...(formData.educ.type !== "Not enrolled" ? {
                    education_status: {
                        year_start: formData.educ.year_start,
                        education_type: formData.educ.type,
                        year_end: formData.educ.year_end,
                        grade_level: formData.educ.grade_level,
                        student_status_type: formData.educ.status
                    }
                }: {})

            }));

            goto('family-info');
            console.log("Form submitted")
        } else {
            loadingNext = false;
        }

    }
    


</script>
{#if staffView}
<Header category="members" page="children" />
{/if}

<section id="child-info">
    <h1>Register Child/Youngster with Disability</h1>



    <InputText label="First name" id="first-name" bind:value={formData.first_name} required msg={errors.firstName}/>
    <InputText label="Middle name" id="middle-name" bind:value={formData.middle_name} />
    <InputText label="Last name" id="last-name" bind:value={formData.last_name} required msg={errors.lastName}/>
    <InputText label="Birthday" id="bday" bind:value={formData.birthday} type="date" required msg={errors.birthday}/>
    <InputText label="Age" id="age" value={formData.age} disabled />
    <Select label="Sex" id="sex" options={options.sex} bind:value={formData.sex} required msg={errors.sex}/>
    <InputText label="Address" id="address" bind:value={formData.address} required msg={errors.address}/>
    <InputText label="Barangay" id="barangay" bind:value={formData.barangay} required msg={errors.barangay}/>
    <Select label="Disability Category" id="dis-category" options={options.disability_category} bind:value={formData.disability.category_id} required msg={errors.disCategory}/>
    <Textarea label="Disability Nature" id="dis-nature" bind:value={formData.disability.nature} />

    <Textarea label="Remarks" id="remarks" bind:value={formData.remarks}/>


</section>

<section id="education-info">
    <h1>Education Information</h1>
    <Select label="Education" id="educ-type" options={options.education_type} required bind:value={formData.educ.type} msg={errors.educType}/>
    {#if formData.educ.type !== "Not enrolled" && formData.educ.type !== ""}
        <Select label="Education Level" id="educ-lvl" options={options.education_level} bind:value={formData.educ.grade_level} required msg={errors.educLvl}  />
        <Select label="Education Status" id="educ-status" options={options.education_status} required bind:value={formData.educ.status} msg={errors.educStatus}/>
        <InputRange label="School Year" id="ay-range" bind:valueFrom={formData.educ.year_start} bind:valueTo={formData.educ.year_end} type="number" required msg={errors.ayStart + " " + errors.ayEnd} />
    {/if}

</section>

<section id="documents">
    <h1>Documents</h1>
    <Checkbox label="PWD ID" id="pwd" bind:checked={formData.has.pwd_id}/>
        {#if formData.has.pwd_id}
            <div style="margin-left: 35px">
                <InputText label="ID #" required msg="{errors.pwdId}" bind:value={formData.has.pwd.id}/>
                <InputText label="Expiry Date" type="date" required msg="{errors.pwdExpy}" bind:value={formData.has.pwd.expiry_date}/>
            </div>
        {/if}
    <Checkbox label="PhilHealth" id="ph-id" bind:checked={formData.has.philhealth}/>
    <Checkbox label="Voters Registration" id="vote-id" bind:checked={formData.has.vote}/>
    <Checkbox label="National ID" id="nat-id" bind:checked={formData.has.national_id}/>

</section>

<section id="social-participation-status">
    <h1 style="margin-bottom: 0.5rem;">Social Participation</h1>
    <Checkbox label="Participation in family life" style="width:30rem" id="participation-family" bind:checked={formData.part.family_life}/>
        {#if formData.part.family_life}
            <div style="margin-left: 35px">
            <InputText label="Year accessed" id="part-family-accessed" bind:value={formData.part.fam_year} type="number" required msg={errors.partFamilyYear} />
            </div>
        {/if}
    <Checkbox label="Participation in community life / clubs" style="width:30rem" id="participation-community" bind:checked={formData.part.community}/>
        {#if formData.part.community}
            <div style="margin-left: 35px">
            <InputText label="Year accessed" id="part-family-accessed" bind:value={formData.part.com_year} type="number" required msg={errors.partCommunityYear} />
            </div>
        {/if}
</section>

<section id="labour-market-status">
    <h1 style="margin-bottom: 0.5rem;">Labor Market Status</h1>
    <Checkbox label="Able to work" id="able-to-work" bind:checked={formData.employment.able_to_work}/>
    {#if formData.employment.able_to_work}
        <div style="margin-left: 35px">
            <Select label="Employment Type" id="employment" options={options.employment_type} bind:value={formData.employment.type} />
        </div>
    {/if}
</section>

<!-- hide this if user is not signed in, show: please prepare the following documents to show the officer physically on your scheduled visit
you may contact them here xxxxx -->
{#if staffView}
<section id="certificate-verification">
    <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
    <Checkbox label="Medical Certificate" id="med-cert" bind:checked={formData.has.medical_cert}/>
    <Checkbox label="Birth Certificate" id="birth-cert" bind:checked={formData.has.birth_cert}/>
    <Checkbox label="Barangay Certificate" id="brgy-cert" bind:checked={formData.has.barangay_cert}/>
</section>

<!-- also hide this if not signed in -->
<section id="staff-only">
    <h1 style="margin-bottom: 0.5rem;">Other Information</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:var(--text-color); margin-bottom: 25px; padding: 0 35px;"/>
    <InputText type="month" label="Admission Date" id="admission" bind:value={formData.date_admission} msg={errors.admissionDate} />

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

    {#if loadingNext}
        <LoadingBtn label="Next" btnClass=""/>
    {:else}
        <button onclick={handleNext}>Next</button>
    {/if}
</section>
