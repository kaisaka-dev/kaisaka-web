<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    import Header from '$components/Header.svelte'
    import { goto } from '$app/navigation'

    export let data;
    import PersonalInformation from './components/personalInformation.svelte'
    import FamilyInformation from './components/familyInformation.svelte'
    import EducationInformation from './components/educationInformation.svelte'
    import DocumentationInformation from './components/documentationInformation.svelte'
    import InterventionInformation from './components/interventionInformation.svelte'


    import type { educationInformation, personalInformation } from './+page.server.js'
    import type { documentationInformation } from './+page.server.js'
    import type { interventionInformation } from './+page.server.js'

    
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

    let interventionList: interventionInformation[] = []

    for(let i in data.interventioninfo){
        interventionList.push({
            names: data.interventioninfo[i].intervention,
            category: data.interventioninfo[i].service_category.name,
            creationDate: data.interventioninfo[i].date_created,
            statuses: data.interventioninfo[i].history,
            overallStatus: data.interventioninfo[i].status
        })
    }

    console.log(interventionList)

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
    if(data.social_participation.length > 0){
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

<!--BEGINNING OF DOCUMENTS LISTING-->
<DocumentationInformation data = {documentationData} editing = {false} socialParticipation = {data.social_participation} showSocialParticipation = {showSocialParticipation} />
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<InterventionInformation data = {interventionList}/>
<!--END OF INTERVENTIONS-->

<!-- CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION -->
<FamilyInformation family = {data.family} firstName = {data.child?.firstName}/>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION


<--CONTAINER FOR EDUCATION HISTORY-->
<EducationInformation editing = {false} displayEducHistory = {educationData} schoolYearArray = {data.child?.schoolYearArray} educLevel = {educLevel} educStatus = {educStatus} educType = {educType} 
 bind:yearStart = {yearStart} bind:yearEnd = {yearEnd} bind:selectedIndex = {selectedIndex}/>  
<!--END OF EDUCATION HISTORY -->
