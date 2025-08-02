<script lang="ts">
    import Header from '$components/Header.svelte'
    import { goto } from '$app/navigation'

    export let data;
    import PersonalInformation from './components/personalInformation.svelte'
    import FamilyInformation from './components/familyInformation.svelte'
    import EducationInformation from './components/educationInformation.svelte'
    import DocumentationInformation from './components/documentationInformation.svelte'


    import type { educationInformation, personalInformation } from './+page.server.js'
    import type { documentationInformation } from './+page.server.js'

    //below are functions needed for the page
    let selectedIndex = 0

    let childData: personalInformation = {
         firstName: data.child?.firstName || "--",
         middleName: data.child?.middleName || "--",
         lastName: data.child?.lastName || "--",
         birthday: data.child?.birthday || "--",
         sex: data.child?.sex || "--",
         address: data.child?.address || "--",
         barangay: data.child?.barangay || "--",
         canWork: data.child?.canWork || false,
         employmentType: data.child?.employmentType || "--",
         disabilityCategoryID: data.child?.disabilityCategoryID || "--",
         disabilityNature: data.child?.disabilityNature || "--",
         admissionDate:  data.child?.admissionDate || "--",
         remarks: data.child?.remarks || "--",
    }   

    let documentationData: documentationInformation = {
        hasPWD: data.child?.pwd?.has,
        pwdID: data.child?.pwd?.id,
        pwdExpiry: data.child?.pwd?.expiry,

        phHealth: data.child?.philHealth,
        natID: data.child?.national_id,
        medCert: data.child?.med_cert,
        barangayCert: data.child?.barangay_cert,
        birthCert: data.child?.birth_cert,
        voterID: data.child?.voter_id
    }

    let educationData: educationInformation[] = []
    let yearStart: string;
    let yearEnd: string;
    let educType: string;
    let educStatus: string;
    let educLevel: string;

    if(data.child?.educationHistory.length > 0) {
        for(let i in data.child?.educationHistory) {
            educationData.push({
            Educationtype: data.child.educationHistory[i].education_type,
            Educationlevel: data.child.educationHistory[i].grade_level,
            Educationstatus: data.child.educationHistory[i].student_status_type,
            yearStart: data.child?.educationHistory[i].year_start,
            yearEnd: data.child?.educationHistory[i].year_end,
            isDeleted: false,
            isNew: false
        })
        }

     educType  = data.child?.educationHistory[0].education_type ?? ""
     educStatus = data.child?.educationHistory[0].student_status_type ?? ""
     educLevel = data.child?.educationHistory[0]?.grade_level ?? ""
     yearStart  = data.child?.educationHistory[0]?.year_start ?? ""
     yearEnd = data.child?.educationHistory[0]?.year_end ?? ""
    }

    let showSocialParticipation: boolean = false
    if(data.social_participation.length>0){
        showSocialParticipation = true
    }
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
 <PersonalInformation data = {childData} disabled = {true} discatOptions = {data.discatOptions}/>
<!-- PERSONAL INFORMATION SECTION END-->


<!-- CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION -->
<FamilyInformation family = {data.family} firstName = {data.child?.firstName}/>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION


<--CONTAINER FOR EDUCATION HISTORY-->
{console.log(data.child?.educationHistory)}
<EducationInformation editing = {false} displayEducHistory = {educationData} schoolYearArray = {data.child?.schoolYearArray} educLevel = {educLevel} educStatus = {educStatus} educType = {educType} 
 bind:yearStart = {yearStart} bind:yearEnd = {yearEnd} bind:selectedIndex = {selectedIndex}/>  
<!--END OF EDUCATION HISTORY -->

<!--BEGINNING OF DOCUMENTS LISTING-->
<DocumentationInformation data = {documentationData} editing = {false} socialParticipation = {data.social_participation} showSocialParticipation = {showSocialParticipation} />
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