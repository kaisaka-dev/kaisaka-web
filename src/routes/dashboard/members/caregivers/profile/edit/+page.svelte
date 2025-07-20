<script lang="ts">
    // import type { caregiver } from '$lib/types/caregiver.js'
    import type { family } from '$lib/types/family.js'
    import type { membershipFee } from '$lib/types/membershipFee.js'
    import type { EventType } from '$lib/types/event.js'

    import Select from '$components/input/Select.svelte'
    import Header from '$components/Header.svelte'
    import Textinput from '$components/input/InputText.svelte'
	import InputText from '$components/input/InputText.svelte';

    let editing = true;
    let disabled = !editing;         // for the input component (restricts from editing if true)
    let required = editing;        // false since this is view, but placing it here for easier copy pasting to the EDIT counterpart of this module
    //below are sample data declarations just to test if the page works, will delete when relevant APIs are complete
    let sampleFamily1: family = {
        members: [{firstName: "Juan", lastName: "De La Cruz", role: "Parent"},
                  {firstName: "Sample2", lastName: "Name1", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"}
                ]
    }

    let sampleFamily2: family = {
         members: [{firstName: "Sample25", lastName: "Name112", role: "Child"},
                  {firstName: "Sample2123", lastName: "Name2311", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"}
                ]
    }

    let sampleFamily3: family = {
         members: [{firstName: "Sample71", lastName: "Name692", role: "Child"},
                  {firstName: "Sample2123", lastName: "Name692", role: "Child"},
                  {firstName: "Paolo", lastName: "Rivera", role: "Grandparent"},
                  {firstName: "Another", lastName: "Caregiver!", role: "Caregiver"}
                ]
    }
    let sample = {
        first_name: "Paolo",
        last_name: "Rivera",
        birthday: "1990-06-22",
        sex: "Male",
        contact_number: "09171275268",
        facebook_link: "https://facebook.com/paolo.rivera",
        email: "paolo.rivera@example.com",
        addresses: {
            address: "123 Hacienda Royale"
        },
        barangay: {
            name: "San Isidro"
        },
        occupation: "Community Health Worker",
        community_group: "Health Volunteers",
        income_generation: "Livelihood Program",
        admission_date: new Date(2023, 5, 16), // June 16, 2023
        date_termination: null,
        remarks: "Active in community activities. Fluent in English and Tagalog.",
        payment_history: [
            {
                amount: 500,
                date: new Date(2023, 5, 20),
                year: 2023
            },
            {
                amount: 500,
                date: new Date(2024, 0, 15),
                year: 2024
            }
        ],
        family: [
            {
                id: 1,
                members: [
                    {
                        firstName: "Maria",
                        lastName: "Rivera",
                        role: "Parent"
                    },
                    {
                        firstName: "Juan",
                        lastName: "Rivera",
                        role: "Child"
                    }
                ]
            },
            {
                id: 2,
                members: [
                    {
                        firstName: "Carlos",
                        lastName: "Santos",
                        role: "Grandparent"
                    }
                ]
            }
        ]
    };


    let events: EventType[] = [
        {id: 1231, name: "Health event", type: "Training", date: new Date(2022,2,12).toISOString().split('T')[0]},
        {id: 12345, name: "Social event", type: "FGD", date: new Date(2023,5, 16).toISOString().split('T')[0]}
    ]

    let today = new Date()
    let bindedDate: Date

//below are essential functions for the page to work
function deleteEvent(name:string): void{
        events = events.filter((event) => event.name !== name)
    }

    function familyName(family:family): string {
        let lastnames: string[] = []

        for(const mem of family.members){
            lastnames.push(mem.lastName)
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
    for(let i = sample.admission_date.getFullYear(); i <= today.getFullYear(); i++ ) {
        yearsCounter.push(i);
    }

    function deleteFamily(id:number): void{
        sample.family = sample.family.filter((fam) => fam.id != id)
    }

    function deleteMember(id:number, name:string): void{
        sample.family[id].members = sample.family[id].members.filter((member) => member.firstName !== name)
    }

    function assignID(): void {
        let i = 0;
        for(let fam of sample.family) {
            fam.id = i;
            i++;
        }
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

{assignID()}
<!--Page Headers-->
<Header/>
<section>
    <h1>
        {sample.first_name} {sample.last_name}'s Profile
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
                <button class = "green w-40 -ml-5 mt-10"  on:click={() => location.href="../profile"}>
                    Save Changes </button>
            </div>
        </div>
        <div class = "!bg-[var(--green)] w-[4px] h-[275px] rounded-full ml-5"></div>
    </div>

    <form method = "GET">
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
                    <InputText  {disabled} {required} label="First Name" id="first-name" value={sample.first_name} />
                    <InputText  {disabled} {required} label="Last Name" id="last-name" value={sample.last_name} />
                    <InputText  {disabled} label="Birthday" id="birthday" value={sample.contact_number} />
                    <Select     {disabled} {required} label="Sex" id="sex" value={sample.sex} />
                    <InputText  {disabled} {required} label="Contact No." id="contact-no" value={sample.contact_number} />
                    <InputText  {disabled} label="Facebook Link" id="fb-link" value={sample.facebook_link}/>
                    <InputText  {disabled} label="Email" id="email" value={sample.email}/>
                    <InputText  {disabled} {required} label="Address" id="address" value={sample.addresses?.address ?? 'N/A'} />
                    <InputText  {disabled} {required} label="Barangay" id="barangay" value={sample.barangay.name ?? 'N/A'} />
                    <InputText  {disabled} {required} label="Occupation" id="occupation" value="TEST-VALUE" />
                    <Select     {disabled} {required} label="Community Group" id="community-group" value="TEST-VALUE" />
                    <Select     {disabled} {required} label="Income Generation" id="income-generation" value="TEST-VALUE" />

                    <br>
                    <InputText {disabled} label="Date of Admission" type="date" id="admission" value={new Date(sample.admission_date).toISOString().split('T')[0]} />
                    {#if sample.date_termination || editing}
                        <InputText {disabled} label="Date of Termination" type="date" id="termination"
                                   value={sample.date_termination ? new Date(sample.date_termination).toISOString().split('T')[0] : ''} />
                    {/if}
                </div>
            </div>
        </div>

        <!--Container for the families of the caregiver-->
        <div class = "mt-10">
            <div id = "Family Info">
                <h1 class = "!text-[var(--green)] font-[JSans]"> Families </h1>
                <div class = "grid grid-cols-2 gap-y-10 gap-x-50 mt-2" >
                {#each sample.family as family}
                    <div class = "flex flex-col min-w-150 w-150">
                        <div class =  "!bg-[var(--green)] w-150 min-w-150 flex flex-row" >
                            <div class = "!text-white w-150 mt-2.5 ml-3">  {familyName(family)} </div> 
                            <div>
                                <button  class = "!bg-[var(--green)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]" on:click = {()=>deleteFamily(family.id)}>
                                x
                                </button> 
                            </div>
                        </div>
                       <div class = "border-4 border-[var(--border)]">
                        {#each family.members as member}
                            <div class = "information"> 
                                {#if member.role == "Caregiver"}
                                <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "caregiver"> Caregiver </option>
                                <option value = "child"> Child</option>
                                <option value = "parent"> Parent</option>
                                <option value = "grandparent"> Grandparent</option>
                                </select>
                                {:else if member.role == "Child"}
                                <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "child"> Child </option>
                                <option value = "caregiver"> Caregiver</option>
                                <option value = "parent"> Parent</option>

                                <option value = "grandparent"> Grandparent</option>
                                </select>
                                {:else if member.role == "Grandparent"}
                                <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "grandparent"> Grandparent </option>
                                <option value = "caregiver"> Caregiver</option>
                                <option value = "parent"> Parent</option>
                                <option value = "child"> Child</option>
                                </select>
                                {:else if member.role == "Parent"}
                                <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "parent"> Parent </option>
                                <option value = "caregiver"> Caregiver</option>
                                <option value = "grandparent"> Grandparent</option>
                                <option value = "child"> Child</option>
                                </select>   
                                {/if}
                                <div class = "mt-2 ml-12 w-100"> {member.firstName} {member.lastName}</div>

                                {#if member.firstName !== sample.first_name }
                                <div class = "-mt-2">
                                    <button  class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"
                                            on:click = {()=>deleteMember(family.id, member.firstName)}>
                                        x
                                    </button> 
                                </div>
                                {:else}
                                    <div class = "ml-15"></div>
                                {/if}
                            </div>
                        {/each}
                        </div>
<!--                        commenting out first since we're not working on this yet-->
<!--                        <div class = "flex flex-col border-4 border-[var(&#45;&#45;border)]">-->
<!--                            {#each yearsCounter as year}-->
<!--                                <div class = "flex flex-row">-->
<!--                                 <div class = "ml-5"> {year} </div>-->
<!--                                {#if paymentYears(sample.paymentHistory).includes(year)}-->
<!--                                    <div class = "ml-10 mb-5">  P{sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].amount} paid on {sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].date.toISOString().split('T')[0]}  </div>-->
<!--                                    <div class= "mt-2"> <InputText type = "date" label = "" value = {sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].date.toISOString().split('T')[0]} on:input = {e => sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)] = e.target.value}  /> </div>-->
<!--                                {:else}-->
<!--                                    <div class = "!text-red-500 mb-5 ml-21"> Payment Pending!</div>-->
<!--                                    <div class = "mb-10 mt-2">-->
<!--                                        <InputText type = "date" label = "" on:input = {e => bindedDate = e.target.value}/>-->
<!--                                    </div>-->
<!--                                {/if}-->
<!--                                </div>-->
<!--                            {/each}-->
<!--                        </div>-->
                    </div>        
                {/each}
                </div>
            </div>
        </div>

        <!--Container for Attendance Information-->
        <div class = "mt-10" id = "Event Info">
            <h1 class = "!text-[var(--green)] mb-2"> Training and Attendance </h1>
            <div class = "!bg-[var(--green)] p-3 w-255 min-w-255">
               <span class = "!text-white mr-55" >Training Name </span> 
               <span class = "!text-white mr-34" >Training Type </span>
               <span class = "!text-white" >Date Attended </span>  
            </div>
            <div class = "w-255  min-w-255 flex flex-col border-[var(--border)] border-4">
                {#each events as event}
                    <div class = "flex flex-row mb-5 mt-6">
                        <div class = "ml-2 mt-1.5 w-50"> <Textinput label = "" value = {event.name}/></div>
                        {#if event.type === "Training"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Training"> {event.type} </option>
                                <option value = "FGD"> FGD</option>
                                <option value = "Workshop"> Workshop</option>
                                <option value = "Other"> Other</option>
                        </select>                        
                        {:else if event.type === "FGD"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "FGD"> {event.type} </option>
                                <option value = "Workshop"> Workshop</option>
                                <option value = "Training"> Training</option>
                                <option value = "Other"> Other</option>
                        </select>
                        {:else if event.type === "Workshop"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Workshop"> {event.type} </option>
                                <option value = "FGD"> FGD</option>
                                <option value = "Training"> Training</option>
                                <option value = "Other"> Other</option>
                        </select>                          
                        {:else}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Other"> {event.type} </option>
                                <option value = "Workshop"> Workshop</option>
                                <option value = "Training"> Training</option>
                                <option value = "FGD"> FGD </option>
                        </select>                           
                        {/if}
                        <div class = "ml-15 mt-2"> <InputText type = "date" label = "" value = {event.date}/> </div>
                        <div class = "-mt-1">
                            <button  class = "!bg-[var(--background)] !text-red-500 hover:!text-red-400 hover:!shadow-[var(--background)]"on:click = {()=>deleteEvent(event.name)} >
                             x
                            </button> 
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
    </form>
</div>