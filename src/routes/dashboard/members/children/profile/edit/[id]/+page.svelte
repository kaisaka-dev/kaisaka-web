<script lang="ts">
    import type { EventType } from '$lib/types/event.ts'
    import type { interventionType } from '$lib/types/intervention.ts'
    import type { child } from '$lib/types/child.ts'
    import type { membershipFee  } from '$lib/types/membershipFee.js'
    import type { interventionStatus } from '$lib/types/interventionStatus.js'


    import Header from '../../../../../../../components/Header.svelte'
    import Input from '../../../../../../../components/input/InputText.svelte'
    import TextArea from '../../../../../../../components/input/InputTextarea.svelte'
    import Check from '../../../../../../../components/input/Checkbox.svelte'
    import Select from '../../../../../../../components/input/Select.svelte'
    import Modal from '../../../../../../../components/Modal.svelte'

    
    
   
    //below are sample data declarations for the sake of testing, will delete once APIs are created
    const {data} = $props()
    
    
    let canWork = $state(data.member.employment_status.able_to_work)

    let family = $state(data.family)
    for(let i in family){
        //properties from the original record that will be displayed
        family[i].willDelete = false //dictates which record the db needs to delete
        family[i].isNew = false //determines which records the db needs to add
    }




    let user: child = $state({
        firstName: "Juan", lastName: "De La Cruz", educationStatus: "Dropped Out", birthday: new Date(2011,2,3), sex: "M", address: "Sample Address", education: "Home program",
        barangay: "Barangay 721", employmentStatus: "Sheltered Workshop", disabilityCategory: "sampleCategory", disabilityNature: "sampleNature", dateAdmission: new Date(2012, 9,11),

        family: {id: 1, members:[{role: "Parent", firstName:"Paolo", lastName: "Rivera"}, {role: "Child" , firstName: "Juan" , lastName:"De La Cruz"},  {role: "Child" , firstName: "John" , lastName:"De La Cruz"}],
                 dateCreated: new Date(2023,9,24), payments: [{amount: 200, date: new Date(2024,3,2)}, {amount:200, date: new Date(2025,4,2)}]
                },
    
        eventAttendance:[{id: 1231, name: "Health event", type: "Health", date: new Date(2022,2,12).toISOString().split('T')[0]},
                        {id: 12345, name: "Social event", type: "Social", date: new Date(2023,5, 16).toISOString().split('T')[0]}],

        PWD: false,
        PhilHealth: true,
        medCert: true,
        birthCert: false,
        barangayCert: true,
        natID: true,
        voterID: true,

        interventionHistory: [
        {id:1321123, name: "Learning Intervention" , type: "Education", 
            status: [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "IMPROVED" , date: new Date(2012,8, 25).toISOString().split('T')[0]} , {status: "REGRESSED" , date: new Date(2012,9, 25).toISOString().split('T')[0] }]
        },

        {
            id:1232132, name: "Livelihood Intervention" , type: "Livelihood", status:
            [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "REGRESSED" , date: new Date(2012,8, 25).toISOString().split('T')[0]}]
        }
        ],

        socialSecurity: {
            access: true,
            type: "Participation in family life",
            yearAccessed:2023
        }
    })


    const options_school = ["Home Program", "Non-formal", "Integrated/SNED", "Inclusive/Gen. Ed."]
    const options_student_status = ['past_student', 'new_student','dropped_out','completed']
    
    let today = new Date();
    let yearCounter: number[] = [];
    let paymentYears: number[] = [];
    let openModal = $state(false);
    let statuses: interventionStatus[] = $state([{status: '',date:''}])
    let interventionName: string = $state("")
    let type: string = $state("")
    let interventionError = $state(false)
    let style = $state("")
    let text = $state("")


    //below are essential functions for the page, will add on functionalities once APIs are created
    
    function deletefamilyMember(index:number): void{
        family[index].willDelete = true
    }

    function addfamilyMember(): void {
        family = [
            ...family,
            {
                members: {
                    first_name:"",
                    last_name:"",
                },
                willDelete: false,
                isNew: true,
                is_child: "",
                relationship_type: ""
            }
        ]

        console.log(family)
    }

    function deleteEvent(name:string): void{
        user.eventAttendance = user.eventAttendance.filter((event) => event.name !== name)
    }

    function deleteIntervention(index:number): void {
        user.interventionHistory.splice(index,1)
    }

    for(let i = user.family.dateCreated.getFullYear(); i <= today.getFullYear(); i++) {
        yearCounter.push(i)
    }

    for(let i = 0; i < user.family.payments.length; i++) {
       paymentYears.push(user.family.payments[i].date.getFullYear())
    }
    
    
    function addStatus(): void{
        statuses = [
            ...statuses,
            {
                status: "",
                date: ""
            }
        ]


    }

    function deleteStatus(index:number): void {
        statuses.splice(index,1);
    }
   
   function addIntervention() {

    interventionError = false
    for(let i=0; i< statuses.length; i++) {
        if(statuses[i].date == "" || statuses[i].status == "") {            
            interventionError = true
        }
    }

    if(interventionName === "" || type === "") {
        interventionError = true
    }

    if(interventionError) {
        style = "ml-127 !text-red-500"
            text = "Missing Information!"
    }

    else {

        style = "ml-127 !text-[var(--green)]"
        text = "Intervention added!"
        user.interventionHistory = [
        ...user.interventionHistory,
        {
            id:213213,
            name: interventionName,
            type: type,
            status: statuses
        }
    ]

    statuses = [{status:"", date:""}]
    interventionName = ""
    type = ""
    }
    
}
</script>

