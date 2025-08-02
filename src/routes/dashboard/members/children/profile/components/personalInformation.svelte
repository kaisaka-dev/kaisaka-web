<script lang="ts">
    import Input from '$lib/components/input/InputText.svelte'
    import Select from '$lib/components/input/Select.svelte';
    import TextArea from '$lib/components/input/InputTextarea.svelte'
    import Check from '$lib/components/input/Checkbox.svelte'
    import type { personalInformation } from '../+page.server.js';
    import { dropdownOptions } from '$lib/types/options.js';

    // fetching the (dropdown) options for disability category


    export let disabled = false;
    export let data: personalInformation;
    export let errors = ""
    export let discatOptions: string[] = []


    


    let age = ""
    let headingmargin =  disabled == true? "ml-22 -mt-70": "ml-22 -mt-85"

    $: if (data.birthday) {
        const birthDate = new Date(data.birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();

        const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
        calculatedAge -= 1;
        }

        age = calculatedAge.toString();
    } else {
        age = "";
    }


</script>

<!-- PERSONAL INFORMATION SECTION BELOW-->
 <div class = {headingmargin} id ="Personal Info">
    <h1 class = "!text-[var(--green)] font-[JSans] ml-33 mt-5 mb-2">
        Information
    </h1>
</div>
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000 max-w-290 mx-auto flex-wrap" >
    <div class = "flex flex-col xl:flex-row !justify-start mt-2">
        <div class = "flex flex-col w-full max-w-280">
                <div class = "mt-4 -ml-4"> <Input label = "First Name" disabled = {disabled} required = {!disabled} msg = {errors.firstName} bind:value = {data.firstName} margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Middle Name" disabled = {disabled} required = {false} bind:value = {data.middleName} margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Last Name" disabled = {disabled} required = {!disabled} msg = {errors.lastName} bind:value = {data.lastName} margin = {true}/> </div>
                <div class = "-ml-4"> <Input type = "date" label = "Birthday" required = {!disabled} msg = {errors.birthday} disabled = {disabled} bind:value = {data.birthday} margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Age" disabled bind:value = {age} margin = {true}/> </div>
                <div class = "-ml-4"> <Select label = "Sex" required = {!disabled} disabled = {disabled} options = {dropdownOptions.sex}  bind:value = {data.sex} margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Address" required = {!disabled} msg = {errors.address} disabled = {disabled} bind:value = {data.address} margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Barangay"  required = {!disabled} msg = {errors.barangay} disabled = {disabled} bind:value = {data.barangay} margin = {true}/> </div>
                {#if !disabled}
                <div class = "-ml-4 z-300"> <Check label = "Able to Work" bind:checked = {data.canWork} margin = {true}/> </div>
                {/if}
                {#if data.canWork}
                    <div class = "-ml-4"> <Select label = "Employment Type" options = {['','Self-Employed','Sheltered Workshop','Wage Employed']} required = {!disabled} msg = {errors.employmentType} disabled = {disabled} bind:value = {data.employmentType} margin = {true}/> </div>
                {/if}
                <div class = "-ml-4"> <Select label = "Disability Category" bind:value = {data.disabilityCategoryID} required = {!disabled} options = {discatOptions} msg = {errors.disabilityCat} disabled = {disabled}  margin = {true}/> </div>
                <div class = "-ml-4"> <Input label = "Disability Nature"  disabled = {disabled} bind:value = {data.disabilityNature} margin = {true}/> </div>
                <div class = "-ml-4 mt-10"> <Input type = "date" label = "Date of Admission" msg = {errors.admissionDate} required = {!disabled} disabled = {disabled} bind:value = {data.admissionDate} margin = {true}/> </div>
        </div>
        <div> 
            <div class = "w-full"> <TextArea disabled = {disabled} value = {data.remarks || "N/A"} label = "Remarks" rows = 10/> </div>
        </div>
    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->