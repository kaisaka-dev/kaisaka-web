<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
        import InputText from "$lib/components/input/InputText.svelte";
        import TextArea from '$lib/components/input/InputTextarea.svelte'
        import Select from '$lib/components/input/Select.svelte'
        import Validation from "$lib/components/text/Validation.svelte";
        import type { interventionInformation } from "../+page.server.js";

        export let data: interventionInformation[];
        export let editing = true;
        export let id: string;      // css id
        export let errors;

        

        let showEduc:boolean, showSocial:boolean, showHealth:boolean, showLivelihood: boolean = false;

        let statusOptions = ['Regressed' , 'Improved', 'Neutral']

        function showhealthIntervention(){
            showHealth = true;
            showEduc = false;
            showLivelihood = false;
            showSocial = false;
        }

        function showeducIntervention(){
            showEduc = true;
            showHealth = false;
            showLivelihood = false;
            showSocial = false
        }

        function showlivelihoodIntervention(){
            showLivelihood = true;
            showEduc = false;
            showHealth = false;
            showSocial = false;
        }

        function showsocialIntervention(){
            showSocial = true;
            showLivelihood = false;
            showHealth = false;
            showEduc = false;
        }

        function deleteStatus(index:number, interventionIndex: number){
            data[interventionIndex].statuses[index].isDeleted = true
        }

        function addStatus(index:number){
            data[index].statuses.push({
                status: "Neutral",
                date_checked: "",
                intervention_id: data[index].id,
                
                isNew:true,
                isDeleted:false

            })  

            data[index].statuses = data[index].statuses
        }


</script>