<Header/>

<section>
    <h1>
       {data.member.first_name} {data.member.last_name}'s Profile 
    </h1>
</section>
<div class = "flex flex-row ml-10 m-4 sticky top-20 w-50">
    <div class = "flex flex-col !font-[JSans]">
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Personal Info">Information </a>
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
            <button class = "green w-40 -ml-5 mt-10" on:click = {() => location.href="../"}  >
                Save Changes </button>
        </div>

         <div>
            <button class = " w-40 -ml-5 mt-10"  on:click={() => location.href="../"}>
                Back </button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5"></div>
</div>

<!-- PERSONAL INFORMATION SECTION BELOW-->
 <div class = "ml-22 -mt-95" id ="Personal Info">
    <h1 class = "!text-[var(--green)] font-[JSans] ml-33 mt-10 mb-2">
        Information
    </h1>
</div>
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div class = "mt-4"> <Input  bind:value = {data.member.first_name}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "mt-4"> <Input  value = {data.member.last_name}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education </div>
                <div class = "ml-1"> <Select value = { data.childRecord.education_status[0].education_type } label = "" options = {options_school}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Student Status </div>
                <div class = "ml-1"> <Select value = { data.childRecord.education_status[0].student_status_type } label = "" options = {options_student_status}/> </div>
            </div>


            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div class = "mr-55 mt-3"> <Input type = "date" bind:value = {data.member.birthday} /> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div class = "mt-4"> <Input value = {new Date().getFullYear() - new Date(data.member.birthday).getFullYear()} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div class = "ml-1"> <Select value = {data.member.sex} options = {["Male", "Female"]}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div class = "mt-3"> <Input value = {data.member.addresses.address}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div class = "mt-3"> <Input value = {data.barangay.name}/> </div>
            </div>


            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Able to Work</div>
                <div class = "mt-5 -ml-8"> <Check bind:checked = {canWork} label = ""/> </div>
            </div>


            {#if canWork == true}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div class = "ml-1"> <Select value = {data.member.employment_status.employment_type} options = {["Self-Employed", "Wage-Employed","Sheltered Workshop"]}/> </div>
            </div>
            {/if}


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div class ="ml-1"> <Select value = {data.childRecord.disability_category.name}
                                      options = {["Deaf/Hard of Hearing", "Intellectual Disability", "Learning Disability", "Mental Disability", "Physical Disability", "Psychosocial Disability","Speech and Language Impairment", "Visual Disability", "Cancer" , "Rare Disease (RA10747)", "Multiple Disabilities"]}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div class = "mt-4 -ml-12.5"> <Input value = {data.childRecord.disability_nature}/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div class = "mt-3 -ml-10"> <Input type = "date" label = "" value = {data.member.admission_date}/> </div>
            </div>
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-50"> <TextArea label = "Remarks" rows = 10 value = {data.childRecord.remarks}/> </div>
        </div>
    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->

<!--CONTAINER FOR FAMILY AND MEMBERSHIP LABELS-->
<div id ="Family Info" class = "mb-15"></div>
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Family
        </h1>
    </div>
</div>

<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250 min-w-200">
         <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold !ml-10">Child? </div>
           <div class = "!text-[var(--background)] !font-bold ml-56">Relationship </div>
           <div class = "!text-[var(--background)] !font-bold ml-55">Name </div>
        </div>

        {#each family as family,index}
        {#if !family.willDelete}
        <div class = "flex flex-row">        
            {#if family.is_child == true}
            <div class = "!font-[JSans] mt-2 w-50"> <Select value = "TRUE" options = {["TRUE", "FALSE"]}/> </div>
            {:else}
            <div class = "!font-[JSans] mt-2 w-50"> <Select value = "FALSE" options = {["TRUE", "FALSE"]}/> </div>
            {/if}
            <div class = "!font-[JSans] mt-5 ml-20"> <input class = "text" value = "{family.relationship_type}"/> </div>
            <div class = "!font-[JSans] mt-5 ml-30"> <input class = "text" value = "{family.first_name} {family.members.last_name}"/> </div>
            <div class = "!mt-2">
                    <button 
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deletefamilyMember(index)}>
                        x
                    </button>
            </div>
        </div>
        {/if}
        {/each}
        <button on:click = {()=>addfamilyMember()} class="w-70 mt-10"> Add Family Member</button>
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250">
    <div class = "flex flex-col !font-bold"> 
       <div>
            <Check label = "PWD ID" bind:checked = {user.PWD}/>
       </div>
       {#if user.PWD} 
       <div class = "w-150">
            <Input type = "text" label = "ID #"/>
       </div>
       <div class = "w-150">
            <Input type = "text" label = "Expiry Date"/>
       </div>
       {/if}

       <div>
            <Check label = "Social Security" bind:checked = {user.socialSecurity.access}/>
       </div>
       {#if user.socialSecurity.access} 
       <div class = "w-150">
            <Select label = "Type of Access" value = {user.socialSecurity.type} options = {["Participation in family life", "Participation in community life/clubs"]}/>
       </div>
       <div class = "w-150">
            <Input type = "text" label = "Year Accessed" value = {user.socialSecurity.yearAccessed}/>
       </div>
       {/if}


       <div class = "mt-5">
            <Check label = "PhilHealth" bind:checked = {user.PhilHealth} />
       </div>

       <div class = "mt-5">
            <Check label = "National ID" bind:checked = {user.natID} />
       </div>
    </div>
    <div class = "flex flex-col !font-bold ml-10">
        <div>
            <Check label = "Medical Certificate" bind:checked = {user.medCert} />
       </div>
        <div>
            <Check label = "Birth Certificate" bind:checked = {user.birthCert} />
       </div>
        <div>
            <Check label = "Barangay Certificate" bind:checked = {user.barangayCert} />
       </div>
        <div>
            <Check label = "Voter ID" bind:checked = {user.voterID} />
       </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-4 w-305" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold ml-65 mt-2">Intervention Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-55 mt-2">Status History </div>
           <div class = "ml-25">
           <Modal buttonText="Add Intervention" width="50%" isOpen={openModal}>
            <div slot="modal">
            <h2>Add New Intervention</h2>
            <Input label="Intervention Name" id="newName" required bind:value ={interventionName}/>
            <Select required label = "Intervention Type" options = {["Education","Social","Health","Livelihood"]} bind:value = {type}/>
            <div class = "flex flex-row">
                <Select label = "Status #1" options = {["Improved", "Neutral", "Regressed"]} bind:value= {statuses[0].status}/>
                <div class = "ml-5"> <Input type = "Date" bind:value = {statuses[0].date}/>  </div>
            </div>
            {#each statuses.slice(1) as status,index}
            <div class = "flex flex-row">
                <Select label = "Status #{statuses.indexOf(status)+1}" options = {["Improved", "Neutral", "Regressed"]} bind:value= {statuses[index+1].status}/>
                <div class = "ml-5"> <Input type = "Date" bind:value = {statuses[index+1].date}/>  </div>
                <div class = "-mt-3">
                <button
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deleteStatus(index+1)}>
                        x
                </button>
                </div>
            </div>
            {/each}
            <button on:click = {()=>addStatus()} class="ml-5"> Add Status</button>
            <div class = "mt-5 ml-125"><button class = "green" on:click = {()=>addIntervention()}> Add Intervention </button></div>
            <div class = "{style}"> {text}</div>
            </div>
            </Modal>
            </div>
        </div>
        {#each user.interventionHistory as interventionvar,index}
            <div class = "flex flex-row mt-5">
                <div class = "-mr-15">
                    <select id = "interventiontype1" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                    <option selected value = "social"> {interventionvar.type} </option>
                    <option value = "education"> EDUCATION </option>
                    <option value = "livelihood"> LIVELIHOOD</option>
                    <option value = "livelihood"> HEALTH</option>
                    </select>
                </div>
                <div class = "mb-10 mt-4 ml-10">
                   <Input value = {interventionvar.name}/>
                </div>
                <div class =  "collapse">
                <input type = "checkbox" />
                    <div class = "collapse-title ml-21 flex flex-row">
                        <div class = "-mt-4">
                            <select id = "status" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                            <option selected value = "improved"> {interventionvar.status[0].status} </option>
                            <option value = "regressed"> Regressed </option>
                            </select>
                        </div> 
                        <input type = "Date" class = "z-1000 mt-0.5" value = {interventionvar.status[0].date}/>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each interventionvar.status.slice(1) as status}
                            <div class= "flex flex-row">
                                <div class = "mr-21"> </div>
                                <div class = "z-1000 ">
                                <select id = "status" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "improved"> {status.status} </option>
                                <option value = "regressed"> Regressed</option>
                                </select>
                                </div> 
                                <input type = "Date" class = "mt-3 z-1000" value = {status.date}/>
                            </div>
                        {/each}
                    </div>
                </div>
                <div class = "mt-2">
                <button
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deleteIntervention(index)}>
                        x
                </button>
                </div>
            </div>
        {/each}
    </div>
</div>


<!--END OF INTERVENTIONS-->

