<script lang="ts">
    import type { child } from '$lib/types/child.js'
    
    
    import Header from '../../../../../components/Header.svelte'
    import Input from '../../../../../components/input/InputText.svelte'
    import TextArea from '../../../../../components/input/InputTextarea.svelte'
    import Check from '../../../../../components/input/Checkbox.svelte'
    import Select from '../../../../../components/input/Select.svelte'
	import InputText from '../../../../../components/input/InputText.svelte';

    //below are sample data declarations for the page to work, will delete when the relevant APIs are made
    let user: child = {
        firstName: "Juan", lastName: "De La Cruz", educationStatus: "Dropped Out", birthday: new Date(2011,2,3), sex: "M", address: "Sample Address",
        barangay: "Barangay 721", employmentStatus: "Sheltered Workshop", disabilityCategory: "Mental", disabilityNature: "Schizophrenic", dateAdmission: new Date(2012, 9,11),

        family: {id: 1, members:[{role: "Caregiver", firstName:"Paolo", lastName: "Rivera"}, {role: "Child" , firstName: "Juan" , lastName:"De La Cruz"}]},
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

        {id:1232132, name: "Livelihood Intervention" , type: "Livelihood", status:
            [{status: "REGRESSED", date:new Date(2012,5, 16).toISOString().split('T')[0] }, {status: "REGRESSED" , date: new Date(2012,8, 25).toISOString().split('T')[0]}]
        }
        ]
    }
    let today = new Date();
</script>
<Header/>

<section>
    <h1>
       {user.firstName} {user.lastName}'s Profile 
    </h1>
