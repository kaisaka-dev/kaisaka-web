<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
	import { goto } from "$app/navigation";


    export let family = [];
    export let firstName;
    export let editing = false;
    export let childID = ""

    
    for(let i in family){
        family[i]["isDeleted"] = false
    }
    function deleteFamily(index:number){
        family[index].isDeleted = true
        family = family
    }
</script>


<!-- CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION -->
<div id ="Family Info"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5  mb-2">
        Family
        </h1>
    </div>
</div>

<div class = "flex flex-col md:items-left max-w-170 mx-auto border-[var(--border)] border-4 ml-55 mr-10 p-6">
    {#if family.length > 0}
    {#each family as fammember, index}
    {#if fammember.isDeleted == false}
    <div class = "flex flex-col md:flex-row mb-5">
        {#if fammember?.is_child == false}
            <div class = "!bg-[var(--pink)] py-4 w-full max-w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > {fammember.relationship_type} </div>
            {:else if fammember?.is_child == true}
                {#if fammember.members.first_name === firstName}
                <div class = "!bg-[var(--green)] py-4 w-full max-w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
                {:else}
                <div class = "!bg-[var(--green)] py-4 w-full max-w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Sibling </div>
                {/if}
        {/if}
            <div class = "flex flex-col md:flex-row">
                    <div class = " mt-4 !font-[JSans] max-w-50 md:w-50 hover:underline"> <a href = "/dashboard/members/children/profile?id=${fammember.members.id}"> {fammember.members.first_name} {fammember.members.last_name} </a></div>
            {#if editing}
            <div class = "z-500"><i class="fa-solid fa-trash ml-2 mt-5" on:click ={()=>deleteFamily(index)}></i> </div> 
            {/if}
            </div>
    </div>
        {/if}
        {/each}
        {:else}
            <div> Child is not part of any family </div>
        {/if}
        {#if editing}
            <div class = "flex flex-col md:flex-row w-full mx-auto">
            <div class = "mt-10 z-500"> <i class = "!text-[var(--green)] hover:underline hover:cursor-pointer" on:click = {()=> goto(`/dashboard/registration/child`)}> + Add New CYWD </i></div>
            <div class = "mt-10 md:ml-50 z-500"> <i class = "!text-[var(--pink)] hover:underline hover:cursor-pointer" on:click = {()=> goto(`/dashboard/registration/family-info?cwd=${childID}`)}> + Add/Edit Caregivers </i></div>
            </div>
        {/if}
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->