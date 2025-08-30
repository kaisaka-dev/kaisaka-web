<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    import Header from '$components/Header.svelte'

    import HistoryCommunityGroup from '../components/HistoryCommunityGroup.svelte';
    import HistoryIncomeType from '../components/HistoryIncomeType.svelte';
    import InputText from '$components/input/InputText.svelte';
    import Select from '$components/input/Select.svelte';
    import { goto } from '$app/navigation';
    import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';

    import FamilyInformation from '$components/shared/FamilyInformation.svelte';
    import PersonalInfo from '../components/PersonalInfo.svelte';




    export let data

    let editing = true
    let loadingSave = false;


    let errors = {
        first_name: "",
        last_name: "",
        birthday: "",
        sex: "",
        contact_no: "",
        address: "",
        barangay: "",
        date_admission: "",
        date_termination: "",
        community_overall:"",
        income_overall: ""
    }

    
    

//below are essential functions for the page to work
    function validateForm(): boolean{
        let hasErrors = false

        errors.community_overall = ""
        errors.income_overall = ""
        errors.date_termination = ""

        errors.first_name = data.caregiver.first_name.trim() === "" ? "Required" : ""
        errors.last_name = data.caregiver.last_name.trim() === "" ? "Required" : ""
        errors.contact_no = data.caregiver.contact_no.trim() === "" ? "Required" : ""
        
        if(data.caregiver.birthday && data.caregiver.birthday.trim() !== "" && new Date(data.caregiver.birthday) > new Date()) {
            errors.birthday = "Birthday cannot be in the future"
        } else {
            errors.birthday = ""
        }

        errors.sex = data.caregiver.sex == null ? "Required" : ""
        errors.address = data.caregiver.address.trim() === "" ? "Required" : ""
        errors.barangay = data.caregiver.barangay.trim() === "" ? "Required" : ""


        if(new Date(data.caregiver.date_admission) > new Date() || (data.caregiver.date_termination && data.caregiver.date_termination.trim() !== "" && new Date(data.caregiver.date_admission) > new Date(data.caregiver.date_termination))){
            errors.date_admission = "Invalid Date!"
        }
         
        else {
            errors.date_admission = data.caregiver.date_admission == null || data.caregiver.date_admission.trim() === ""  ? "Required" : ""
         }


         
         if(data.caregiver.community_history.length > 0) {
            for(let i in data.caregiver.community_history) {
            if(data.caregiver.community_history[i].isDeleted == false){
                if(data.caregiver.community_history[i].community_group_id == null){
                errors.community_overall = errors.community_overall + "A Community Group has a missing name"
                }

                if(data.caregiver.community_history[i].date_joined === "" || new Date(data.caregiver.community_history[i].date_joined) > new Date(data.caregiver.community_history[i].date_left) && data.caregiver.community_history[i].date_left !== null
                    || new Date(data.caregiver.community_history[i].date_joined) > new Date()) {
                    if(errors.community_overall !== "") {
                        errors.community_overall = errors.community_overall + " and there is an invalid date!"
                    }

                    else {
                        errors.community_overall = "Invalid date!"
                    }
                }
         }
         
            }
         }
         

        if(data.caregiver.income_history.length > 0) {
            for(let i in data.caregiver.income_history) {
            if(data.caregiver.income_history[i].isDeleted == false){
                if(data.caregiver.income_history[i].income_category === ""){
                    errors.income_overall =  "An income entry is missing a category"
                }

                if(data.caregiver.income_history[i].date_start === "" || new Date(data.caregiver.income_history[i].date_start) > new Date() || ( new Date(data.caregiver.income_history[i].date_start) > new Date(data.caregiver.income_history[i].date_end) && data.caregiver.income_history[i].date_end != null )) {
                    console.log(data.caregiver.income_history[i].date_end)
                    if(errors.income_overall !== "") {
                        errors.income_overall = errors.income_overall + " and a there is an invalid date!"
                    }

                    else {
                        errors.income_overall = "Invalid date!"
                    }
                }
            }
        }
        }
        


         for (let i of Object.values(errors)) {
            if(Array.isArray(i)) {
               for(let j = 0; j < i.length; j++) {
                 if(i[j] != "") {
                    hasErrors = true
                 }
               }
            }


           else if (i !== "") {
                hasErrors= true
            }
        }
        if(hasErrors){
            goto("#top")
            return false
        }

        return true
    }

    async function editData(): Promise<void>{
        if(validateForm()) {
            loadingSave = true;
            //PERSONAL INFO UPDATES BEGIN HERE

            if(data.caregiver.date_termination == null || data.caregiver.date_termination == "") {
                const memberUpdate = await fetch('/api/members' , {
                method: "PUT",
                body: JSON.stringify({
                    id:data.memberRecord.id,
                    first_name: data.caregiver.first_name,
                    middle_name: data.caregiver.middle_name,
                    last_name: data.caregiver.last_name,
                    birthday: data.caregiver.birthday,
                    sex: data.caregiver.sex,
                    admission_date: data.caregiver.date_admission,
                    date_of_termination: null
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }             
                })
            }

            else{
                const memberUpdate = await fetch('/api/members' , {
                method: "PUT",
                body: JSON.stringify({
                    id:data.memberRecord.id,
                    first_name: data.caregiver.first_name,
                    middle_name: data.caregiver.middle_name,
                    last_name: data.caregiver.last_name,
                    birthday: data.caregiver.birthday,
                    sex: data.caregiver.sex,
                    admission_date: data.caregiver.date_admission,
                    date_of_termination: data.caregiver.date_termination
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }             
                })
            }
            
            
            const caregiverUpdate = await fetch('/api/caregivers' , {
                method: "PUT",
                body: JSON.stringify({
                    id: data.caregiver.id,
                    contact_number: data.caregiver.contact_no,
                    facebook_link: data.caregiver.fb_link,
                    email: data.caregiver.email,
                    occupation: data.caregiver.occupation
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })
            const addressUpdate = await fetch('/api/addresses' , {
                method: "PUT" ,
                body: JSON.stringify({
                    id: data.memberRecord.address_id,
                    address: data.caregiver.address
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })

            const barangayUpdate = await fetch('/api/barangays' , {
                method: "PUT" ,
                body: JSON.stringify({
                    id: data.memberRecord.barangay_id,
                    name: data.caregiver.barangay
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })
            //FAMILY INFO UPDATES BEGIN HERE
            for(let i in data.caregiver.family){
                for(let j in data.caregiver.family[i].data){
                   //DELETES INDIVIDUAL MEMBER RECORDS
                    if(data.caregiver.family[i].data[j].isDeleted){
                        console.log(data.caregiver.family[i].data[j])
                         const deleteFamilyRecord = await fetch("/api/family_members" , {
                        method: 'DELETE',
                        body: JSON.stringify({
                            family_id: data.caregiver.family[i].data[j].family_id,
                            member_id: data.caregiver.family[i].data[j].member_id
                        }),
                        headers: {'Content-Type':'application/json'}
                        })
                    }
                   
                }
            }


            //COMMUNITY GROUP UPDATES BEGIN HERE
            for(let i in data.caregiver.community_history){
                //Creating community history record
                if(data.caregiver.community_history[i].isNew == true && data.caregiver.community_history[i].isDeleted == false) {
                    const createCaregiverMembership = await fetch('/api/caregiver_groups', {
                        method: "POST",
                        body: JSON.stringify({
                            caregiver_id: data.caregiver.id,
                            community_group_id: data.caregiver.community_history[i].community_group_id,
                            date_joined: data.caregiver.community_history[i].date_joined,
                            date_left: data.caregiver.community_history[i].date_left
                        }),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                }
                //Editing exisitng record
                if(data.caregiver.community_history[i].isNew == false && data.caregiver.community_history[i].isDeleted == false) {
                    if(data.caregiver.community_history[i].date_left == ''){
                        const updateCaregiverMembership = await fetch('/api/caregiver_groups' , {
                        method: "PUT" ,
                        body: JSON.stringify({
                            id: data.caregiver.community_history[i].id,
                            community_group_id: data.caregiver.community_history[i].community_group_id,
                            date_joined: data.caregiver.community_history[i].date_joined,
                            date_left: null
                        }),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    }

                    else {
                        const updateCaregiverMembership = await fetch('/api/caregiver_groups' , {
                        method: "PUT" ,
                        body: JSON.stringify({
                            id: data.caregiver.community_history[i].id,
                            community_group_id: data.caregiver.community_history[i].community_group_id,
                            date_joined: data.caregiver.community_history[i].date_joined,
                            date_left: data.caregiver.community_history[i].date_left
                        }),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                    }
                    
                }

                //Deleting existing record
                if(data.caregiver.community_history[i].isNew == false && data.caregiver.community_history[i].isDeleted == true) {
                    const updateCaregiverMembership = await fetch('/api/caregiver_groups' , {
                        method: "DELETE" ,
                        body: JSON.stringify({
                            id: data.caregiver.community_history[i].community_group_id
                        }),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                }
            }


            //INCOME UPDATES BEGIN HERE
            for(let i in data.caregiver.income_history){
                //Creating income history record
                if(data.caregiver.income_history[i].isNew == true && data.caregiver.income_history[i].isDeleted == false){
                    const createcaregiverIncome = await fetch('/api/income_type' , {
                        method: "POST",
                        body: JSON.stringify({
                            caregiver_id: data.caregiver.id,
                            income_category: data.caregiver.income_history[i].income_category,
                            date_start: data.caregiver.income_history[i].date_start,
                            date_end: data.caregiver.income_history[i].date_end
                        }),
                        headers: {
                            "Content-Type" : "applciation/json"
                        }
                    })
                }

                //Updates existing income history record
                if(data.caregiver.income_history[i].isNew == false && data.caregiver.income_history[i].isDeleted == false){
                    if(data.caregiver.income_history[i].date_end == false){
                        const updatecaregiverIncome = await fetch('/api/income_type' , {
                        method: "PUT",
                        body: JSON.stringify({
                            id: data.caregiver.income_history[i].id,
                            income_category: data.caregiver.income_history[i].income_category,
                            date_start: data.caregiver.income_history[i].date_start,
                            date_end: null
                        }),
                        headers: {
                            "Content-Type" : "applciation/json"
                        }
                    })
                    }

                    else{
                        const updatecaregiverIncome = await fetch('/api/income_type' , {
                        method: "PUT",
                        body: JSON.stringify({
                            id: data.caregiver.income_history[i].id,
                            income_category: data.caregiver.income_history[i].income_category,
                            date_start: data.caregiver.income_history[i].date_start,
                            date_end: data.caregiver.income_history[i].date_end
                        }),
                        headers: {
                            "Content-Type" : "applciation/json"
                        }
                    })
                    }  
                }

                //Deletes existing income history record
                if(data.caregiver.income_history[i].isNew == false && data.caregiver.income_history[i].isDeleted == true){
                    const updatecaregiverIncome = await fetch('/api/income_type' , {
                        method: "DELETE",
                        body: JSON.stringify({
                            id: data.caregiver.income_history[i].id
                        }),
                        headers: {
                            "Content-Type" : "applciation/json"
                        }
                    })
                }
            }


            goto(`/dashboard/members/caregivers/profile?id=${data.caregiver.id}`);
        }
        loadingSave = false;
    }

</script>

<style>
    #sidebar {
        align-self: flex-start;
    }
</style>
<!--Page Headers-->
<Header/>
<section>
    <h1>
        {data.caregiver.first_name} {data.caregiver.last_name}'s Profile
    </h1>
</section>
<!--End of Page Headers-->

<!--Container for page content-->
<div class = "flex flex row">
    <!--Container for side bar-->
    {#if loadingSave}
        <LoadingBtn showBtn={false} />
    {/if}
    <div class = "flex flex-row ml-10 m-4 sticky top-20" id = "sidebar">
        <div class = "flex flex-col !font-[JSans]">
            <div class = "hover:!text-[var(--green)]">
                <a class = "hover:!text-[var(--green)]" href = "#Personal Information">Information </a>
            </div>
            <div class = "hover:!text-[var(--green)]">
                <a class = "hover:!text-[var(--green)]" href = "#Family Info">Family </a>
            </div>
            <div class = "hover:!text-[var(--green)]">
                <a class = "hover:!text-[var(--green)]" href = "#Community Group">Community History </a>
            </div>
            <div class = "hover:!text-[var(--green)]">
                <a class = "hover:!text-[var(--green)]" href = "#Income Type">Income Type </a>
            </div>
            <div>
                {#if loadingSave}
                    <LoadingBtn label="Save Changes" btnClass="green w-40 -ml-5 mt-10" disableCover={false} />
                {:else}
                    <button class = "green w-40 -ml-5 mt-10"  on:click={() => editData()}>
                        Save Changes
                    </button>
                {/if}
            </div>
            <div>
            <button class="w-40 -ml-5 mt-5" on:click={() => goto(`/dashboard/members/caregivers/profile?id=${data.caregiver.id}`)} >Cancel Changes</button>
            </div>
        </div>
        <div class = "!bg-[var(--green)] w-[4px] h-[450px] rounded-full ml-5"></div>
    </div>
    <!--Container for profile information-->
    <div>
        <!--Container for the personal information portion of the profile-->
        <PersonalInfo id="Personal Information" data={data.caregiver} {editing} {errors} />
        <!--Container for the families of the caregiver-->
        <FamilyInformation id="Family Info" {editing} bind:family = {data.caregiver.family} caregiverID = {data.caregiver.id} memberType="caregiver"/>

        <!--Container for Community Group -->
        <HistoryCommunityGroup id="Community Group" bind:data= {data.caregiver.community_history} bind:error = {errors.community_overall} {editing} />

        <!--Container for Income Type-->
        <HistoryIncomeType id="Income Type" bind:data={data.caregiver.income_history} bind:error = {errors.income_overall} {editing} />
    </div>
</div>