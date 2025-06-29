<script lang="ts">
    import type { EventType } from '$lib/types/event.js'
    import type { interventionType } from '$lib/types/intervention.js'


    import Header from '../../../components/Header.svelte'
    import Input from '../../../components/input/InputText.svelte'
    import TextArea from '../../../components/input/InputTextarea.svelte'
    import Check from '../../../components/input/Checkbox.svelte'
    import DateInput from '../../../components/input/InputDate.svelte'
    import Select from '../../../components/input/Select.svelte'
    export let data
    const { user } = data

    
    //below are sample data declarations for the sake of testing, will delete once APIs are created
    let events: EventType[] = [
        {id: 1231, name: "Learning event", type: "Education", date: new Date(2004,2,12).toISOString().split('T')[0]},
        {id: 12345, name: "Livelihood event", type: "Livelihood", date: new Date(2012,5, 16).toISOString().split('T')[0]}
    ]

    let interventions: interventionType[] = [
        {id:1321123, name: "Learning Intervention" , type: "Education", 
            status: [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "IMPROVED" , date: new Date(2012,8, 25).toISOString().split('T')[0]} , {status: "REGRESSED" , date: new Date(2012,9, 25).toISOString().split('T')[0] }]
        },

        {id:1232132, name: "Livelihood Intervention" , type: "Livelihood", status:
            [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "REGRESSED" , date: new Date(2012,8, 25).toISOString().split('T')[0]}]
        }
    ]

    let bindedDate = (new Date()).toJSON().slice(0, 10)


    //below are essential functions for the page, will add on functionalities once APIs are created
    function deleteEvent(name:string): void{
        events = events.filter((event) => event.name !== name)
    }

    function deleteIntervention(name:string): void {
        interventions = interventions.filter((intervention) => intervention.name !== name)
    }
    
   
</script>

<Header/>

<form method = "GET">
<section  class = "sticky top-0 z-1000">
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
            <button class = "w-40 -ml-5 mt-10"> Save Changes </button>
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
<div class = "border-[var(--border)] border-4 ml-55 mr-10 !font-bold z-2000" >
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div> <Input value = {user.firstName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "!z-900"> <Input  value = {user.lastName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education </div>
                <div> <Input value = {user.education}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education Status </div>
                <div> <select id = "educstatus" class = "!mt-6 ml-7 w-81 rounded-md text-[var(--background)] mr-20"> 
                        <option selected value> Dropped out</option>
                        <option> New student</option>
                        <option> Completed </option>
                      </select>
                </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div> <DateInput value = {user.birthday} label = ""/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div> <Input disabled value = "Age"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div> <Input type = "Drop" value = "Sex"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div> <Input value = "Address"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div> <Input value = "Barangay"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div> <select id = "educstatus" class = "!mt-6 ml-7.5 w-81 rounded-md text-[var(--background)] mr-20"> 
                        <option selected value> Sheltered Workshop</option>
                        <option> Self Employed</option>
                        <option> Wage Employed </option>
                      </select>
                </div>
            </div>


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div> <Input value = "Category"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div> <Input value = "Nature"/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div> <DateInput value = "Date"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Date of Termination</div>
                <div> <DateInput value = "Date"/> </div>
            </div>
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-8"> <TextArea label = "Remarks" rows = 10/> </div>
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
        <div class = "flex flex-row">
            <select id = "familyrole" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                <option selected value = "caregiver"> Caregiver </option>
                <option value = "child"> Child</option>
            </select>
            <div class = "!font-[JSans] mt-2"> <input class = "text" value = "Paolo Rivera"/> </div>
        </div>

        <div class = "flex flex-row">
            <select id = "familyrole1" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                <option selected value = "caregiver"> Caregiver </option>
                <option value = "child"> Child</option>
            </select>
            <div class = "!font-[JSans] mt-2"> <input class = "text" value = "Paolo Rivera"/> </div>
        </div>

        <div class = "flex flex-row">
            <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                <option selected value = "caregiver"> Caregiver </option>
                <option value = "child"> Child</option>
            </select>
            <div class = "!font-[JSans] mt-2"> <input class = "text" value = "Paolo Rivera"/> </div>
        </div>

    </div>

    <div class = "border-[var(--border)] border-4 p-6 flex flex-col" id ="Membership Info">
        <div class = "flex flex-row">
            <div class = 'mr-25 font-bold'> 2025 </div>
            <div> Payment Made on DATE</div>
        </div>

         <div class = "flex flex-row mt-5">
            <div class = 'mr-25 font-bold'> 2024 </div>
            <div class = "mr-10 w-60"> PAYMENT: {bindedDate || "PENDING"}</div>
            <input type = "Date" value = {bindedDate} on:input = {e => bindedDate = e.target.value}/>
        </div>
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
            {#each  events  as eventVar}
 
            <div class = "flex flex-row mb-10">
                <div class = "w-75 -ml-7">
                   <Input label = "" value = {eventVar.name}/>
                </div>

                <div class = "ml-20">
                   <select id = "interventiontype1" class = "!mt-4 w-45 rounded-full text-[var(--background)]" > 
                    <option selected value = "education"> {eventVar.type} </option>
                    <option value = "livelihood"> LIVELIHOOD</option>
                    <option selected value = "education"> EDUCATION </option>
                    <option value = "health"> HEALTH </option>
                    <option value = "social"> SOCIAL </option>
                    </select>
                </div>

                <div class = "ml-30 w-50">
                   <DateInput label = "" value = {eventVar.date}/>
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
       <div class = "ml-20">
            <span class = "mr-37">
                ID#
            </span>
            [ID NUMBER]
       </div>
       <div class = "ml-20">
            <span class = "mr-15">
                EXPIRY DATE
            </span>
            [EXPIRY DATE]
       </div>

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
        {#each interventions as interventionvar}
            <div class = "flex flex-row mt-5">
                <div class = "-mr-15">
                    <select id = "interventiontype1" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                    <option selected value = "social"> {interventionvar.type} </option>
                    <option value = "education"> EDUCATION </option>
                    <option value = "livelihood"> LIVELIHOOD</option>
                    <option value = "livelihood"> HEALTH</option>
                    </select>
                </div>
                <div class = "mb-10 ">
                   <Input value = {interventionvar.name}/>
                </div>
                <div class =  "collapse">
                    <input type="checkbox" />
                    <div class = "collapse-title ml-21 flex flex-row">
                        <div class = "z-1000 -mt-4">
                            <select id = "status" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                            <option selected value = "improved"> {interventionvar.status[0].status} </option>
                            <option value = "regressed"> REGRESSED</option>
                            </select>
                        </div> 
                        <input type = "Date" class = "z-1000 mt-0.5" value = {interventionvar.status[0].date}/>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each interventionvar.status.splice(1) as status}
                            <div class= "flex flex-row">
                                <div class = "mr-21"> </div>
                                <div class = "z-1000 ">
                                <select id = "status" class = "!mt-4 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "improved"> {status.status} </option>
                                <option value = "regressed"> REGRESSED</option>
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