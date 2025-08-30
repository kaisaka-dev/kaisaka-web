<script lang="ts">
        import InputText from "$lib/components/input/InputText.svelte";
        import TextArea from '$lib/components/input/InputTextarea.svelte'
        import type { interventionInformation } from "../+page.server.js";

        export let data: interventionInformation[];
        export let id: string;      // css id

        let educIntervention:interventionInformation = {
            names: "",
            category: "",
            creationDate: "",
            overallStatus: "",
            statuses: []
        }

        let socialIntervention: interventionInformation = {
            names: "",
            category: "",
            creationDate: "",
            overallStatus: "",
            statuses: []
        }

        let healthIntervention: interventionInformation = {
            names: "",
            category: "",
            creationDate: "",
            overallStatus: "",
            statuses: []
        }

        let livelihoodIntervention: interventionInformation = {
            names: "",
            category: "",
            creationDate: "",
            overallStatus: "",
            statuses: []
        }
       

        let showEduc:boolean, showSocial:boolean, showHealth:boolean, showLivelihood: boolean = false;

        for(let i in data){
            if(data[i].category === "Health"){
                healthIntervention = data[i]
            }

            else if(data[i].category === "Education"){
                educIntervention = data[i]
            }

            else if(data[i].category === "Livelihood"){
                livelihoodIntervention = data[i]
            }

            else{
                socialIntervention = data[i]
            }
        }

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
</script>

<h2 {id} class="mt-10" >
        Interventions
</h2>

<div class = "flex flex-col max-w-255 border-3 border-[var(--border)]  mr-10 p-4">
    {#if data.length > 0}
    <div class = "flex flex-col w-full mx-auto max-w-250">
        <div class = "flex flex-col md:flex-row md:ml-5 z-100">
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]" on:click = {()=>showhealthIntervention()}>Health </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showsocialIntervention()}>Social </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showlivelihoodIntervention()}>Livelihood </button>
           <button class = "!text-[var(--green)] !font-bold !border-3 px-11 py-2 !border-[var(--border)] !bg-[var(--background)] xl:w-50  ml-5 hover:!bg-[var(--green)] hover:!text-[var(--background)] focus:!bg-[var(--green)] focus:!text-[var(--background)]"on:click = {()=>showeducIntervention()}>Education </button>
        </div>

        {#if showHealth == true}

        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Health </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {true} label = "" rows = 4 value = {healthIntervention.names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Health </span> Improvement History </div>
            <div class = "flex flex-col">
                {#if healthIntervention.overallStatus === "Improved"}
                <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {healthIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {healthIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if healthIntervention.overallStatus === "Regressed"}
                <div class = "flex flex-row mt-2">
                    <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                    <div class = "ml-5 w-30"> {healthIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {healthIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if healthIntervention.overallStatus === "Neutral"}
                <div class = "flex flex-row mt-2">
                    <i class="fa-solid fa-circle-minus mt-1.5"></i>
                    <div class = "ml-5 w-30"> {healthIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {healthIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {/if}
                
                {#each healthIntervention.statuses as status}
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
                {/each}
            </div>
        </div>
        {/if}

        {#if showEduc == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Education </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {true} label = "" rows = 4 value = {educIntervention.names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Education </span> Improvement History </div>
            <div class = "flex flex-col">
                {#if educIntervention.overallStatus === "Improved"}
                <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {educIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {educIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if educIntervention.overallStatus === "Regressed"}
                <div class = "flex flex-row mt-2">
                    <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                    <div class = "ml-5 w-30"> {educIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {educIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if educIntervention.overallStatus === "Neutral"}
                <div class = "flex flex-row mt-2">
                    <i class="fa-solid fa-circle-minus mt-1.5"></i>
                    <div class = "ml-5 w-30"> {educIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {educIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>
                {/if}
                
                {#each educIntervention.statuses as status}
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
                {/each}
            </div>
        </div>
        {/if}

        {#if showSocial == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Social </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {true} label = "" rows = 4 value = {socialIntervention.names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Social </span> Improvement History </div>
            <div class = "flex flex-col">
                {#if socialIntervention.overallStatus === "Improved"}
                <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {socialIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {socialIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if socialIntervention.overallStatus === "Regressed"}
                <div class = "flex flex-row mt-2">
                    <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                    <div class = "ml-5 w-30"> {socialIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {socialIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if socialIntervention.overallStatus === "Neutral"}
                <div class = "flex flex-row mt-2">
                    <i class="fa-solid fa-circle-minus mt-1.5"></i>
                    <div class = "ml-5 w-30"> {socialIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {socialIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>
                {/if}
                
                {#each socialIntervention.statuses as status}
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
                {/each}
            </div>
        </div>
        {/if}

        {#if showLivelihood == true}
        <div class = "flex flex-col p-3 ">
            <div> <span class = "!text-[var(--pink)]"> Livelihood </span> Interventions </div>
            <div class = '-ml-60'> <TextArea disabled = {true} label = "" rows = 4 value = {livelihoodIntervention.names}/> </div>
            <div class = "mt-5"> <span class = "!text-[var(--pink)]"> Livelihood </span> Improvement History </div>
            <div class = "flex flex-col">
                {#if livelihoodIntervention.overallStatus === "Improved"}
                <div class = "flex flex-row mt-2">
                    <i id = "improved" class="fa-solid fa-circle-arrow-up mt-1.5"></i>
                    <div class = "ml-5 w-30"> {livelihoodIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {livelihoodIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if livelihoodIntervention.overallStatus === "Regressed"}
                <div class = "flex flex-row mt-2">
                    <i id = "regressed" class="fa-solid fa-circle-arrow-down mt-1.5"></i>
                    <div class = "ml-5 w-30"> {livelihoodIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {livelihoodIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>

                {:else if livelihoodIntervention.overallStatus === "Neutral"}
                <div class = "flex flex-row mt-2">
                    <i class="fa-solid fa-circle-minus mt-1.5"></i>
                    <div class = "ml-5 w-30"> {livelihoodIntervention.overallStatus} </div>
                    <div class = "ml-5 mt-0.5"> <InputText type = "date" value = {livelihoodIntervention.creationDate.split('T')[0]} disabled> </InputText></div>
                </div>
                {/if}
                
                {#each livelihoodIntervention.statuses as status}
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
                {/each}
            </div>
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
</style>