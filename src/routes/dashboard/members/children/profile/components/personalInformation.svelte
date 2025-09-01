<script lang="ts">
    import Input from '$lib/components/input/InputText.svelte'
    import Select from '$lib/components/input/Select.svelte';
    import TextArea from '$lib/components/input/InputTextarea.svelte'
    import type { personalInformation } from '../+page.server.js';
    import { dropdownOptions } from '$lib/types/options.js';
    import { navigating } from '$app/stores';

    // fetching the (dropdown) options for disability category


    export let disabled = false;
    export let data: personalInformation;
    export let errors = ""
    export let discatOptions: string[] = []


    let inputDisabled: boolean;

    $: inputDisabled = disabled || !!$navigating;




    let age = ""

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
<h2 >Basic Information</h2>

<div class = "border-[var(--border)] border-3 p-5 mr-10 !font-bold max-w-175 z-2000 flex-wrap" >
    <div class = "flex flex-col xl:flex-row !justify-start p-4">
        <div class = "flex flex-col w-full">
                <Input label = "First Name" disabled = {inputDisabled} required = {!disabled} msg = {errors.firstName} bind:value = {data.firstName} margin = {true}/>
                <Input label = "Middle Name" disabled = {inputDisabled} required = {false} bind:value = {data.middleName} margin = {true}/>
                <Input label = "Last Name" disabled = {inputDisabled} required = {!disabled} msg = {errors.lastName} bind:value = {data.lastName} margin = {true}/>
                <Input type = "date" label = "Birthday" required = {!disabled} msg = {errors.birthday} disabled = {inputDisabled} bind:value = {data.birthday} margin = {true}/>
                <Input label = "Age" disabled bind:value = {age} margin = {true}/>
                <Select label = "Sex" required = {!disabled} disabled = {inputDisabled} options = {dropdownOptions.sex}  bind:value = {data.sex} margin = {true}/>
                <Input label = "Address" required = {!disabled} msg = {errors.address} disabled = {inputDisabled} bind:value = {data.address} margin = {true}/>
                <Input label = "Barangay"  required = {!disabled} msg = {errors.barangay} disabled = {inputDisabled} bind:value = {data.barangay} margin = {true}/>
                <TextArea disabled = {inputDisabled} value = {data.remarks || "N/A"} label = "Remarks" rows = 5/>      
                     

                <!-- {#if !disabled}
                <div class = "z-300"> <Check label = "Able to Work" bind:checked = {data.canWork} margin = {true}/> </div> 
                {/if}
                {#if data.canWork}
                    <Select label = "Employment Type" options = {['Self-Employed','Sheltered Workshop','Wage Employed']} disabled = {inputDisabled} bind:value = {data.employmentType} margin = {true}/>
                {/if} -->
        </div>
    </div>
</div>
<!--PERSONAL INFORMATION SECTION END-->