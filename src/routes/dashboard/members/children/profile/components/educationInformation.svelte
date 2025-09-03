<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />


<script lang="ts">
    import Select from "$lib/components/input/Select.svelte";
    import InputText from "$lib/components/input/InputText.svelte";
    import { dropdownOptions } from '$lib/types/options.js'
	import type { educationInformation } from "../+page.server.js";
    import Validation from "$lib/components/text/Validation.svelte";

    export let id: string; // css id
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

<div {id} class = "mt-10 mb-5" >
        <h2>
        Education History
        </h2>
        {#if editing}
        <Validation msg = {errors.education}/>
        {/if}
</div>
    <div class = "flex flex-col md:items-left max-w-170 border-[var(--border)] border-3 mr-10 p-6 -mt-5">
        {#if displayEducHistory.length > 0}
        
        {#each displayEducHistory as educRecord,index}
        
        <div class = "flex flex-col mb-10">
            <div class = "mt-3 flex lg:flex-row flex-col"> 
                <div class = "lg:mr-27"> School Year:*  </div>
                <div class = "w-full max-w-32 lg:mr-5"> <InputText disabled = {!editing} required = {editing}  type = "number" label="" bind:value = {educRecord.yearStart}/> </div>
                <div class = "lg:mr-5"> to </div>
                <div class = "w-full max-w-32"> <InputText disabled = {!editing}  required = {editing} label=""  bind:value = {educRecord.yearEnd}/> </div>
                {#if editing}
                   <div class = "z-200 -mt-0.5"> <i class = "fa-solid fa-trash ml-2" on:click = {()=>deleteEducRecord(index)}></i> </div>
                {/if}
            </div >
            <div class = "mt-3"> <Select disabled = {!editing} required = {editing} label="Education Type:" bind:value = {educRecord.Educationtype} options = {dropdownOptions.education_type} /></div>
            <div class = "mt-3"> <Select disabled = {!editing} required = {editing}  label="Education Level:" bind:value = {educRecord.Educationlevel} options = {dropdownOptions.education_level}/></div>
            <div class = "mt-3"> <Select disabled = {!editing} required = {editing}  label="Education Status:" bind:value = {educRecord.Educationstatus} options = {dropdownOptions.education_status  }/> </div>
        </div>
        {/each}
        {:else}
        This child has no education history
        {/if}
        {#if editing}
        <div class = "flex flex-col md:flex-row"> 
            <div class = "mt-10 z-500 w-full p-3 rounded-xl !bg-[var(--pink)] !text-center"> <i class = "!text-[var(--background)] hover:underline" on:click = {()=>addEducRecord()}> + Add Education Record </i></div>
        </div>
        {/if}
    </div>

    <style>
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
    </style>