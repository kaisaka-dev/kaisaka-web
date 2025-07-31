<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    import Header from '$components/Header.svelte'

    import HistoryCommunityGroup from '../components/HistoryCommunityGroup.svelte';
    import HistoryIncomeType from '../components/HistoryIncomeType.svelte';
    import InputText from '$components/input/InputText.svelte';
    import Select from '$components/input/Select.svelte';
    import { goto } from '$app/navigation';
    import Validation from '$lib/components/text/Validation.svelte';




    export let data
    let editing = true

    let first_name: string = data.caregiver.first_name;
    let middle_name: string = data.caregiver.middle_name;
    let last_name: string = data.caregiver.last_name;
    let birthday: string = data.caregiver?.birthday;
    let age = ""
    let sex: string = data.caregiver?.sex;
    let contact_no: string = data.caregiver?.contact_no;
    let fb_link: string = data.caregiver?.fb_link;
    let email: string = data.caregiver?.email;
    let address: string = data.caregiver?.address;
    let barangay: string = data.caregiver?.barangay;
    let occupation: string = data.caregiver?.occupation ?? "";
    let date_admission: string = data.caregiver?.date_admission;
    let date_termination: string = data.caregiver?.date_termination;

    let errors = {
        first_name: "",
        last_name: "",
        birthday: "",
        sex: "",
        contact_no: "",
        address: "",
        barangay: "",
        occupation: "",
        date_admission: "",
        family_errors: [],
        community_overall:"",
        income_overall: ""
    }

    let families = data.caregiver.family
    for(let i in families) {
        for(let j in families[i].data) {
            families[i].data[j]["isDeleted"] = false
            if(families[i].data[j].is_child){
                families[i].data[j]['membershipStatus'] = "Beneficiary"
            }
            else{
                families[i].data[j]['membershipStatus'] = "Member"
            }
        }
    }

    for(let i in families) {
        errors.family_errors.push("")
    }



    $: if (birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();

        const hasHadBirthdayThisYear =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
        calculatedAge -= 1;
        }

        age = calculatedAge.toString();
    } else {
        age = "";
    }
    
    

