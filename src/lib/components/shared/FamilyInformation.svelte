<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
	import { goto } from "$app/navigation";

    export let id = "";   // the css id
    export let family = []
    export let firstName = "";
    export let editing = false;
    export let childID = ""
    export let caregiverID = ""
    export let memberType: "child" | "caregiver" = "child"

    function familyName(family:object): string {
        let lastnames: string[] = []

        for(const mem of family){
            lastnames.push(mem.members.last_name)
        }

        let familyname = [...new Set(lastnames)]
        return Array.from(familyname).join(', ')
    }

    for(let i in family) {
        for(let j in family[i].data) {
            family[i].data[j]['isDeleted'] = false
        }
    }

    function deleteFamily(familyIndex: number, memberIndex: number){
        family[familyIndex].data[memberIndex].isDeleted = true
        family = family
    }
</script>


<!-- CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION -->
<div {id} class = "mt-10 w-full max-w-175">

  <h2>Family Information</h2>

  <div class = "flex flex-col mt-2 border-3 border-[var(--border)] p-4 mr-10">
      {#if family.length > 0}
      <div class = "flex flex-col lg:flex-row mb-5">
            <div class = "!bg-[var(--caregiver-indicator)] py-2 px-13 !text-white lg:w-50">
                Caregiver
            </div>
            <div class = "!bg-[var(--green)] py-2 px-18 !text-white lg:w-50 lg:ml-10">
                CYWD
            </div>
      </div>
      {#each family as family,familyIndex}
          <div class = "flex flex-col w-full">
             <span class = "w-full !text-[var(--pink)]">  {familyName(family.data)} </span>
             <div class = "flex flex-col gap-1 p-5 border-4 border-[var(--pink)] w-full">
              {#each family.data as member,memberIndex}
                  <div class = "flex flex-row">
                      {#if member.isDeleted == false}
                      {#if member.is_child == false}
                      <div class ="!bg-[var(--caregiver-indicator)] !text-[1rem] w-full max-w-150 !p-2 text-center !font-bold !text-white flex flex-col lg:flex-row gap-30"> <div class = "!bg-[var(--background)] p-1 w-full max-w-75"> <a href = "/dashboard/members/caregivers/profile?id={member.linkID}"> {member.members.first_name} {member.members.last_name} </a> </div> <div class = "mt-1"> {member.relationship_type} </div> </div>
                      {:else}
                      <div class ="!bg-[var(--green)] !text-[1rem] w-full max-w-150 !p-2 text-center !font-bold !text-white flex flex-col lg:flex-row gap-30"> <div class = "!bg-[var(--background)] p-1 w-full max-w-75"> <a href = "/dashboard/members/children/profile?id={member.linkID}" > {member.members.first_name} {member.members.last_name} </a> </div> <div class = "mt-1"> {member.relationship_type} </div> </div>
                      {/if}
                      {#if editing}
                          <div class = "z-500"><i class="fa-solid fa-trash ml-2" on:click = {()=>deleteFamily(familyIndex,memberIndex)}></i> </div>
                      {/if}
                      {/if}
                  </div>
              {/each}
              {#if editing}
                <div class = "mt-5"> <i class = "fa-solid fa-pen !text-[var(--pink)] hover:underline hover:cursor-pointer"
                                        on:click = {() => goto(`/dashboard/registration?${memberType === 'child' ? 'cwd=' + childID : 'caregiver=' + caregiverID}&familyId=${family.familyId}`)}>
                <span class="font-[JSans] !text-[inherit]">&nbsp Edit Family</span>
                </i></div>
              {/if}
              </div>
          </div>
      {/each}
      {:else}
          <div class = "flex flex-col">
              <div> {memberType === 'child' ? 'Child' : 'Caregiver'} is not part of any families </div>
            {#if editing}
              <div class = "mt-5"> <i class = "fa-solid fa-pen !text-[var(--pink)] hover:underline hover:cursor-pointer"
                                      on:click = {() => goto(`/dashboard/registration?${memberType === 'child' ? 'cwd=' + childID : 'caregiver=' + caregiverID}`)}>
                <span class="font-[JSans] !text-[inherit]">&nbsp Edit Family</span>
              </i></div>
            {/if}
          </div>
       {/if}
  </div>

</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<style>
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
</style>