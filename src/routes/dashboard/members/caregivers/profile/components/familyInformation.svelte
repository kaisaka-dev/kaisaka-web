<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
	import { goto } from "$app/navigation";

    export let family = []
    export let editing: boolean = false
    export let caregiverID: string = ""


     //below are essential functions for the page to work
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

<style>
    .information{
        display: flex;
        flex-direction: row;
        margin-top: 15px;
        margin-left:10px;
    }

    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
</style>

<div class = "mt-10">
            <div id = "Family Info" >
                <h2> Families </h2>
                <div class = "grid grid-cols-2 gap-5 mt-2 border-4 border-[var(--border)] p-4" >
                {#if family.length > 0}
                {#each family as family,familyIndex}
                    <div class = "flex flex-col min-w-100 w-105">
                       <span class = "!bg-[var(--green)] p-2 w-110 min-w-110 !text-white">  {familyName(family.data)} </span>
                       <div class = "border-4 border-[var(--border)]  md:w-110">
                        {#each family.data as member,memberIndex}
                            <div class = "information"> 
                                {#if member.isDeleted == false}
                                {#if member.is_child == false}
                                <div class ="!bg-[var(--pink)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                                {:else}
                                <div class ="!bg-[var(--green)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                                {/if}
                                <div class = "mt-2 ml-10 w-50"> {member.members.first_name} {member.members.last_name}</div>
                                {#if editing}
                                    <div class = "z-500 -mt-2"><i class="fa-solid fa-trash ml-2 mt-5" on:click = {()=>deleteFamily(familyIndex,memberIndex)}></i> </div> 
                                {/if}
                                {/if}
                            </div>
                        {/each}
                        {#if editing}
                            <div class = "flex flex-row">
                                <div class = "mt-5 z-500"> <i class = "!text-[var(--green)] hover:underline hover:cursor-pointer" on:click = {() => goto('/dashboard/registration/child')}> + Add New CYWD </i></div>
                                <div class = "mt-5 ml-10 z-500"> <i class = "!text-[var(--pink)] hover:underline hover:cursor-pointer" on:click = {() => goto(`/dashboard/registration/family-info?family=${family.data[0].family_id}`)}> + Add/Edit Caregivers </i></div>
                            </div>
                        {/if}
                        </div>
                    </div>        
                {/each}
                {:else}
                    <div class = "flex flex-col">
                        <div>  Caregiver is not part of any families </div>
                    {#if editing}
                            <div class = "flex flex-row">
                                <div class = "mt-5 z-500"> <i class = "!text-[var(--green)] hover:underline hover:cursor-pointer" on:click = {()=> goto(`/dashboard/registration/child`)}> + Add New CYWD </i></div>
                                <div class = "mt-5 ml-10 z-500"> <i class = "!text-[var(--pink)] hover:underline hover:cursor-pointer" on:click = {() => goto(`/dashboard/registration/family-info?caregiver=${caregiverID}`)}> + Add/Edit Caregivers </i></div>
                            </div>
                        {/if}
                    </div>
                 {/if}
                </div>
            </div>
</div>