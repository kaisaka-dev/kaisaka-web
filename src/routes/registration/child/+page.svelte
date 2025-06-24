<script lang="ts">
    import InputDate from '../../../components/input/InputDate.svelte'
    import InputText from '../../../components/input/InputText.svelte';
    import Select from '../../../components/input/Select.svelte';
    import Textarea from '../../../components/input/InputTextarea.svelte';
    import Checkbox from '../../../components/input/Checkbox.svelte';
    import Validation from '../../../components/text/Validation.svelte';
    import Header from '../../../components/Header.svelte';


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
        errors.firstName = firstName.trim() === "" ? "Error: field is required" : "";
        errors.lastName = lastName.trim() === "" ? "Error: field is required" : "";
        errors.birthday = birthday.trim() === "" ? "Error: field is required" : "";
        errors.sex = sex.trim() === "" ? "Error: field is required" : "";
        errors.address = address.trim() === "" ? "Error: field is required" : "";
        errors.barangay = barangay.trim() === "" ? "Error: field is required" : "";
        errors.school = school.trim() === "" ? "Error: field is required" : "";
        errors.educationLevel = educationLevel.trim() === "" ? "Error: field is required" : "";

        errors.pwdId = pwdId.trim() === "" ? "Error: field is required" : "";
        errors.pwdExpy = pwdExpy.trim() === "" ? "Error: field is required" : "";
    }


</script>
<Header category="members" page="children" />

<section>
    <h1>Child Registration</h1>



    <InputText label="First name" id="first-name" bind:value={firstName} required msg={errors.firstName}/>
    <InputText label="Last name" id="last-name" bind:value={lastName} required msg={errors.lastName}/>
    <InputDate label="Birthday" id="bday" bind:value={birthday} required msg={errors.birthday}/>
    <InputText label="Age" id="age" value={age} disabled />
    <Select label="Sex" id="sex" options={["Male", "Female"]} required msg={errors.sex}/>
    <InputText label="Address" id="address" bind:value={address} required msg={errors.address}/>

    <Select label="Barangay" id="barangay" options={["Barangay 1", "Barangay 2", "Barangay 3"]} required msg={errors.barangay}/>
    <Textarea label="Remarks" id="remarks" />


</section>

<section>
    <h1>Education Information</h1>

    <Select label="School" id="" options={["Home program", "Non-formal", "Inclusive", "Integrated / SPED classes", "Inclusive / General education"]} required msg="{errors.school}"/>
    <InputText label="Education Level" id="education" required msg="{errors.educationLevel}"/>
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

<!-- hide this if user is not signed in, show: please prepare the following documents to show the officer physically on your scheduled visit
you may contact them here xxxxx -->
<section>
    <h1 style="margin-bottom: 0.5rem;">Certificate Verification</h1>
    <Validation msg="Let the officer-in-charge verify the portion below" style="color:lightgray; margin-bottom: 25px; padding: 0 35px;"/>
    <Checkbox label="Medical Certificate" id="med-cert"/>
    <Checkbox label="Birth Certificate" id="birth-cert"/>
    <Checkbox label="Barangay Certificate" id="brgy-cert"/>

</section>


<section style="text-align: center;">
    <button on:click={validateForm}>Next</button>
</section>
