<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
	import { goto } from "$app/navigation";

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
<div id ="Family Info"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5  mb-2">
        Families
        </h1>
    </div>
</div>

<div class = "grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2 border-4 border-[var(--border)] p-4 ml-55 mr-10">
    {#if family.length > 0}
    {#each family as family,familyIndex}
        <div class = "flex flex-col w-full max-w-full">
           <span class = "!bg-[var(--green)] p-2 w-full !text-white">  {familyName(family.data)} </span>
           <div class = "flex flex-col gap-1 p-2 border-4 border-[var(--border)] w-full">
            {#each family.data as member,memberIndex}
                <div class = "flex flex-row">
                    {#if member.isDeleted == false}
                    {#if member.is_child == false}
                    <div class ="!bg-[var(--pink)] !text-[1rem] w-35 !p-1 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                    {:else}
                    <div class ="!bg-[var(--green)] !text-[1rem] w-35 !p-1 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                    {/if}
                    {#if member.is_child}
                    <div class = "ml-10 w-50 hover:underline hover:cursor-pointer"><a href = "/dashboard/members/children/profile?id={member.linkID}" > {member.members.first_name} {member.members.last_name} </a></div>
                    {:else}
                    <div class = "ml-10 w-50 hover:underline hover:cursor-pointer"> <a href = "/dashboard/members/caregivers/profile?id={member.linkID}"> {member.members.first_name} {member.members.last_name} </a></div>
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
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<style>
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
</style>