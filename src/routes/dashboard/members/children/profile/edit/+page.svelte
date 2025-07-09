<script lang="ts">
    import type { EventType } from '$lib/types/event.ts'
    import type { interventionType } from '$lib/types/intervention.ts'
    import type { child } from '$lib/types/child.ts'
    import type { membershipFee  } from '$lib/types/membershipFee.js'



    import Header from '../../../../../../components/Header.svelte'
    import Input from '../../../../../../components/input/InputText.svelte'
    import TextArea from '../../../../../../components/input/InputTextarea.svelte'
    import Check from '../../../../../../components/input/Checkbox.svelte'
    import Select from '../../../../../../components/input/Select.svelte'
    
    //below are sample data declarations for the sake of testing, will delete once APIs are created
    let user: child = {
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

        interventionHistory: [
        {id:1321123, name: "Learning Intervention" , type: "Education", 
            status: [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "IMPROVED" , date: new Date(2012,8, 25).toISOString().split('T')[0]} , {status: "REGRESSED" , date: new Date(2012,9, 25).toISOString().split('T')[0] }]
        },

        {
            id:1232132, name: "Livelihood Intervention" , type: "Livelihood", status:
            [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "REGRESSED" , date: new Date(2012,8, 25).toISOString().split('T')[0]}]
        }
        ]
    }


    const options_school = ["Home program", "Non-formal", "Special (Exclusive school, blind / deaf)", "Integrated / SPED classes", "Inclusive / General education"]
    let today = new Date();
    let yearCounter: number[] = [];
    let paymentYears: number[] = [];

    //below are essential functions for the page, will add on functionalities once APIs are created
    function setDate(date:string) {
        user.birthday = new Date(date)
    }


    function deleteEvent(name:string): void{
        user.eventAttendance = user.eventAttendance.filter((event) => event.name !== name)
    }

    function deleteIntervention(name:string): void {
        user.interventionHistory = user.interventionHistory.filter((intervention) => intervention.name !== name)
        console.log(user.interventionHistory)
    }

    for(let i = user.family.dateCreated.getFullYear(); i <= today.getFullYear(); i++) {
        yearCounter.push(i)
    }

    for(let i = 0; i < user.family.payments.length; i++) {
       paymentYears.push(user.family.payments[i].date.getFullYear())
    }
    
   
</script>

<Header/>

<form method = "GET">
<section>
    <h1>
       {user.firstName} {user.lastName}'s Profile 
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
            <a class = "hover:!text-[var(--green)]" href = "#Event Info">Attendance </a>
        </div>
        <div class = "hover:!text-[var(--green)]">
            <a class = "hover:!text-[var(--green)]" href = "#Documentation Info">Documents </a>
        </div>
        <div>
            <a class = "hover:!text-[var(--green)]" href = "#Intervention Info">Interventions </a>
        </div>
        <div>
            <button class = "green w-40 -ml-5 mt-10"  on:click={() => location.href="../profile"}>
                Save Changes </button>
        </div>

         <div>
            <button class = " w-40 -ml-5 mt-10"  on:click={() => location.href="../profile"}>
                Back </button>
        </div>
    </div> 
    <div class = "!bg-[var(--green)] w-[4px] l-[100px] rounded-full ml-5"></div>
</div>

<!-- PERSONAL INFORMATION SECTION BELOW-->
 <div class = "ml-22 -mt-95" id ="Personal Info">
    <h1 class = "!text-[var(--green)] font-[JSans] ml-33 mt-5 mb-2">
        Information
    </h1>