//below are essential functions for the page to work
    function validateForm(): boolean{
        let hasErrors = false
        for(let i in errors.family_errors){
            errors.family_errors[i] = ""
        }
        errors.community_overall = ""
        errors.income_overall = ""

        errors.first_name = first_name.trim() === "" ? "Required" : ""
        errors.last_name = last_name.trim() === "" ? "Required" : ""
        
        if(new Date(birthday).getFullYear() > new Date().getFullYear()) {
            errors.birthday = "Birthday cannot be in the future"
        }

        else{
            errors.birthday = birthday.trim() === "" ? "Required" : ""
        }

        errors.sex = sex == null ? "Required" : ""
        errors.address = address.trim() === "" ? "Required" : ""
        errors.barangay = barangay.trim() === "" ? "Required" : ""
        errors.occupation = occupation.trim() === "" ? "Required" : ""

        if(new Date(date_admission) > new Date()){
            errors.date_admission = "Date cannot be in the future"
        }
         
        else {
            errors.date_admission = date_admission.trim() === "" ? "Required" : ""
         }

         for(let i in families){
            for(let j in families[i].data) {
                if(families[i].data[j].members.first_name === "" || families[i].data[j].members.last_name === "" || families[i].data[j].members.relationship_type === "" ) {
                    errors.family_errors[i] = "Missing Information!"
                }
            }
         }

         if(data.caregiver.community_history.length > 0) {
            for(let i in data.caregiver.community_history) {
            if(data.caregiver.community_history[i].isDeleted == false){
                if(data.caregiver.community_history[i].name === ""){
                errors.community_overall = errors.community_overall + "A Community Group has a missing name"
                }

                if(data.caregiver.community_history[i].date_joined === "" || new Date(data.caregiver.community_history[i].date_joined) > new Date(data.caregiver.community_history[i].date_left) && data.caregiver.community_history[i].date_left !== null) {
                    if(errors.community_overall !== "") {
                        errors.community_overall = errors.community_overall + " and a there is an invalid date!"
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

                if(data.caregiver.income_history[i].date_start === "" || new Date(data.caregiver.income_history[i].date_start) > new Date(data.caregiver.income_history[i].date_end) && data.caregiver.income_history[i].date_end !== null) {
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
            console.log(data.caregiver.community_history)
            //PERSONAL INFO UPDATES BEGIN HERE
            const memberUpdate = await fetch('/api/members' , {
                method: "PUT",
                body: JSON.stringify({
                    id:data.memberRecord.id,
                    first_name: first_name,
                    middle_name: middle_name,
                    last_name: last_name,
                    birthday: birthday,
                    sex: sex,
                    admission_date: date_admission
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }             
                })
            const caregiverUpdate = await fetch('/api/caregivers' , {
                method: "PUT",
                body: JSON.stringify({
                    id: data.caregiver.id,
                    contact_number: contact_no,
                    facebook_link: fb_link,
                    email: email,
                    occupation: occupation
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })
            const addressUpdate = await fetch('/api/addresses' , {
                method: "PUT" ,
                body: JSON.stringify({
                    id: data.memberRecord.address_id,
                    address: address
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })

            const barangayUpdate = await fetch('/api/barangays' , {
                method: "PUT" ,
                body: JSON.stringify({
                    id: data.memberRecord.barangay_id,
                    name: barangay
                }),
                headers:{
                        'Content-Type': 'application/json'
                        }    
            })
            //FAMILY INFO UPDATES BEGIN HERE
            for(let i in families){
                for(let j in families[i].data){
                    const memberUpdate = await fetch('/api/members' , {
                        method: "PUT",
                        body: JSON.stringify({
                            id: families[i].data[j].members.id,
                            first_name: families[i].data[j].members.first_name,
                            last_name: families[i].data[j].members.last_name
                        }),
                        
                        headers: {
                            'Content-Type' : 'application/json'
                        }
                    })

                    let ischildValue: boolean
                    if(families[i].data[j].membershipStatus === "Beneficiary"){
                        ischildValue = true
                    }

                    else{
                        ischildValue = false
                    }

                   

                    const familymemberUpdate = await fetch('/api/family_members', {
                        method: 'PUT', 
                        body: JSON.stringify({
                            family_id: families[i].data[j].family_id,
                            member_id: families[i].data[j].members.id,
                            relationship_type: families[i].data[j].relationship_type,
                            is_child: ischildValue
                        }),
                        headers: {
                            'Content-Type' : 'application/json'
                        }
                    })

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
                            community_group_id: data.caregiver.community_history[i].name,
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
                    const updateCaregiverMembership = await fetch('/api/caregiver_groups' , {
                        method: "PUT" ,
                        body: JSON.stringify({
                            id: data.caregiver.community_history[i].id,
                            community_group_id: data.caregiver.community_history[i].name,
                            date_joined: data.caregiver.community_history[i].date_joined,
                            date_left: data.caregiver.community_history[i].date_left
                        }),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    })
                }

                //Deleting existing record
                if(data.caregiver.community_history[i].isNew == false && data.caregiver.community_history[i].isDeleted == true) {
                    const updateCaregiverMembership = await fetch('/api/caregiver_groups' , {
                        method: "DELETE" ,
                        body: JSON.stringify({
                            id: data.caregiver.community_history[i].id
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
    }

    function familyName(family:object): string {
        let lastnames: string[] = []

        for(const mem of family){
            lastnames.push(mem.members.last_name)
        }

        let familyname = [...new Set(lastnames)]
        return Array.from(familyname).join(', ')
    }
</script>

<style>
    .information{
        display: flex;
        flex-direction: row;
        margin-top: 15px;
        margin-left:10px;
    }

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
                <button class = "green w-40 -ml-5 mt-10"  on:click={() => editData()}>
                    Save Changes 
                </button>
            </div>
        </div>
        <div class = "!bg-[var(--green)] w-[4px] h-[275px] rounded-full ml-5"></div>
    </div>

    <form method = "GET">
    <!--Container for profile information-->
    <div>
        <!--Container for the personal information portion of the profile-->
        <div id="Personal Information" class = "w-240 min-w-240">
	    <h2> Information	</h2>
	    <div class = "border-[var(--border)] border-4 py-4">
		<InputText   required msg = {errors.first_name} label="First Name" id="first-name" bind:value = {first_name} />
        <InputText   label="Middle Name" id="middle-name" value={data?.caregiver.middle_name} />
		<InputText   required msg = {errors.last_name} label="Last Name" id="last-name" bind:value = {last_name} />
		<InputText   required msg = {errors.birthday} type = "date" label="Birthday" id="birthday" bind:value = {birthday} />
		<InputText   label="Age" id="age" disabled bind:value = {age} />
        <Select      required msg = {errors.sex} label="Sex" id="sex" bind:value = {sex} options = {['Male' , 'Female' , 'Other']}/>
		<InputText   required msg = {errors.contact_no} label="Contact No." id="contact-no" bind:value = {contact_no} />
		<InputText   label="Facebook Link" id="fb-link" bind:value = {fb_link}/>
		<InputText   label="Email" id="email" bind:value = {email}/>
		<InputText   required msg = {errors.address} label="Address" id="address" bind:value={address} />
		<InputText   required msg = {errors.barangay} label="Barangay" id="barangay" bind:value = {barangay} />
		<InputText   required msg = {errors.occupation} label="Occupation" id="occupation" bind:value = {occupation} />

		<br>
		<InputText required msg = {errors.date_admission} label="Date of Admission" type="date" id="admission" bind:value = {date_admission} />
		{#if data.caregiver.date_termination || editing}
			<InputText  label="Date of Termination" type="date" id="termination"
								 value={data.caregiver.date_termination ? new Date(data.date_termination).toISOString().split('T')[0] : ''} />
		{/if}
	</div>
</div>

        <!--Container for the families of the caregiver-->
        <div class = "mt-10">
            <div id = "Family Info">
                <h2> Families </h2>
                <div class = "grid grid-cols-2 gap-y-10 gap-x-120 mt-2" >
                {#each families as family,index}
                    <div class = "flex flex-col min-w-150 w-220">
                        <div class =  "!bg-[var(--green)] w-220 min-w-150 flex flex-row" >
                            <div class = " w-300 mt-2.5 ml-3 flex flex-col">    
                                <div class = "!text-white"> {familyName(family.data)}</div>
                                <div><Validation msg = {errors.family_errors[index]} /></div>
                            </div>
                        </div>
                       <div class = "border-4 border-[var(--border)]">
                            <div class = "!bg-[var(--green)] p-3 flex flex-row mb-10">
                            <div class = "!text-[var(--background)] !font-bold ">Membership Status </div>
                            <div class = "!text-[var(--background)] !font-bold ml-10">Relationship </div>
                            <div class = "!text-[var(--background)] !font-bold ml-20">Last Name </div>
                            <div class = "!text-[var(--background)] !font-bold ml-25">First Name </div>
                        </div>
                        {#each family.data as member}
                            <div class = "information"> 
                                <div class = "w-45"> <Select required bind:value = {member.membershipStatus} options = {['Beneficiary' , 'Member']}/> </div>
                                <div class = "w-45 ml-5"> <InputText required bind:value = {member.relationship_type}/> </div>
                                <div class = "w-45 ml-5"> <InputText required bind:value = {member.members.last_name}/> </div>
                                <div class = "w-45 ml-5"> <InputText required bind:value = {member.members.first_name}/> </div>
                                <div>
                                <button  class = "!bg-[var(--background)] -mt-20 !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]">
                                x
                                </button> 
                            </div>
                            </div>
                        {/each}
                        </div>
                    </div>        
                {/each}
                </div>
            </div>
        </div>

        <!--Container for Community Group -->
        <HistoryCommunityGroup id="Community Group" bind:data= {data.caregiver.community_history} bind:error = {errors.community_overall} {editing} />

        <!--Container for Income Type-->
        <HistoryIncomeType id="Income Type" bind:data={data.caregiver.income_history} bind:error = {errors.income_overall} {editing} />
    </div>
    </form>
</div>