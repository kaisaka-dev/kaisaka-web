<script lang="ts">
    import type { caregiver } from '$lib/types/caregiver.ts'
    import type { family } from '$lib/types/family.ts'
    import type { membershipFee } from '$lib/types/membershipFee.ts'
    import type { EventType } from '$lib/types/event.ts'

    import Header from '$components/Header.svelte'
    import InputText from '$components/input/InputText.svelte'
    import Select from '$components/input/Select.svelte';

    export let data
    let editing = false
    let disabled = !editing;         // for the input component (restricts from editing if true)
    let required = editing;        // false since this is view, but placing it here for easier copy pasting to the EDIT counterpart of this module

    

    //below are sample data declarations just to test if the page works, will delete when relevant APIs are complete
    let sampleFamily1: family = {
        members: [{firstName: "Juan", lastName: "De La Cruz", role: "Grandparent"},
                  {firstName: "Sample2", lastName: "Name1", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"}
                ]
    }

    let sampleFamily2: family = {
         members: [{firstName: "Sample25", lastName: "Name112", role: "Parent"},
                  {firstName: "Sample2123", lastName: "Name2311", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"}
                ]
    }

    let sampleFamily3: family = {
         members: [{firstName: "Sample71", lastName: "Name692", role: "Child"},
                  {firstName: "Sample2123", lastName: "Name692", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"},
                  {firstName: "Another", lastName: "Caregiver!", role: "Parent"}
                ]
    }
    let sample: caregiver = {firstName: 'Paolo', lastName: 'Rivera', contactNo: '09171275268',
                 address:'Hacienda Royale', barangay:'Barangay 218', dateAdmission:new Date(2023,5, 16), dateTermination: new Date(2024,5,12), remarks: 'Nothing Remarkable',
                 family: [sampleFamily1, sampleFamily2, sampleFamily3],
                 paymentHistory: [{amount:200, date: new Date(2024,1,5)}, {amount:200, date: new Date(2023, 4,10)}]
            }

    let events: EventType[] = [
        {id: 1231, name: "Training event", type: "Training", date: new Date(2022,2,12).toISOString().split('T')[0]},
        {id: 12345, name: "Workshop event", type: "Workshop", date: new Date(2023,5, 16).toISOString().split('T')[0]}
    ]

    let today = new Date()



    //below are essential functions for the page to work
    function familyName(family:object): string {
        let lastnames: string[] = []

        for(const mem of family){
            lastnames.push(mem.members.last_name)
        }

        let familyname = [...new Set(lastnames)]
        return Array.from(familyname).join(', ')
    }

    function paymentYears(fees:membershipFee[]): number[] {
        let years: number[] = []

        for(const payment of fees) {
            years.push(payment.date.getFullYear())
        }

        return years
    }

    let yearsCounter: number[] = []
    for(let i = sample.dateAdmission.getFullYear(); i <= today.getFullYear(); i++ ) {
        yearsCounter.push(i);
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
        {data.memberRecord.first_name} {data.memberRecord.last_name}'s Profile 
    </h1>
</section>
<!--End of Page Headers-->

<!--Container for page content-->
<div class = "flex flex row">
    <!--Container for side bar-->
    <div class = "flex flex-row ml-10 m-4 sticky top-20" id = "sidebar">
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
            <div>
                <button class="w-40 -ml-5 mt-10" onclick={() => location.href='profile/edit'}>Edit Profile</button>
            </div>
        </div>
        <div class = "!bg-[var(--green)] w-[4px] h-[275px] rounded-full ml-5"></div>
    </div>

    <!--Container for profile information-->
    <div>
        <!--Container for the personal information portion of the profile-->
        <div id ="Personal Info" class = "w-240 min-w-240">
            <h1 class = "!text-[var(--green)] font-[JSans]">
                 Information
            </h1>

            <div class = "!flex !flex-row border-[var(--border)] border-4">
                <div class = "flex flex-col my-4">
                    <!-- the disabled and required are variables for easier copy pasting from VIEW to EDIT of the page-->
                    <InputText  {disabled} {required} label="First Name" id="first-name" value={data.memberRecord.first_name} />
                    <InputText  {disabled} {required} label="Last Name" id="last-name" value={data.memberRecord.last_name} />
                    <InputText  {disabled} label="Birthday" id="birthday" value={data.memberRecord.contact_number} />
                    <Select     {disabled} {required} label="Sex" id="sex" value={data.memberRecord.sex} />
                    <InputText  {disabled} {required} label="Contact No." id="contact-no" value={data.memberRecord.contact_number} />
                    <InputText  {disabled} label="Facebook Link" id="fb-link" value={data.member.facebook_link}/>
                    <InputText  {disabled} label="Email" id="email" value={data.member.email}/>
                    <InputText  {disabled} {required} label="Address" id="address" value={data.memberRecord.addresses?.address ?? 'N/A'} />
                    <InputText  {disabled} {required} label="Barangay" id="barangay" value={data.barangay.name ?? 'N/A'} />
                    <InputText  {disabled} {required} label="Occupation" id="occupation" value="TEST-VALUE" />
                    <Select     {disabled} {required} label="Community Group" id="community-group" value="TEST-VALUE" />
                    <Select     {disabled} {required} label="Income Generation" id="income-generation" value="TEST-VALUE" />

                    <br>
                    <InputText {disabled} label="Date of Admission" type="date" id="admission" value={new Date(data.memberRecord.admission_date).toISOString().split('T')[0]} />
                    {#if sample.dateTermination || editing}
                        <InputText {disabled} label="Date of Termination" type="date" id="termination"
                                   value={sample.dateTermination ? new Date(sample.dateTermination).toISOString().split('T')[0] : ''} />
                    {/if}
                </div>
            </div>
        </div>

        <!--Container for the families of the caregiver-->
        <div class = "mt-10">
            <div id = "Family Info">
                <h1 class = "!text-[var(--green)] font-[JSans]"> Families </h1>
                <div class = "grid grid-cols-2 gap-5 mt-2" >
                {#each data.family as family}
                    <div class = "flex flex-col min-w-100 w-105">
                       <span class = "!bg-[var(--green)] p-2 w-105 min-w-105 !text-white">  {familyName(family)} </span>
                       <div class = "border-4 border-[var(--border)]">
                        {#each family as member}
                            <div class = "information"> 
                                {#if member.is_child == false}
                                <div class ="!bg-[var(--pink)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                                {:else}
                                <div class ="!bg-[var(--green)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {member.relationship_type}</div>
                                {/if}
                                <div class = "mt-2 ml-10"> {member.members.first_name} {member.members.last_name}</div>
                            </div>
                        {/each}
                        </div>

                        <div class = "flex flex-col border-4 border-[var(--border)]">
                            {#each yearsCounter as year}
                                <div class = "flex flex-row">
                                 <div class = "ml-5"> {year} </div>
                                {#if paymentYears(sample.paymentHistory).includes(year)}
                                <div class = "ml-14 mb-5">  P{sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].amount} paid on {sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].date.toISOString().split('T')[0]}  </div>
                                {:else}
                                <div class = "!text-red-500 mb-5 ml-35"> Payment Pending!</div>
                                {/if}
                                </div>
                            {/each}
                        </div>
                    </div>        
                {/each}
                </div>
            </div>
        </div>

        <!--Container for Attendance Information-->
        <div class = "mt-10" id = "Event Info">
            <h1 class = "!text-[var(--green)] mb-2"> Training and Attendance </h1>
            <div class = "!bg-[var(--green)] p-3 w-255 min-w-255">
               <span class = "!text-white mr-105" >Training Name </span> 
               <span class = "!text-white mr-34" >Training Type </span>
               <span class = "!text-white" >Date Attended </span>  
            </div>
            <div class = "flex flex-col border-[var(--border)] border-4">
                {#each events as event}
                    <div class = "flex flex-row mb-5">
                        <div class = "ml-2 mt-1.5 w-50"> {event.name}</div>
                        {#if event.type === "Workshop"}
                        <div class = "ml-75 w-50 !bg-[var(--pink)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>
                        {:else if event.type === "Training"}
                        <div class = "ml-75 w-50 !bg-[var(--text-color)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>
                        {:else if event.type === "FGD"}
                        <div class = "ml-75 w-50 !bg-[var(--error-color)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>
                        {:else}
                        <div class = "ml-75 w-50 !bg-[var(--green)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>
                        {/if}
                        <div class = "ml-25 mt-1.5"> {event.date} </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>