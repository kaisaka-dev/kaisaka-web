<script lang="ts">
    import Header from '$components/Header.svelte'
    import Input from '$components/input/InputText.svelte'
    import Check from '$components/input/Checkbox.svelte'
    import Select from '$components/input/Select.svelte'
    import { goto } from '$app/navigation'

    export let data;
    import PersonalInformation from './components/personalInformation.svelte'

    //below are functions needed for the page
    let selected = data.child?.schoolYearArray[0]
</script>


<Header/>

<section>
    <h1>
       {data.child?.firstName ?? "First Name Missing!"} {data.child?.lastName ?? "Last Name Missing!"}'s Profile 
    </h1>
</section>
<div class = "flex flex-wrap ml-10 m-4 sticky top-20">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#top">Information </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Education Info">Education </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">Documents </a>
        </div>
        
        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>
        <div>
            <button class="w-40 -ml-5 mt-10" on:click={() => goto(`/dashboard/members/children/profile/edit?id=${data.child.id}`)}>Edit Profile</button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5"></div>
</div>

<!-- PERSONAL INFORMATION SECTION BELOW-->
 <PersonalInformation data = {data.child} disabled = {true} />
<!-- PERSONAL INFORMATION SECTION END-->


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
    {#if data.family.length > 0}
    {#each data.family as fammember}
    <div class = "flex flex-col md:flex-row mb-5">
        {#if fammember?.is_child == false}
            <div class = "!bg-[var(--pink)] py-4 w-full max-w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > {fammember.relationship_type} </div>
            {:else if fammember?.is_child == true}
                {#if fammember.members.first_name === data.child.firstName}
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
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION


<--CONTAINER FOR EDUCATION HISTORY-->
<div id ="Education Info"></div>
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-6">
        Education History
        </h1>
    </div>
    <div class = "flex flex-col md:items-left max-w-170 border-[var(--border)] border-4 ml-55 mr-10 p-6 mt-10">
        {#if data.child?.schoolYearArray?.length > 0}
        <div> <Select label = "Please select a school year" bind:value = {selected} options = {data.child?.schoolYearArray} /></div>
        <div class = "mt-3 ml-8"> Education Type: {data.child?.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.education_type || "N/A"}</div>
        <div class = "mt-3 ml-8"> Education Level:  {data.child?.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.grade_level || "N/A"}</div>
        <div class = "mt-3 ml-8"> Education Status: {data.child?.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.student_status_type || "N/A"} </div>
        <div class = "mt-3 ml-8"> School Year Start:  {data.child?.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.year_start || "N/A"} </div>
        <div class = "mt-3 ml-8"> School Year End: {data.child?.educationHistory[data.child.schoolYearArray?.indexOf(selected)]?.year_end || "N/A"} </div>
        {:else}
        This child has no education history
        {/if}
    </div>
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-col lg:flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 max-w-250 mx-auto">
    <div class = "flex flex-col !font-bold w-full max-w-120 mx-auto"> 
       <div>
            <Check label = "PWD ID" checked = {data.child?.pwd?.has} disabled/>
       </div>
       {#if data.child?.pwd?.has} 
            <Input type = "text" disabled label = "ID #" value = {data.child?.pwd.id} />
            <Input type = "text" disabled  label = "Expiry Date" value = {data.child.pwd.expiry}/>
       {/if}

       <div>
            <Check disabled label = "Social Security" checked = {data.child?.socialProtection?.has}/>
       </div>
       {#if data.child?.socialProtection?.has} 
       <div class = "w-150">
            {#if data.child?.socialProtection?.community_club}
            <Check checked disabled label = "Participation in Community Life" />
            <div class = "w-150">
            <Input disabled type = "text" label = "Year of Community Access" value = {data.child.socialProtection.community_year}/>
            </div>
            {/if}

            {#if data.child?.socialProtection?.fam_life}
            <Check checked disabled label = "Participation in Family Life" />
            <div class = "w-150">
            <Input disabled type = "text" label = "Year of Family Access" value = {data.child.socialProtection.family_year}/>
            </div>
            {/if} 
       </div>
       {/if}
       <div class = "mt-5">
            <Check label = "PhilHealth" checked = {data.child?.philHealth} disabled/>
       </div>

       <div class = "mt-5">
            <Check label = "National ID" checked = {data.child?.national_id} disabled/>
       </div>
    </div>
    <div class = "flex flex-col !font-bold md:ml-10">
        <div>
            <Check label = "Medical Certificate" checked = {data.child?.med_cert} disabled/>
       </div>
        <div>
            <Check label = "Birth Certificate" checked = {data.child?.birth_cert} disabled/>
       </div>
        <div>
            <Check label = "Barangay Certificate" checked = {data.child?.barangay_cert} disabled/>
       </div>
        <div>
            <Check label = "Voter ID" checked = {data.child?.voter_id} disabled/>
       </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col max-w-255 mx-auto border-4 border-[var(--border)] ml-55 mr-10 p-4" id ="Intervention Info">
    {#if data.interventioninfo.length > 0}
    <div class = "flex flex-col w-full mx-auto max-w-250">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold lg:ml-55">Intervention Name </div>
           <div class = "!text-[var(--background)] !font-bold lg:ml-55">Status History </div>
        </div>

        <div class = "flex flex-col p-3 ">
        {#each data.interventioninfo as intervention}
            <div class = "flex flex-col xl:flex-row">
                <div>
                    {#if intervention.service_category.name === "Social"}
                     <div class = "!bg-[var(--green)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > SOCIAL </div>
                    {:else if intervention.service_category.name === "Livelihood"}
                     <div class = "!bg-[var(--border)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > LIVELIHOOD </div>
                    {:else if intervention.service_category.name === "Health"}
                     <div class = "!bg-[var(--error-color)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > HEALTH </div>
                    {:else if intervention.service_category.name === "Education"}
                     <div class = "!bg-[var(--pink)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > EDUCATION </div>
                    {/if}
                </div>

                <div class = "ml-16 mt-5">
                   {intervention.intervention}
                </div>
                <div class =  "collapse lg:ml-40">
                    <input type="checkbox" />
                    <div class = "collapse-title flex flex-row">
                        {#if intervention.status === "Regressed"}
                        <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                        {:else if intervention.status === "Neutral"}
                        <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Neutral </div>
                        {:else} 
                        <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Improved </div>
                        {/if}
                        <div class = "ml-10 mt-2"> {intervention.date_created.split('T')[0]}</div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each intervention.history as status}
                        <div class= "flex flex-row mb-5">
                            {#if status.status === "Regressed"}
                            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                            {:else if status.status === "Neutral"}
                            <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Neutral </div>
                            {:else} 
                            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Improved </div>
                            {/if}
                        <div class = "ml-10 mt-2"> {status.date_checked}</div>
                        </div>
                        {/each}
                    </div>
                </div>

            </div>
        {/each}
        </div>
    </div>
    {:else}
        Child does not have any interventions
    {/if}
</div>

<!--END OF INTERVENTIONS-->
