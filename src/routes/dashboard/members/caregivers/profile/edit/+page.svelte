<script lang="ts">
    import type { caregiver } from '$lib/types/caregiver.js'
    import type { family } from '$lib/types/family.js'
    import type { membershipFee } from '$lib/types/membershipFee.js'
    import type { EventType } from '$lib/types/event.js'

    import Select from '../../../../../../components/input/Select.svelte'
    import Header from '../../../../../../components/Header.svelte'
    import Textarea from '../../../../../../components/input/InputTextarea.svelte'
    import Textinput from '../../../../../../components/input/InputText.svelte'
	import InputText from '../../../../../../components/input/InputText.svelte';
    

    //below are sample data declarations just to test if the page works, will delete when relevant APIs are complete
    let sampleFamily1: family = {
        members: [{firstName: "Juan", lastName: "De La Cruz", role: "Caregiver"},
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
                  {firstName: "Paolo", lastName: "Rivera", role: "Caregiver"},
                  {firstName: "Another", lastName: "Caregiver!", role: "Caregiver"}
                ]
    }
    let sample: caregiver = {firstName: 'Paolo', lastName: 'Rivera', contactNo: '09171275268',
                 address:'Hacienda Royale', barangay:'Barangay 218', dateAdmission:new Date(2023,5, 16), remarks: 'Nothing Remarkable',
                 family: [sampleFamily1, sampleFamily2, sampleFamily3],
                 paymentHistory: [{amount:200, date: new Date(2024,1,5)}, {amount:200, date: new Date(2023, 4,10)}]
            }

    let events: EventType[] = [
        {id: 1231, name: "Health event", type: "Health", date: new Date(2022,2,12).toISOString().split('T')[0]},
        {id: 12345, name: "Social event", type: "Social", date: new Date(2023,5, 16).toISOString().split('T')[0]}
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
    for(let i = sample.dateAdmission.getFullYear(); i <= today.getFullYear(); i++ ) {
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
        {sample.firstName} {sample.lastName}'s Profile 
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
                <div class = "flex flex-col">
                    <div class ="information">
                        <div class = "min-w-30"> First Name</div>
                        <div class = "mt-1"> <Textinput required msg = "Required" value = {sample.firstName}/></div>
                    </div>
                     <div class ="information">
                        <div class = "min-w-30"> Last Name</div>
                        <div class = "mt-1"> <Textinput required msg = "Required" value = {sample.lastName}/></div>
                    </div>
                    <div class ="information !mt-6">
                        <div class = "min-w-35"> Contact No.</div>
                        <div class = "ml-5"> <Textinput required msg = "Required" value = {sample.contactNo}/></div>
                    </div>
                    <div class ="information">
                        <div class = "min-w-40"> Facebook Link</div>
                        {#if sample.fblink == null}
                        <div> <Textinput value = "N/A"/></div>
                        {:else}
                        <div> <Textinput value = {sample.fblink}/></div>
                        {/if}
                    </div> 
                    <div class ="information">
                        <div class = "min-w-40"> Email</div>
                        {#if sample.email == null}
                        <div> <Textinput value = "N/A"/></div>
                        {:else}
                        <div> <Textinput value = {sample.email}/></div>
                        {/if}
                    </div>
                    <div class ="information !mt-10">
                        <div class = "min-w-30"> Address</div>
                        <div class = "ml-8"> <Textinput required msg = "Required" value = {sample.address}/></div>
                    </div>
                    <div class ="information">
                        <div class = "min-w-30"> Barangay</div>
                        <div class = "-mt-4 ml-7.5"> <Select value = {sample.barangay} options = {["Whatever", "Works"]} /></div>
                    </div>
                    <div class ="information !mt-10">
                        <div class = "min-w-50"> Date of Admission</div>
                        <div class = "ml-5"> <InputText type = "date" msg = "Required"  value = {sample.dateAdmission.toISOString().split('T')[0]} label = ""/></div>
                    </div>
                     {#if sample.dateTermination!=null}
                    <div class ="information">
                        <div class = "min-w-50"> Date of Termination</div>
                        <div class = "ml-5"> <InputText type = "date"  label = ""value ={sample.dateTermination.toISOString().split('T')[0]}  /></div>
                    </div>
                    {:else}
                    <div class ="information">
                        <div class = "min-w-50"> Date of Termination</div>
                        <div class = "ml-5"> <InputText type = "date" label = ""/></div>
                    </div>
                    {/if}
                    
                </div>
                <div class = "!flex !flex-col ml-20"> 
                    <div>Remarks </div>
                    {#if sample.remarks != null}
                    <div class = "-ml-10 -mt-5"> <Textarea value = {sample.remarks} rows=10 label = ""/></div>
                    {:else}
                    <div class = "-ml-10 -mt-5"> <Textarea value = "N/A" rows=10 label = ""/></div>
                    {/if}
                </div>
            </div>
        </div>

        <!--Container for the families of the caregiver-->
        <div class = "mt-10">
            <div id = "Family Info">
                <h1 class = "!text-[var(--green)] font-[JSans]"> Families </h1>
                <div class = "grid grid-cols-2 gap-5 mt-2" >
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
                                 </select>
                                {:else if member.role == "Child"}
                                <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] mr-20" > 
                                <option selected value = "child"> Child </option>
                                <option value = "caregiver"> Caregiver</option>
                                </select>
                                {/if}
                                <div class = "mt-2 ml-12 w-100"> {member.firstName} {member.lastName}</div>

                                {#if member.firstName !== sample.firstName }
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

                        <div class = "flex flex-col border-4 border-[var(--border)]">
                            {#each yearsCounter as year}
                                <div class = "flex flex-row">
                                 <div class = "ml-5"> {year} </div>
                                {#if paymentYears(sample.paymentHistory).includes(year)}
                                    <div class = "ml-10 mb-5">  P{sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].amount} paid on {sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].date.toISOString().split('T')[0]}  </div>
                                    <div class= "mt-2"> <InputText type = "date" label = "" value = {sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)].date.toISOString().split('T')[0]} on:input = {e => sample.paymentHistory[paymentYears(sample.paymentHistory).indexOf(year)] = e.target.value}  /> </div>
                                {:else}
                                    <div class = "!text-red-500 mb-5 ml-21"> Payment Pending!</div>
                                    <div class = "mb-10 mt-2">
                                        <InputText type = "date" label = "" on:input = {e => bindedDate = e.target.value}/>
                                    </div>
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
               <span class = "!text-white mr-55" >Event Name </span> 
               <span class = "!text-white mr-34" >Event Type </span>
               <span class = "!text-white" >Date Attended </span>  
            </div>
            <div class = "w-255  min-w-255 flex flex-col border-[var(--border)] border-4">
                {#each events as event}
                    <div class = "flex flex-row mb-5 mt-6">
                        <div class = "ml-2 mt-1.5 w-50"> <Textinput label = "" value = {event.name}/></div>
                        {#if event.type === "Education"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Education"> {event.type} </option>
                                <option value = "Education"> Education</option>
                                <option value = "Health"> Health</option>
                                <option value = "Social"> Social</option>
                        </select>                        
                        {:else if event.type === "Livelihood"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Livelihood"> {event.type} </option>
                                <option value = "Education"> Education</option>
                                <option value = "Health"> Health</option>
                                <option value = "Social"> Social</option>
                        </select>
                        {:else if event.type === "Health"}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Health"> {event.type} </option>
                                <option value = "Livelihood"> Livelihood</option>
                                <option value = "Education"> Education</option>
                                <option value = "Social"> Social</option>
                        </select>                          
                        {:else}
                        <select id = "familyrole2" class = "!mt-2 w-45 rounded-full text-[var(--background)] ml-30" > 
                                <option selected value = "Social"> {event.type} </option>
                                <option value = "Livelihood"> Livelihood</option>
                                <option value = "Education"> Education</option>
                                <option value = "Health"> Health</option>
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