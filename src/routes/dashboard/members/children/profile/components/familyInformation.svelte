<script>
    export let family;
    export let firstName;
    export let editing = false;
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
    {#each family as fammember}
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
            <div class = " mt-4 !font-[JSans]"> {fammember.members.first_name} {fammember.members.last_name}</div>
    </div>
        {/each}
        {:else}
            <div> Child is not part of any family </div>
        {/if}
        {#if editing}
            <div class = "flex flex-col md:flex-row w-full mx-auto">
            <div class = "mt-10 z-500"> <i class = "!text-[var(--green)] hover:underline"> + Add New CWD </i></div>
            <div class = "mt-10 md:ml-50 z-500"> <i class = "!text-[var(--pink)] hover:underline"> + Add/Edit Caregivers </i></div>
            </div>
        {/if}
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->