<h2 {id} class="mt-10" >
        Interventions
        {#if editing}
        <Validation msg = {errors.interventionOverall} />
        {/if}
</h2>

<div class = "flex flex-col max-w-255 border-3 border-[var(--border)]  mr-10 p-4">
    {#if data.length > 0}
    <div class = "flex flex-col w-full mx-auto max-w-250">
        <div class = "flex flex-col lg:flex-row md:ml-5 z-100">
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]" on:click = {()=>showhealthIntervention()}>Health </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showsocialIntervention()}>Social </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showlivelihoodIntervention()}>Livelihood </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showeducIntervention()}>Education </button>
        </div>

        {#if showHealth == true}

        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Health </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {!editing} label = "" rows = 4 bind:value = {data[0].names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Health </span> Improvement History </div>
            <div class = "flex flex-col">
                 
                <div class = "flex flex-row mt-2">
                    {#if editing}
                    <div class = "ml-5 w-30 mt-0.5"> <Select required options = {statusOptions} bind:value = {data[0].overallStatus}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {data[0].creationDate} disabled = {!editing}> </InputText></div>
                    {:else}
                        {#if data[0].overallStatus === "Improved"}
                            <div class = "flex flex-row mt-2">
                            <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[0].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[0].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                         {:else if data[0].overallStatus === "Regressed"}
                            <div class = "flex flex-row mt-2">
                             <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[0].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[0].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                        {:else if data[0].overallStatus === "Neutral"}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {data[0].overallStatus} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[0].creationDate.split('T')[0]} disabled> </InputText></div>
                        </div>

                        {/if}
                    {/if}
                </div>
                {#each data[0].statuses as status,index}
                {#if editing}
                    {#if !status.isDeleted}
                    <div class = "flex flex-row mt-2">
                    <div class = "ml-5 w-30">   <Select required bind:value = {status.status} options = {statusOptions}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {status.date_checked} disabled = {!editing}> </InputText></div>
                    <div class = "z-200 -mt-0.5"> <i class = "fa-solid fa-trash ml-2 mt-2" on:click = {()=>deleteStatus(index, 0)}></i> </div>
                    </div>
                    {/if}
                {:else}
                    {#if status.status === "Improved"}
                    <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {status.status} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                    </div>

                    {:else if status.status === "Regressed"}
                        <div class = "flex flex-row mt-2">
                        <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {:else}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {/if}
                {/if}
                {/each}                    
            </div>

            {#if editing}
                <div>
                        <div class = " w-full mt-9 p-3 rounded-md !bg-[var(--pink)] !text-center"> <i class = "!text-[var(--background)] hover:underline !z-200 hover:cursor-pointer" on:click = {()=>addStatus(0)}> + Add Time Period </i></div>
                </div>
                {/if}
        </div>
        {/if}

        {#if showEduc == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Education </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {!editing} label = "" rows = 4 bind:value = {data[1].names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Education </span> Improvement History </div>
            <div class = "flex flex-col">
                 
                <div class = "flex flex-row mt-2">
                    {#if editing}
                    <div class = "ml-5 w-30 mt-0.5"> <Select required options = {statusOptions} bind:value = {data[1].overallStatus}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {data[1].creationDate} disabled = {!editing}> </InputText></div>
                    {:else}
                        {#if data[1].overallStatus === "Improved"}
                            <div class = "flex flex-row mt-2">
                            <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[1].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[1].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                         {:else if data[1].overallStatus === "Regressed"}
                            <div class = "flex flex-row mt-2">
                             <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[1].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[1].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                        {:else if data[1].overallStatus === "Neutral"}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {data[1].overallStatus} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[1].creationDate.split('T')[0]} disabled> </InputText></div>
                        </div>

                        {/if}
                    {/if}
                </div>
                {#each data[1].statuses as status,index}
                {#if editing}
                    {#if !status.isDeleted}
                    <div class = "flex flex-row mt-2">
                    <div class = "ml-5 w-30">   <Select required bind:value = {status.status} options = {statusOptions}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {status.date_checked} disabled = {!editing}> </InputText></div>
                    <div class = "z-200 -mt-0.5"> <i class = "fa-solid fa-trash ml-2 mt-2" on:click = {()=>deleteStatus(index, 1)}></i> </div>
                    </div>
                    {/if}
                {:else}
                    {#if status.status === "Improved"}
                    <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {status.status} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                    </div>

                    {:else if status.status === "Regressed"}
                        <div class = "flex flex-row mt-2">
                        <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {:else}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {/if}
                {/if}
                {/each}                    
            </div>

            {#if editing}
                <div>
                        <div class = " w-full mt-9 p-3 rounded-md !bg-[var(--pink)] !text-center"> <i class = "!text-[var(--background)] hover:underline !z-200 hover:cursor-pointer" on:click = {()=>addStatus(1)}> + Add Time Period </i></div>
                </div>
                {/if}
        </div>
        {/if}

        {console.log(data[2])}
        {#if showSocial == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Social </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {!editing} label = "" rows = 4 bind:value = {data[2].names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Social </span> Improvement History </div>
            <div class = "flex flex-col">
                 
                <div class = "flex flex-row mt-2">
                    {#if editing}
                    <div class = "ml-5 w-30 mt-0.5"> <Select required options = {statusOptions} bind:value = {data[2].overallStatus}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {data[2].creationDate} disabled = {!editing}> </InputText></div>
                    {:else}
                        {#if data[2].overallStatus === "Improved"}
                            <div class = "flex flex-row mt-2">
                            <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[2].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[2].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                         {:else if data[2].overallStatus === "Regressed"}
                            <div class = "flex flex-row mt-2">
                             <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[2].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[2].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                        {:else if data[2].overallStatus === "Neutral"}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {data[2].overallStatus} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[2].creationDate.split('T')[0]} disabled> </InputText></div>
                        </div>

                        {/if}
                    {/if}
                </div>
                {#each data[2].statuses as status,index}
                {#if editing}
                    {#if !status.isDeleted}
                    <div class = "flex flex-row mt-2">
                    <div class = "ml-5 w-30">   <Select required bind:value = {status.status} options = {statusOptions}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {status.date_checked} disabled = {!editing}> </InputText></div>
                    <div class = "z-200 -mt-0.5"> <i class = "fa-solid fa-trash ml-2 mt-2" on:click = {()=>deleteStatus(index, 0)}></i> </div>
                    </div>
                    {/if}
                {:else}
                    {#if status.status === "Improved"}
                    <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {status.status} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                    </div>

                    {:else if status.status === "Regressed"}
                        <div class = "flex flex-row mt-2">
                        <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {:else}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {/if}
                {/if}
                {/each}                    
            </div>

            {#if editing}
                <div>
                        <div class = " w-full mt-9 p-3 rounded-md !bg-[var(--pink)] !text-center"> <i class = "!text-[var(--background)] hover:underline !z-200 hover:cursor-pointer" on:click = {()=>addStatus(0)}> + Add Time Period </i></div>
                </div>
                {/if}
        </div>
        {/if}

        {#if showLivelihood == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Livelihood </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {!editing} label = "" rows = 4 bind:value = {data[3].names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Livelihood </span> Improvement History </div>
            <div class = "flex flex-col">
                 
                <div class = "flex flex-row mt-2">
                    {#if editing}
                    <div class = "ml-5 w-30 mt-0.5"> <Select required options = {statusOptions} bind:value = {data[3].overallStatus}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {data[3].creationDate} disabled = {!editing}> </InputText></div>
                    {:else}
                        {#if data[3].overallStatus === "Improved"}
                            <div class = "flex flex-row mt-2">
                            <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[3].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[3].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                         {:else if data[3].overallStatus === "Regressed"}
                            <div class = "flex flex-row mt-2">
                             <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                            <div class = "ml-5 w-30"> {data[3].overallStatus} </div>
                            <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[3].creationDate.split('T')[0]} disabled> </InputText></div>
                            </div>

                        {:else if data[3].overallStatus === "Neutral"}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {data[3].overallStatus} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {data[3].creationDate.split('T')[0]} disabled> </InputText></div>
                        </div>

                        {/if}
                    {/if}
                </div>
                {#each data[3].statuses as status,index}
                {#if editing}
                    {#if !status.isDeleted}
                    <div class = "flex flex-row mt-2">
                    <div class = "ml-5 w-30">   <Select required bind:value = {status.status} options = {statusOptions}/> </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" bind:value = {status.date_checked} disabled = {!editing}> </InputText></div>
                    <div class = "z-200 -mt-0.5"> <i class = "fa-solid fa-trash ml-2 mt-2" on:click = {()=>deleteStatus(index, 0)}></i> </div>
                    </div>
                    {/if}
                {:else}
                    {#if status.status === "Improved"}
                    <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {status.status} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                    </div>

                    {:else if status.status === "Regressed"}
                        <div class = "flex flex-row mt-2">
                        <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {:else}
                        <div class = "flex flex-row mt-2">
                        <i class="fa-solid fa-circle-minus mt-1.5"></i>
                        <div class = "ml-5 w-30"> {status.status} </div>
                        <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {status.date_checked.split('T')[0]} disabled> </InputText></div>
                        </div>
                    {/if}
                {/if}
                {/each}                    
            </div>

            {#if editing}
                <div>
                        <div class = " w-full mt-9 p-3 rounded-md !bg-[var(--pink)] !text-center"> <i class = "!text-[var(--background)] hover:underline !z-200 hover:cursor-pointer" on:click = {()=>addStatus(0)}> + Add Time Period </i></div>
                </div>
                {/if}
        </div>
        {/if}
    </div>
    {:else}
        Child does not have any interventions
    {/if}
</div>

<style>
    #improved {
        color: var(--green)
    }

    #regressed {
        color: var(--error-color)
    }
   
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
    
</style>