<script lang="ts">
    import Checkbox from "$lib/components/input/Checkbox.svelte";
    import InputText from "$lib/components/input/InputText.svelte";

    import type { documentationInformation } from "../+page.server.js";

    export let data: documentationInformation
    export let socialParticipation;
    export let editing: boolean = true
    export let errors = ""

    let familyLife: string[] = []
    let communityLife: string[] = []

    let selectedIndex = 0

    for(let i in socialParticipation){
          if(socialParticipation[i].participation_type === "Community Life") {
               communityLife.push(socialParticipation[i])
          }

          else{
               familyLife.push(socialParticipation[i])
          }
    }

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
            <InputText type = "date" disabled = {!editing} required = {editing} msg = {errors.pwdExpiry} label = "Expiry Date" bind:value = {data.pwdExpiry}/>
       {/if}

       <div>
            <Checkbox disabled label = "Social Participation" checked = {socialParticipation}/>
       </div>
       {#if socialParticipation} 
          <div class = "flex flex-col md:ml-20 ">
               <div class = "flex flex-col md:flex-row">
                    Participation type
                     <div> <select class = "ml-5 w-full md:w-50" on:change = {(e)=>selectedIndex = e.target.selectedIndex}>
                         <option> Community Life </option>
                         <option> Family Life</option>
                     </select> </div>
               </div>
                <div class = "grid grid-cols-1 gap-5 mt-5">
                    <div> Years of Access: </div>
                    {#if selectedIndex == 0} 
                    <div class = "max-w-50"> <InputText type  = "number" value = {communityLife[0].year} /> </div>
                    <div class = "max-w-50"> <InputText  type = "number" value = {communityLife[0].year} /> </div>
                    <div class = "max-w-50"> <InputText  type = "number" value = {communityLife[0].year} /> </div>
                    <div class = "max-w-50"> <InputText type = "number" value = {communityLife[0].year} /> </div>
                    {:else if selectedIndex == 1}
                    <div class = "max-w-50"> <InputText type = "number" value = {communityLife[0].year} /> </div>
                    {/if}
               </div>
          </div>
       {/if}
       <div class = "mt-5">
            <Checkbox label = "PhilHealth" bind:checked = {data.phHealth} disabled = {!editing}/>
       </div>

       <div class = "mt-5">
            <Checkbox label = "National ID" bind:checked = {data.natID} disabled = {!editing}/>
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