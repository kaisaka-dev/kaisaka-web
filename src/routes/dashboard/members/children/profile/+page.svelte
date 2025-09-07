<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    import Header from '$components/Header.svelte'
    import { goto } from '$app/navigation'


    export let data;
    import PersonalInformation from './components/personalInformation.svelte'
    import FamilyInformation from '$components/shared/FamilyInformation.svelte'
    import EducationInformation from './components/educationInformation.svelte'
    import DocumentationInformation from './components/documentationInformation.svelte'
    import InterventionInformation from './components/interventionInformation.svelte'


    import type { educationInformation, personalInformation } from './+page.server.js'
    import type { documentationInformation } from './+page.server.js'
    import type { interventionInformation } from './+page.server.js'

    import Select from '$lib/components/input/Select.svelte';
    import InputTextarea from '$lib/components/input/InputTextarea.svelte'
    
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

    let healthIntervention : interventionInformation = {
        names: "",
        category: "Health",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let educationIntervention: interventionInformation  = {
        names: "",
        category: "Education",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let socialIntervention: interventionInformation  = {
        names: "",
        category: "Social",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    let livelihoodIntervention: interventionInformation  = {
        names: "",
        category: "Livelihood",
        creationDate: "",
        overallStatus: "",
        statuses: [],

        isNew: true,
        isDeleted: false
    }

    
    
    for(let i = 0; i < data.interventioninfo?.length; i++){
        if(data.interventioninfo[i].service_category.name === "Health"){
           healthIntervention.creationDate = data.interventioninfo[i].date_created.split('T')[0]
           healthIntervention.names = data.interventioninfo[i].intervention
           healthIntervention.id = data.interventioninfo[i].id
           healthIntervention.overallStatus = data.interventioninfo[i].status
           healthIntervention.isNew = false

          healthIntervention.statuses = data.interventioninfo[i].history
          for(let j in healthIntervention.statuses){
            healthIntervention.statuses[j].isNew = false;
            healthIntervention.statuses[j].isDeleted = false
          }

        }

        else if(data.interventioninfo[i].service_category.name === "Education"){
           educationIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           educationIntervention.names = data.interventioninfo[i].intervention
           educationIntervention.id = data.interventioninfo[i].id
           educationIntervention.overallStatus = data.interventioninfo[i].status
           educationIntervention.isNew = false

           educationIntervention.statuses = data.interventioninfo[i].history
           for(let j in educationIntervention.statuses){
            educationIntervention.statuses[j].isNew = false;
            educationIntervention.statuses[j].isDeleted = false
          }
        }

        else if(data.interventioninfo[i].service_category.name === "Livelihood"){
           livelihoodIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           livelihoodIntervention.names = data.interventioninfo[i].intervention
           livelihoodIntervention.id = data.interventioninfo[i].id
           livelihoodIntervention.overallStatustatus = data.interventioninfo[i].status
           livelihoodIntervention.isNew = false

           livelihoodIntervention.statuses = data.interventioninfo[i].history
           for(let j in livelihoodIntervention.statuses){
            livelihoodIntervention.statuses[j].isNew = false;
            livelihoodIntervention.statuses[j].isDeleted = false
          }

        }

        else if(data.interventioninfo[i].service_category.name === "Social"){
           socialIntervention.creationDate = data.interventioninfo[i].date_created.split("T")[0]
           socialIntervention.names = data.interventioninfo[i].intervention
           socialIntervention.id = data.interventioninfo[i].id
           socialIntervention.overallStatus = data.interventioninfo[i].status
           socialIntervention.isNew = false

           socialIntervention.statuses = data.interventioninfo[i].history
           for(let j in socialIntervention.statuses){
            socialIntervention.statuses[j].isNew = false;
            socialIntervention.statuses[j].isDeleted = false
          }
        }
    }

    interventionList.push(healthIntervention, educationIntervention, socialIntervention, livelihoodIntervention)



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
            <a class = "hover:!text-[var(--green)]" href = "#top">Basic Info </a>
        </div>

        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">IDs, Certs, Docs </a>
        </div>

        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>

        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#healthInfo">Health </a>
        </div>

        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Education Info">Education </a>
        </div>
        <div>
            <button class="w-40 -ml-5 mt-10" on:click={() => goto(`/dashboard/members/children/profile/edit?id=${data.child.id}`)}>Edit Profile</button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-2"></div>
</div>

<div class="ml-55 -mt-70">
    <!-- PERSONAL INFORMATION SECTION BELOW-->
     <PersonalInformation id="Personal Info" data = {childData} disabled = {true} discatOptions = {data.discatOptions}/>
    <!-- PERSONAL INFORMATION SECTION END-->

    <!--BEGINNING OF DOCUMENTS LISTING-->
    <DocumentationInformation id="Documentation Info" data = {documentationData} editing = {false} socialParticipation = {data.social_participation} showSocialParticipation = {showSocialParticipation} />
    <!--END OF DOCUMENTS LISTING-->

    <!--INTERVENTIONS LIST BEGINS HERE-->
    <InterventionInformation id = "Intervention Info" data = {interventionList} editing = {false}/>
    <!--END OF INTERVENTIONS-->

    <!-- CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION -->
    <FamilyInformation id="Family Info" family={data.family} editing = {false} firstName={data.child?.firstName} childID={data.child?.id} memberType="child"/>
    <!--END OF FAMILY AND MEMBERSHIP INFORMATION -->

    <!-- CONTAINER FOR HEALTH INFORMATION -->
    <div class = "mt-10" id ="healthInfo">
        <h2> Health Information </h2>
        <div class = "border-3 border-[var(--border)] w-full max-w-165 p-6">
            <Select label = "Disability Category" bind:value = {data.child.disabilityCategoryID} options = {data.discatOptions} disabled margin = {true}/>
            <InputTextarea label = "Disability Nature"  disabled bind:value = {data.child.disabilityNature} margin = {true}/>
        </div>
    </div>
    <!--END OF HEALTH INFORMATION-->
    

    <!--CONTAINER FOR EDUCATION HISTORY-->
    <EducationInformation id="Education Info" editing = {false} displayEducHistory = {educationData} schoolYearArray = {data.child?.schoolYearArray} educLevel = {educLevel} educStatus = {educStatus} educType = {educType}
     bind:yearStart = {yearStart} bind:yearEnd = {yearEnd} bind:selectedIndex = {selectedIndex}/>
    <!--END OF EDUCATION HISTORY -->
</div>