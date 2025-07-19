<script lang="ts">
    import Header from '$components/Header.svelte'
    import Input from '$components/input/InputText.svelte'
    import TextArea from '$components/input/InputTextarea.svelte'
    import Check from '$components/input/Checkbox.svelte'
    import Select from '$components/input/Select.svelte'


    export let data;
    //below are functions needed for the page
    let selected

    console.log(data.interventioninfo[0].history)
</script>


<Header/>

<section>
    <h1>
       {data.child?.firstName ?? "First Name Missing!"} {data.child?.lastName ?? "Last Name Missing!"}'s Profile 
    </h1>
</section>
<div class = "flex flex-row ml-10 m-4 sticky top-20">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#top">Information </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">Documents </a>
        </div>
        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>
        <div>
            <button class="w-40 -ml-5 mt-10" onclick={() => location.href='profile/edit/' + data.member.id}>Edit Profile</button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5"></div>
</div>

<!-- PERSONAL INFORMATION SECTION BELOW-->
 <div class = "ml-22 -mt-70" id ="Personal Info">
    <h1 class = "!text-[var(--green)] font-[JSans] ml-33 mt-5 mb-2">
        Information
    </h1>
</div>
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000 w-225 min-w-225" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div class = "mt-4"> <Input disabled value = {data.child?.firstName ?? "N/A"}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "mt-4"> <Input  disabled value = {data.child?.lastName || "N/A"}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div class = "mr-50 mt-3"> <Input disabled value = {data.child?.birthday || "N/A"} label = ""/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div class = "mt-4"> <Input disabled value = "test"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div class = "mt-3"> <Input disabled value = {data.child?.sex || "N/A"}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div class = "mt-3"> <Input disabled value = {data.child?.address || "N/A"}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div class = "mt-3"> <Input disabled value = {data.child?.barangay || "N/A"}/> </div>
            </div>

            {#if data.child?.canWork || false}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div class = "mt-7"> <Input value = {data.child.employmentType || "N/A"} disabled /> </div>
            </div>
            {/if}


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div class = "mt-4"> <Input value = {data.child?.disabilityCategory || "N/A"} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div class = "mt-4"> <Input value = {data.child?.disabilityNature || "N/A"} disabled/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div class = "mt-3"> <Input disabled label = "" value = {data.child?.admissionDate || "N/A"}/> </div>
            </div>
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-45"> <TextArea disabled value = {data.child?.remarks || "N/A"} label = "Remarks" rows = 10/> </div>
        </div>
    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->


<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div id ="Family Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Family
        </h1>
    </div>
</div>
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-170 min-w-150">
        {#if data.family?.length > 0}
        {#each data.family as fammember}
        <div class = "flex flex-row mb-5">
            {#if fammember?.is_child == false}
            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > {fammember.relationship_type} </div>
            {:else if fammember?.is_child == true}
                {#if fammember.members.first_name === data.child.firstName}
                <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
                {:else}
                <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Sibling </div>
                {/if}
            {/if}
            <div class = "!font-[JSans] mt-2"> {fammember.members.first_name} {fammember.members.last_name}</div>
        </div>
        {/each}
        {:else}
            <div> Child is not part of any family </div>
        {/if}
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->


<!--CONTAINER FOR EDUCATION HISTORY-->
<div id ="Family Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 -mb-5">
        Education History
        </h1>
    </div>
</div>
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-170 min-w-150">
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
</div>
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250 min-w-250">
    <div class = "flex flex-col !font-bold"> 
       <div>
            <Check label = "PWD ID" checked = {data.child?.pwd?.has} disabled/>
       </div>
       {#if data.child?.pwd?.has} 
       <div class = "w-150">
            <Input type = "text" disabled label = "ID #" value = {data.child?.pwd.id} />
       </div>
       <div class = "w-150">
            <Input type = "text" disabled  label = "Expiry Date" value = {data.child.pwd.expiry}/>
       </div>
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
    <div class = "flex flex-col !font-bold ml-10">
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

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-275" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold ml-65">Intervention Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">Status History </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
        {#each data.interventioninfo as intervention}
            <div class = "flex flex-row">
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

                <div class = "ml-16 mt-5 w-150">
                   {intervention.intervention}
                </div>
                <div class =  "collapse">
                    <input type="checkbox" />
                    <div class = "collapse-title flex flex-row">
                        {#if intervention.status === "regressed"}
                        <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                        {:else if intervention.status === "neutral"}
                        <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Neutral </div>
                        {:else} 
                        <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Improved </div>
                        {/if}
                        <div class = "ml-10 mt-2"> {intervention.date_created.split('T')[0]}</div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each intervention.history as status}
                        <div class= "flex flex-row mb-5">
                            {#if status.status === "regressed"}
                            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > Regressed </div> 
                            {:else if status.status === "neutral"}
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
</div>

<!--END OF INTERVENTIONS-->