</section>
<div class = "flex flex-row ml-10 m-4 sticky top-20 z-1">
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
            <button class="w-40 -ml-5 mt-10" onclick={() => location.href='profile/edit'}>Edit Profile</button>
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
                <div class = "mt-4"> <Input disabled value = {user.firstName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div class = "mt-4"> <Input  disabled value = {user.lastName}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education </div>
                {#if user.education == null}
                <div class = "mt-5"> <Input value = "N/A" disabled/> </div>
                {:else}
                <div class = "mt-5"> <Input value = {user.education} disabled/> </div>
                {/if}            
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Education Status </div>
                <div class = "mt-5"> <Input value = {user.educationStatus} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div class = "mr-50"> <InputText type = "date" value = {user.birthday.toISOString().split('T')[0]} label = ""/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div class = "mt-4"> <Input disabled value = {today.getFullYear() - user.birthday.getFullYear()}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div class = "mt-3"> <Input disabled value = {user.sex}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div class = "mt-3"> <Input disabled value = {user.address}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div class = "mt-3"> <Input disabled value = {user.barangay}/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Employment Status </div>
                <div class = "mt-7"> <Input value = {user.employmentStatus} disabled /> </div>
            </div>


            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-73"> Category of Disability</div>
                <div class = "mt-4"> <Input value = {user.disabilityCategory} disabled/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-73"> Nature of Disability</div>
                <div class = "mt-4"> <Input value = {user.disabilityNature} disabled/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div class = "mt-3"> <InputText type = "date" label = "" value = {user.dateAdmission.toISOString().split('T')[0]}/> </div>
            </div>
            {#if user.dateTermination != null}
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Date of Termination</div>
                <div class = "mt-3"> <InputText type = "date" label = "" value = {user.dateTermination.toISOString().split('T')[0]}/> </div>
            </div>
            {/if}
        </div>
        
        
        <div class = "flex flex-col ml-3"> 
            <div class = "-ml-8"> <TextArea disabled value = {user.remarks} label = "Remarks" rows = 10/> </div>
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
        {#each user.family.members as fammember}
        <div class = "flex flex-row mb-5">
            {#if fammember.role == "Caregiver"}
            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Caregiver </div>
            {:else}
            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
            {/if}
            <div class = "!font-[JSans] mt-2"> {fammember.firstName} {fammember.lastName}</div>
        </div>
        {/each}
    </div>

    <div class = "border-[var(--border)] border-4 p-6 flex flex-col" id ="Membership Info">
        <div class = "flex flex-row">
            <div class = 'mr-25 font-bold'> 2025 </div>
            <div> Payment Made on DATE</div>
        </div>

         <div class = "flex flex-row mt-5">
            <div class = 'mr-25 font-bold'> 2024 </div>
            <div class = "!text-red-500 "> Payment Pending</div>
        </div>
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<!--EVENT AND ATTENDANCE STARTS HERE-->
<div id ="Event Info" class = "mb-15"></div>
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Event and Attendance
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-238">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold">Event Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-90">Event Type </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">Date Attended </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
            {#each user.eventAttendance as event}
            <div class = "flex flex-row mb-5">
                <div class = "mt-2 w-40 min-w-40">
                    {event.name}
                </div>

                <div class = "ml-73">
                    {#if event.type === "Social"}
                    <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Education"}
                    <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Health"}
                    <div class = "!bg-[var(--error-color)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>
                    {:else if event.type === "Livelihood"}
                    <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > {event.type} </div>  
                    {/if}                  
                </div>

                <div class = "ml-25 mt-2">
                    {event.date}
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
            {#if user.PWD}
            <Check label = "PWD ID" disabled checked/>
            {:else}
            <Check label = "PWD ID" disabled/>
            {/if}
       </div>
       {#if user.PWD} 
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
       {/if}

       <div class ='mt-5'>
            {#if user.PhilHealth}
            <Check label = "PhilHealth" disabled checked/>
            {:else}
            <Check label = "PhilHealth" disabled/>
            {/if}
       </div> 
    </div>


    <div class = "flex flex-col !font-bold ml-10">
        <div>
            {#if user.medCert}
            <Check label = "Medical Certificate" disabled checked/>
            {:else}
            <Check label = "Medical Certificate" disabled/>
            {/if}
        </div>
        <div>
            {#if user.birthCert}
            <Check label = "Birth Certificate" disabled checked/>
            {:else}
            <Check label = "Birth Certificate" disabled/>
            {/if}
        </div>
         <div>
            {#if user.barangayCert}
            <Check label = "Barangay Certificate" disabled checked/>
            {:else}
            <Check label = "Barangay Certificate" disabled/>
            {/if}
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
        {#each user.interventionHistory as intervention}
            <div class = "flex flex-row">
                <div>
                    {#if intervention.type === "Social"}
                     <div class = "!bg-[var(--green)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > SOCIAL </div>
                    {:else if intervention.type === "Livelihood"}
                     <div class = "!bg-[var(--border)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > LIVELIHOOD </div>
                    {:else if intervention.type === "Health"}
                     <div class = "!bg-[var(--error-color)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > HEALTH </div>
                    {:else if intervention.type === "Education"}
                     <div class = "!bg-[var(--pink)] mt-4 p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > EDUCATION </div>
                    {/if}
                </div>

                <div class = "ml-16 mt-5 w-150">
                   {intervention.name}
                </div>

                <div class =  "collapse">
                    <input type="checkbox" />
                    <div class = "collapse-title flex flex-row">
                        {#if intervention.status[0].status === "REGRESSED"}
                        <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > REGRESSED </div> 
                        {:else if intervention.status[0].status === "NEUTRAL"}
                        <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > NEUTRAL </div>
                        {:else} 
                        <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > IMPROVED </div>
                        {/if}
                        <div class = "ml-10 mt-2"> {intervention.status[0].date}</div>
                    </div>
                    <div class = "collapse-content flex flex-col">
                        {#each intervention.status.splice(1) as status}
                        <div class= "flex flex-row mb-5">
                            {#if status.status === "REGRESSED"}
                            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > REGRESSED </div> 
                            {:else if status.status === "NEUTRAL"}
                            <div class = "!bg-[var(--border)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > NEUTRAL </div>
                            {:else} 
                            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > IMPROVED </div>
                            {/if}
                        <div class = "ml-10 mt-2"> {status.date}</div>
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