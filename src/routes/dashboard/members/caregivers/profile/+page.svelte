<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


<script lang="ts">
    import type { Caregiver} from './+page.server.js';
    import type { family } from '$lib/types/family.ts'

    import Header from '$components/Header.svelte'

    import HistoryCommunityGroup from './components/HistoryCommunityGroup.svelte';
    import HistoryIncomeType from './components/HistoryIncomeType.svelte';
    import PersonalInfo from './components/PersonalInfo.svelte';

    export let data
    let editing = false

    

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
    let sample: Caregiver = {first_name: 'Paolo', last_name: 'Rivera', contact_no: '09171275268',
                 address:'Hacienda Royale', barangay:'Barangay 218', date_admission:new Date(2023,5, 16), date_termination: new Date(2024,5,12),
                 family: [sampleFamily1, sampleFamily2, sampleFamily3],

                 community_history: [{id:1, date_joined: new Date(2024,1,5).toISOString().split('T')[0], date_left: new Date(2024,1,5).toISOString().split('T')[0], name: "Parent organization"},
                     {id:2, date_joined: new Date(2024,2,5).toISOString().split('T')[0], date_left: null, name: "Others"},
                     {id:3, date_joined: new Date(2024,3,5).toISOString().split('T')[0], date_left: new Date(2024,5,5).toISOString().split('T')[0], name: "Skills training group"}],
                income_history: [{id:1, date_start: new Date(2024,1,5).toISOString().split('T')[0], date_end: new Date(2024,1,5).toISOString().split('T')[0], name: "Home-based"},
                    {id:2, date_start: new Date(2024,2,5).toISOString().split('T')[0], date_end: null, name: "Hme-based"},
                    {id:3, date_start: new Date(2024,3,5).toISOString().split('T')[0], date_end: new Date(2024,5,5).toISOString().split('T')[0], name: "Self-employed"}]

    }

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

    let yearsCounter: number[] = []
    for(let i = sample.date_admission.getFullYear(); i <= today.getFullYear(); i++ ) {
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
<div class = "flex">
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
                <a class = "hover:!text-[var(--green)]" href = "#Community Group">Community Group </a>
            </div>
            <div class = "hover:!text-[var(--green)]">
                <a class = "hover:!text-[var(--green)]" href = "#Income Type">Income Type </a>
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
        <PersonalInfo id="Personal Info" {editing} data={data.caregiver} />

        <!--Container for the families of the caregiver-->
        <div class = "mt-10">
            <div id = "Family Info" >
                <h2> Families </h2>
                <div class = "grid grid-cols-2 gap-5 mt-2 border-4 border-[var(--border)] p-4" >
                {#if data.caregiver.family.data}
                {#each data.caregiver.family.data as family}
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
                    </div>        
                {/each}
                {:else}
                    Caregiver is not part of any families
                 {/if}
                </div>
            </div>
        </div>

        <!--Container for Community Group -->
        <HistoryCommunityGroup id="Community Group" data={sample.community_history} {editing} />

        <!--Container for Income Type-->
        <HistoryIncomeType id="Income Type" data={sample.income_history} {editing} />

        <!--Container for Attendance Information-->
<!--        <div class = "mt-10" id = "Event Info">-->
<!--            <h1 class = "!text-[var(&#45;&#45;green)] mb-2"> Training and Attendance </h1>-->
<!--            <div class = "!bg-[var(&#45;&#45;green)] p-3 w-255 min-w-255">-->
<!--               <span class = "!text-white mr-105" >Training Name </span> -->
<!--               <span class = "!text-white mr-34" >Training Type </span>-->
<!--               <span class = "!text-white" >Date Attended </span>  -->
<!--            </div>-->
<!--            <div class = "flex flex-col border-[var(&#45;&#45;border)] border-4">-->
<!--                {#each events as event}-->
<!--                    <div class = "flex flex-row mb-5">-->
<!--                        <div class = "ml-2 mt-1.5 w-50"> {event.name}</div>-->
<!--                        {#if event.type === "Workshop"}-->
<!--                        <div class = "ml-75 w-50 !bg-[var(&#45;&#45;pink)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>-->
<!--                        {:else if event.type === "Training"}-->
<!--                        <div class = "ml-75 w-50 !bg-[var(&#45;&#45;text-color)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>-->
<!--                        {:else if event.type === "FGD"}-->
<!--                        <div class = "ml-75 w-50 !bg-[var(&#45;&#45;error-color)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>-->
<!--                        {:else}-->
<!--                        <div class = "ml-75 w-50 !bg-[var(&#45;&#45;green)] w-35 p-2 rounded-full text-center !font-bold !text-white"> {event.type}</div>-->
<!--                        {/if}-->
<!--                        <div class = "ml-25 mt-1.5"> {event.date} </div>-->
<!--                    </div>-->
<!--                {/each}-->
<!--            </div>-->
<!--        </div>-->
    </div>
</div>