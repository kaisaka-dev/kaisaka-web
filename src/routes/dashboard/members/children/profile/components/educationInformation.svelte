<script lang="ts">
    import Select from "$lib/components/input/Select.svelte";
    import InputText from "$lib/components/input/InputText.svelte";
    import { dropdownOptions } from '$lib/types/options.js'
	import type { educationInformation } from "../+page.server.js";

    export let selectedIndex = 0

    export let educHistory = []
    export let displayEducHistory: educationInformation[] = []
    export let schoolYearArray: string[] = []
    export let editing: boolean = true;

    export let educType = ""
    export let educLevel = ""
    export let educStatus = ""
    export let yearStart: number;
    export let yearEnd: number = null

    export let errors = ""

   function updateField(index:number){     
            educType = displayEducHistory[index].Educationtype
            educLevel = displayEducHistory[index].Educationlevel
            educStatus = displayEducHistory[index].Educationstatus
            yearStart = displayEducHistory[index].yearStart
            yearEnd = displayEducHistory[index].yearEnd
            selectedIndex = index
    }

    let educStatusOptions = []
    for(let i in dropdownOptions.education_status){
    educStatusOptions.push(dropdownOptions.education_status[i].name)
    }


    function addEducRecord(){
        displayEducHistory.push({
             Educationtype: "",
             Educationlevel: "",
             Educationstatus: "",
             yearStart: new Date().getFullYear(),
             yearEnd: null,
             isNew:true,
             isDeleted: false,
             index: educHistory.length-1
        })

        displayEducHistory = displayEducHistory

        schoolYearArray.push(String(displayEducHistory[displayEducHistory.length-1].yearStart))
        schoolYearArray = schoolYearArray

    }

    function deleteEducRecord(index:number){
        if(displayEducHistory[index].isNew == false) {
            educHistory[displayEducHistory[index].index].isDeleted = true
        } 

        displayEducHistory.splice(index,1)
        displayEducHistory = displayEducHistory

        schoolYearArray.splice(index,1)
        schoolYearArray = schoolYearArray

        if(displayEducHistory.length == 0) {
            educType = ""
            educLevel = ""
            educStatus = ""
            yearStart = null
            yearEnd = null
        }

        else{
            updateField(0)
        }

    }


</script>

<div id ="Education Info" class = "mt-10 mb-5" >
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55">
        Education History
        </h1>
</div>
    <div class = "flex flex-col md:items-left max-w-170 border-[var(--border)] border-4 ml-55 mr-10 p-6 -mt-5">
        {#if displayEducHistory.length > 0}
        <div class = "flex flex-wrap md:flex-row max-w-150"> <div> Please select a school year </div> <select class = "ml-5 w-50 z-100" value = {schoolYearArray[0]} on:change={(e)=>updateField(e.target.selectedIndex)}>
            {#each schoolYearArray as year}
            <option> {year}</option>
            {/each}
        </select>
        </div>
        <div class = "mt-3"> <Select disabled = {!editing} required = {editing} msg = {errors.educationtype} label="Education Type:" bind:value = {educType} options = {dropdownOptions.education_type} /></div>
        <div class = "mt-3"> <Select disabled = {!editing} required = {editing} msg = {errors.educationlvl} label="Education Level:" bind:value = {educLevel} options = {dropdownOptions.education_level}/></div>
        <div class = "mt-3"> <Select disabled = {!editing} required = {editing} msg = {errors.educstatus} label="Education Status:" bind:value = {educStatus} options = {dropdownOptions.education_status  }/> </div>
        <div class = "mt-3"> <InputText disabled = {!editing} required = {editing} msg = {errors.yearstart} type = "number" label="School Year Start:" bind:value = {yearStart}/> </div>
        <div class = "mt-3"> <InputText disabled = {!editing}  required = {editing} label="School Year End:" msg = {errors.yearend} bind:value = {yearEnd}/> </div>
        {:else}
        This child has no education history
        {/if}
        {#if editing}
        <div class = "flex flex-col md:flex-row">
            <div class = "max-w-150 mt-10 z-500"> <i class = "!text-[var(--green)] hover:underline" on:click = {()=>addEducRecord()}> + Add Education Record </i></div>
            {#if displayEducHistory.length > 0} <div class = "max-w-150 md:ml-20 mt-10 z-500"> <i class = "!text-[var(--error-color)] hover:underline" on:click = {()=>deleteEducRecord(selectedIndex)}> - Delete This Record </i> </div> {/if}
        </div>
        {/if}
    </div>
