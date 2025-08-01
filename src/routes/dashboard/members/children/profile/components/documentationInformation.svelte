<script lang="ts">
    import Checkbox from "$lib/components/input/Checkbox.svelte";
    import InputText from "$lib/components/input/InputText.svelte";

    import type { documentationInformation } from "../+page.server.js";

    export let data: documentationInformation
    export let editing: boolean = true
    export let errors = ""
</script>

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-col lg:flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 max-w-250 mx-auto">
    <div class = "flex flex-col !font-bold w-full max-w-120 mx-auto z-500"> 
       <div>
            <Checkbox label = "PWD ID" bind:checked = {data.hasPWD} disabled = {!editing}/>
       </div>
       {#if data.hasPWD} 
            <InputText type = "text" disabled = {!editing} required = {editing} msg = {errors.pwdID} label = "ID #" bind:value = {data.pwdID} />
            <InputText type = "text" disabled = {!editing} required = {editing} msg = {errors.pwdExpiry} label = "Expiry Date" bind:value = {data.pwdExpiry}/>
       {/if}

       <!-- <div>
            <Checkbox disabled label = "Social Security" checked = {data.child?.socialProtection?.has}/>
       </div>
       {#if data.child?.socialProtection?.has} 
       <div class = "w-150">
            {#if data.child?.socialProtection?.community_club}
            <Checkbox checked disabled label = "Participation in Community Life" />
            <div class = "w-150">
            <InputText disabled type = "text" label = "Year of Community Access" value = {data.child.socialProtection.community_year}/>
            </div>
            {/if}

            {#if data.child?.socialProtection?.fam_life}
            <Checkbox checked disabled label = "Participation in Family Life" />
            <div class = "w-150">
            <InputText disabled type = "text" label = "Year of Family Access" value = {data.child.socialProtection.family_year}/>
            </div>
            {/if} 
       </div>
       {/if} -->
       <div class = "mt-5">
            <Checkbox label = "PhilHealth" bind:checked = {data.phHealth} disabled = {!editing}/>
       </div>

       <div class = "mt-5">
            <Checkbox label = "National ID" bind:checked = {data.natCert} disabled = {!editing}/>
       </div>
    </div>
    <div class = "flex flex-col !font-bold md:ml-10">
        <div>
            <Checkbox label = "Medical Certificate" bind:checked = {data.medCert} disabled = {!editing}/>
       </div>
        <div>
            <Checkbox label = "Birth Certificate" bind:checked = {data.birthCert} disabled = {!editing}/>
       </div>
        <div>
            <Checkbox label = "Barangay Certificate" bind:checked = {data.barangayCert} disabled = {!editing}/>
       </div>
        <div>
            <Checkbox label = "Voter ID" bind:checked = {data.voterID} disabled = {!editing}/>
       </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->