<script lang="ts">
    import Input from '$components/input/InputText.svelte'
    import Header from '$components/Header.svelte'
    import Select from '$components/input/Select.svelte'
    import type { staff } from '$lib/types/staff.js'
	import { userEvent } from '@storybook/test';

    //below are test data needed for the page to work, this will be deleted once the relevant APIs are completed
    let sample:staff = {
        accountName: "Shoufou",
        role: "superadmin",
        password: "wowie",
        email: "riverap1231@gmail.com"
    }

    let confirmpass = sample.password
    let testpass = sample.password
    let testacc = sample.accountName
    let testemail = sample.email
    let testrole = sample.role
    

    let passwordmismatch =false;
    let missinginfo = false;
    let noissues = false;

    let style = ""
    let state = ""
    function handleSubmit(account: string, pass: string,confirmpass: string, email: string) {
        if(account === "" || pass === "" || confirmpass === "" || email === "") {
           style = "mt-5 ml-25 !text-red-500"
           state = "Missing Information!"
        }

        else if(pass !== confirmpass) {
            style = "mt-5 ml-25 !text-red-500"
           state = "Password Mismatch!"       
         }

        else {
            style = "mt-5 ml-25 !text-[var(--green)]"
           state = "Changes saved!"       
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
    <h1> {sample.accountName}'s Profile</h1>
</section>

<form method = "GET">
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
            <div class = "w-50"> Confirm Account Password </div>
            <div class = "ml-3"> <input class = "w-80 rounded-md" type = "password" bind:value = {confirmpass}/> </div>
        </div>

        {#if sample.role === "superadmin"} <!--this is something that will render only if youre a superadmin because i think its wonky if a regular staff member can change their role lol-->
        <div class = "information mt-5">
            <div class = "w-50"> Account Role: </div>
            <div class = "-ml-57"> <Select  label = "" bind:value = {testrole} options = {["superadmin","admin"]}/> </div>
        </div>
        {/if}

        <div class = "information mt-5">
            <div class = "w-50"> Account Email: </div>
            <div class = "ml-3"> <Input  label = "" bind:value = {testemail}/> </div>
        </div>
    </div>
</div>

<div class = "mt-5 ml-25 flex flex-row">
    <button class =  "mr-5" type = "submit" onclick = {()=> location.href="/dashboard/staff-profile"}> Back</button>
    <button class = "!bg-[var(--green)]" onclick = {() => handleSubmit(testacc, testpass,confirmpass, testemail)}> Save Changes</button>

</div>

<div class = {style}>
   {state}
</div>
</form>