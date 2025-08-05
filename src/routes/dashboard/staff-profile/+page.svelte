<script lang="ts">
    import Input from '$components/input/InputText.svelte'
    import Header from '$components/Header.svelte'
    import type { staff } from '$lib/types/staff.js'
    import { goto } from '$app/navigation';
    export let data;

    //below are test data needed for the page to work, this will be deleted once the relevant APIs are completed
    let user:staff = {
        accountName: data.accountName,
        email: data.email
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
<section class = "border-4 border-[var(--border)] min-w-150 p-6">
    <Input id='name' label="Account name" bind:value={user.accountName} disabled/>
    <Input id='email' label="Account email" bind:value={user.email} disabled/>
</section>

<div class = "mt-5 ml-25">
    <button onclick = {() => goto('/dashboard/staff-profile/edit')}> Edit Profile</button>
</div>