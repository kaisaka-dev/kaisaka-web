

<script lang="ts">
    import { goto } from '$app/navigation';

    import Header from '$components/Header.svelte'

    import HistoryCommunityGroup from './components/HistoryCommunityGroup.svelte';
    import HistoryIncomeType from './components/HistoryIncomeType.svelte';
    import PersonalInfo from './components/PersonalInfo.svelte';
    import FamilyInformation from './components/familyInformation.svelte';

    export let data
    let editing = false

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
                <button class="w-40 -ml-5 mt-10" onclick={() => goto(`profile/edit?id=${data.caregiver.id}`)}>Edit Profile</button>
            </div>

            
        </div>
        <div class = "!bg-[var(--green)] w-[4px] h-[275px] rounded-full ml-5"></div>
    </div>

    <!--Container for profile information-->
    <div>
        <!--Container for the personal information porrtion of the profile-->
        <PersonalInfo id="Personal Info" {editing} data={data.caregiver} />

        <!--Container for the families of the caregiver-->
        <FamilyInformation family = {data.caregiver.family} {editing}/>

        <!--Container for Community Group -->
        <HistoryCommunityGroup id="Community Group" data={data.caregiver.community_history} error ={""} editing = {editing} />

        <!--Container for Income Type-->
        <HistoryIncomeType id="Income Type" data={data.caregiver.income_history} error = {""}  editing = {editing} />
    </div>
</div>