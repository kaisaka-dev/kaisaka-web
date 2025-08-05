<script lang="ts">
    import Input from '$components/input/InputText.svelte'
    import Header from '$components/Header.svelte'
    import type { staff } from '$lib/types/staff.js'
    import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';
    import { goto } from '$app/navigation';
    import InputPassword from '$components/input/InputPassword.svelte';
    import Checkbox from '$components/input/Checkbox.svelte';

    export let data;

    let user:staff = {
        accountName: data.accountName,
        email: data.email
    }

    let style = ""
    let state = ""
    let loadingSave = false
    let changePass = false

    let account = {
        name: user.accountName,
        email: user.email,
        pass: '',
        confirmPass: ''
    }
    let errors = {
        pass: '',
        confirmPass: ''
    }

    function isStrongPassword(password: string): boolean {
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        return hasLetter && hasNumber && isLongEnough;
    }

    async function handleSubmit() {
        state = ""
        let passFieldInvalid = (account.pass === "" || account.confirmPass === "") && changePass

        if(account.name.trim() === "" || account.email.trim() === "" || passFieldInvalid) {
           style = "mt-5 ml-25 !text-red-500"
           state = "Missing Information!"
        }

        else if(/[!@#$%^&*+-]/.test(account.name)){
            style = "mt-5 ml-25 !text-red-500"
            state = "Invalid Username!"
        }

        else if (!/@/.test(account.email)){
            style = "mt-5 ml-25 !text-red-500"
            state = "Invalid Email!"
        }

        else if(changePass && !isStrongPassword(account.pass)) {
            style = "mt-5 ml-25 !text-red-500"
            state = "Password does not meet requirements!"
        }

        else if(changePass && account.pass !== account.confirmPass) {
            style = "mt-5 ml-25 !text-red-500"
            state = "Password Mismatch!"
         }

        else {
            account.email = account.email.trim()
            loadingSave = true;

            const updateRes = await fetch('/auth/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: account.name,
                    password: account.pass,
                    email: account.email
                })
                });

            if(!updateRes.ok){
                const result = await updateRes.json()
                style = "mt-5 ml-25 !text-red-500"
                state = result.error
            }
            else{
                style = "mt-5 ml-25 !text-[var(--green)]"
                state = "Changes saved!"
                goto("/dashboard/staff-profile")
            }
            loadingSave = false;

        }
    }

    $: errors.pass = isStrongPassword(account.pass) ? "" : "At least 8 characters, and contains at least 1 letter and number"
</script>

<Header/>

<section>
    <h1> {user.accountName}'s Profile</h1>
</section>

<!-- container for profile content-->
<section class = "border-4 border-[var(--border)] min-w-150 p-6">
    <Input id='name' label="Account name" bind:value={account.name}/>
    <Input id='email' label="Account email" bind:value={account.email}/>

    <br>
    <Checkbox id="edit-pass" label="Change Password" bind:checked={changePass}/>
    {#if changePass}
        <div class="ml-[1.5rem]">
            <InputPassword id='pass' label="Account password" bind:value={account.pass} msg={errors.pass}/>
            <InputPassword id='confirm-pass' label="Confirm password" bind:value={account.confirmPass} msg={errors.confirmPass}/>
        </div>
    {/if}
</section>

<div class = "mt-5 ml-25 flex flex-row">
    <button class =  "mr-5" type = "submit" onclick = {()=> goto("/dashboard/staff-profile")}> Back</button>
    {#if loadingSave}
        <LoadingBtn label="Save Changes" />
    {:else}
        <button class = "green" onclick = {() => handleSubmit()}> Save Changes</button>
    {/if}

</div>

<div class = {style}>
   {state}
</div>