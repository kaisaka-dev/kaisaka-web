<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


<script lang="ts">
    import Checkbox from "$lib/components/input/Checkbox.svelte";
    import InputText from "$lib/components/input/InputText.svelte";

    import type { documentationInformation } from "../+page.server.js";
    import Validation from "$lib/components/text/Validation.svelte";

    export let data: documentationInformation
    export let socialParticipation = [];
    export let editing: boolean = true
    export let errors = {}

    let selectedIndex = 0

   
    export let showSocialParticipation: boolean = false
    if(showSocialParticipation) {
      for(let i in socialParticipation) {
          socialParticipation[i].isDeleted = false
          socialParticipation[i].isNew = false

      }
    }

    function addParticipationRecord(): void {
          if(selectedIndex == 0) {
               socialParticipation.push({
                    isNew: true,
                    isDeleted: false,
                    participation_type: "Community Life",
               })
          }

          else{
               socialParticipation.push({
                    isNew: true,
                    isDeleted: false,
                    participation_type: "Family Life",
               })
          }

          socialParticipation = socialParticipation
    }

    function deleteParticipationRecord(index:number): void {
          socialParticipation[index].isDeleted = true
          socialParticipation = socialParticipation
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
            <Checkbox disabled = {!editing} label = "Social Participation" bind:checked = {showSocialParticipation}/>
             {#if editing }<div class = "ml-7"> <Validation msg = {errors.socialParticipation} /> </div> {/if}
       </div>
       {#if showSocialParticipation} 
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
                    {#each socialParticipation as social_participation,index}
                      {#if social_participation.participation_type == "Community Life" && social_participation.isDeleted == false}
                         <div class ="flex flex-col md:flex-row"> 
                              <div class = "max-w-50">  <InputText type = "number" disabled = {!editing} bind:value = {social_participation.year} /> </div>
                              {#if editing} <div><i class="fa-solid fa-trash ml-2 mt-1 z-300" on:click = {() => deleteParticipationRecord(index)}></i> </div> {/if} 
                         </div> 
                      {/if}
                    {/each}
                    {:else}
                    {#each socialParticipation as social_participation,index}
                    {#if social_participation.participation_type == "Family Life"  && social_participation.isDeleted == false} 
                         <div class ="flex flex-col md:flex-row"> 
                              <div class = "max-w-50">  <InputText type = "number" disabled = {!editing} bind:value = {social_participation.year} /> </div>
                              {#if editing} <div><i class="fa-solid fa-trash ml-2 mt-1 z-300" on:click = {() => deleteParticipationRecord(index)}></i> </div> {/if} 
                         </div> 
                    {/if}
                    {/each}
                    {/if}
                   {#if editing} <i class = "!text-[var(--pink)] hover:underline hover: cursor-pointer" on:click = {() => addParticipationRecord()}>+Add Record</i> {/if}
               </div>
          </div>
       {/if}
       <div class = "mt-5 z-500">
            <Checkbox label = "PhilHealth" bind:checked = {data.phHealth} disabled = {!editing}/>
       </div>

       <div class = "mt-5 z-500">
            <Checkbox label = "National ID" bind:checked = {data.natID} disabled = {!editing}/>
       </div>
    </div>
    <div class = "flex flex-col !font-bold md:ml-10 z-500">
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