</div>
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div class = "mt-4"> <Input  value = {user.firstName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "mt-4"> <Input  value = {user.lastName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education </div>
                {#if user.education == null}
                <div class = "mt-3"> <Input value = "N/A"/> </div>
                {:else}
                <div class = "mr-34"> <Select value = { user.education } label = "" options = {options_school}/> </div>
                {/if}            
            </div>

            <div class = "flex flex-row">
                <div class = "ml-3 mt-3 w-40"> Education Status </div>
                <div> <select id = "educstatus" class = "!mt-6 w-81 rounded-md text-[var(--background)] mr-20"> 
                        <option selected value> Dropped out</option>
                        <option> New student</option>
                        <option> Completed </option>
                      </select>
                </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div class = "mr-55 mt-3"> <input class = "w-80 rounded-s" type = "Date" value = { user.birthday.toISOString().split("T")[0]} on:input = {e => setDate(e.target.value) }/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div class = "mt-4"> <Input value = {new Date().getFullYear() - user.birthday.getFullYear()} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div class = "-ml-60 mt-3"> <Select label = "" value = {user.sex} options = {["M","F"]}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div class = "mt-3"> <Input value = {user.address}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div class = "mt-3"> <Input value = {user.barangay}/> </div>
            </div>

            {#if today.getFullYear() - user.birthday.getFullYear() > 18}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div> <select id = "educstatus" class = "!mt-6 w-81 rounded-md text-[var(--background)] mr-20"> 
                        <option selected value> Sheltered Workshop</option>
                        <option> Self Employed</option>
                        <option> Wage Employed </option>
                      </select>
                </div>
            </div>
            {/if}


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div class ="ml-1"> <Select value = "Deaf/Hard of Hearing"
                                      options = {["Deaf/Hard of Hearing", "Intellectual Disability", "Learning Disability", "Mental Disability", "Physical Disability", "Psychosocial Disability","Speech and Language Impairment", "Visual Disability", "Cancer" , "Rare Disease (RA10747)", "Multiple Disabilities"]}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div class = "mt-4"> <Input value = {user.disabilityNature}/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div class = "mt-3"> <Input type = "date" label = "" value = {user.dateAdmission.toISOString().split('T')[0]}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Date of Termination</div>
                <div class = "mt-3"> <Input type = "date" label = "" value = "Date"/> </div>
            </div>
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-50"> <TextArea label = "Remarks" rows = 10/> </div>
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

    <div>
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Membership
        </h1>
    </div>
</div>

<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-125">
        {#each user.family.members as family}
        <div class = "flex flex-row">
            <select id = "familyrole" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                <option selected value = {family.role}> {family.role} </option>
                {#if family.role === "Parent"}
                <option value = "Child"> Child</option>
                <option value = "Grandparent"> Grandparent</option>
                <option value = "Caregiver"> Caregiver</option>

                {:else if family.role === "Child"}
                <option value = "Parent"> Parent</option>
                <option value = "Grandparent"> Grandparent</option>
                <option value = "Caregiver"> Caregiver</option>
                {:else if family.role === "Grandparent"}
                <option value = "Parent"> Parent</option>
                <option value = "Child"> Child</option>
                <option value = "Caregiver"> Caregiver</option>
                {:else}
                <option value = "Parent"> Parent</option>
                <option value = "Child"> Child</option>
                <option value = "Grandparent"> Grandparent</option>
                {/if}
            </select>
            <div class = "!font-[JSans] mt-2"> <input class = "text" value = "{family.firstName} {family.lastName}"/> </div>
        </div>
        {/each}
    </div>

    <div class = "border-[var(--border)] border-4 p-6 flex flex-col" id ="Membership Info">
            {#each yearCounter as year}
            <div class = "flex flex-row mb-5">
            <div class = 'mr-25 font-bold'> {year} </div>
            {#if paymentYears.includes(year)}
            <div class = " mb-5">  P{user.family.payments[paymentYears.indexOf(year)].amount} paid on {user.family.payments[paymentYears.indexOf(year)].date.toISOString().split('T')[0]}  </div>
            {:else}
            <div class = "!text-red-500 mb-5"> Payment Pending!</div>
            {/if}
             </div>
            {/each}
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<!--EVENT AND ATTENDANCE STARTS HERE-->
<div id ="Event Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Event and Attendance
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-250">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold !ml-10">Event Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-56">Event Type </div>
           <div class = "!text-[var(--background)] !font-bold ml-55">Date Attended </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
            {#each  user.eventAttendance  as eventVar}
 
            <div class = "flex flex-row mb-10">
                <div class = "w-75 ml-2 mt-4.5">
                   <Input label = "" value = {eventVar.name}/>
                </div>

                <div class = "ml-10 mt-1">
                   <select id = "interventiontype1" class = "!mt-4 w-45 rounded-full text-[var(--background)]" > 
                    <option selected value = "education"> {eventVar.type} </option>
                    <option value = "livelihood"> LIVELIHOOD</option>
                    <option selected value = "education"> EDUCATION </option>
                    <option value = "health"> HEALTH </option>
                    <option value = "social"> SOCIAL </option>
                    </select>
                </div>

                <div class = "ml-30 mt-5 w-50">
                   <Input type = "date" label = "" value = {eventVar.date}/>
                </div>

                <div class = "!mt-1.5">
                    <button 
                        class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                        on:click = {()=>deleteEvent(eventVar.name)}>
                        x
                    </button>
                </div>
            </div>

            {/each}
        </div>
    </div>
</div>

<!--END OF EVENT AND ATTENDANCE-->


<!--BEGINNING OF DOCUMENTS LISTING-->
<div id ="Documentation Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Documents and Verification
</h1>
<div class = "flex flex-row border-[var(--border)] border-4 ml-55 mr-10 p-6 w-238">
    <div class = "flex flex-col !font-bold"> 
       <div>
            <Check label = "PWD ID" checked/>
       </div> 
       {#if !user.PWD}
       <div class = "ml-20 mb-5">
            <span class = "mr-37">
                ID#
            </span>
            <Input/>
       </div>
       <div class = "ml-20">
            <span class = "mr-15">
                EXPIRY DATE
            </span>
            <Input/>
       </div>
       {/if}

       <div class ='mt-5'>
            <Check label = "PhilHealth" checked/>
       </div> 
    </div>


    <div class = "flex flex-col !font-bold ml-10">
        <div>
            <Check label = "Medical Certificate" checked/>
        </div>
        <div>
            <Check label = "Birth Certificate" checked/>
        </div>
         <div>
            <Check label = "Barangay Certificate" checked/>
        </div>
    </div>
</div>
<!--END OF DOCUMENTS LISTING-->

<!--INTERVENTIONS LIST BEGINS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Interventions
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-305" id ="Intervention Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold ml-65">Intervention Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-55">Status History </div>
        </div>
        {#each user.interventionHistory as interventionvar}
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
                        on:click = {()=>deleteIntervention(interventionvar.name)}>
                        x
                </button>
                </div>
            </div>
        {/each}
    </div>


<!--END OF INTERVENTIONS-->

</form>