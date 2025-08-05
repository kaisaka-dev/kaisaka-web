<script lang="ts">
    import Input from '$components/input/InputText.svelte'
    import Header from '$components/Header.svelte'
    import Select from '$components/input/Select.svelte'
    import type { staff } from '$lib/types/staff.js'
	import { userEvent } from '@storybook/test';
    import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';

    export let data;

    let user:staff = {
        accountName: data.accountName,
        email: data.email
    }

    let confirmpass = ""
    let testpass = ""
    let testacc = user.accountName
    let testemail = user.email
    

    let passwordmismatch = false;
    let missinginfo = false;
    let noissues = false;

    let style = ""
    let state = ""
    let loadingsave = false

    async function handleSubmit(account: string, pass: string,confirmpass: string, email: string) {
        if(account === "" || pass === "" || confirmpass === "" || email === "") {
           style = "mt-5 ml-25 !text-red-500"
           state = "Missing Information!"
        }

        else if(pass !== confirmpass) {
            style = "mt-5 ml-25 !text-red-500"
           state = "Password Mismatch!"       
         }

        else {
            loadingsave = true;
            const updateRes = await fetch('/auth/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    username: testacc,
                    password: testpass,
                    email: testemail
                })
                });

            if(!updateRes.ok){
                style = "mt-5 ml-25 !text-red-500"
                state = updateRes.statusText
            }
            else{
                style = "mt-5 ml-25 !text-[var(--green)]"
                state = "Changes saved!"
            }
            loadingsave = false;
        }
    }
</script>
<style>
    .information{
        display: flex;
        flex-direction: row;
    }
</style>
 <Header/>
<section>
    <h1> {user.accountName}'s Profile</h1>
</section>

<!-- container for profile content-->
<div class = "border-4 border-[var(--border)] w-300 min-w-150 ml-25 p-6">
    <div class = "flex flex-col">
        <div class = "information">
            <div class = "w-50"> Account Name: </div>
            <div class = "ml-3"> <Input  label = "" bind:value = {testacc}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Account Password: </div>
            <div class = "ml-3"> <input class = "w-80 rounded-md" type = "password" bind:value = {testpass}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Confirm Password </div>
            <div class = "ml-3"> <input class = "w-80 rounded-md" type = "password" bind:value = {confirmpass}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Account Email: </div>
            <div class = "ml-3"> <Input  label = "" bind:value = {testemail}/> </div>
        </div>
    </div>
</div>

<div class = "mt-5 ml-25 flex flex-row">
    <button class =  "mr-5" type = "submit" onclick = {()=> location.href="/dashboard/staff-profile"}> Back</button>
    {#if loadingsave}
        <LoadingBtn label="Save Changes" />
    {:else}
        <button class = "green" onclick = {() => handleSubmit(testacc, testpass,confirmpass, testemail)}> Save Changes</button>
    {/if}

</div>

<div class = {style}>
   {state}
</div>