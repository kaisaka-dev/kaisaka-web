<script lang="ts">
    import Input from '../../../components/input/InputText.svelte'
    import Header from '../../../components/Header.svelte'
    import type { staff } from '$lib/types/staff.js'

    //below are test data needed for the page to work, this will be deleted once the relevant APIs are completed
    let sample:staff = {
        accountName: "Shoufou",
        role: "superadmin",
        password: "wowie",
        email: "riverap1231@gmail.com"
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

<!-- container for profile content-->
<div class = "border-4 border-[var(--border)] w-300 min-w-150 ml-25 p-6">
    <div class = "flex flex-col">
        <div class = "information">
            <div class = "w-50"> Account Name: </div>
            <div class = "ml-3"> <Input  disabled label = "" value = {sample.accountName}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Account Password: </div>
            <div class = "ml-3"> <Input disabled label = "" value = {sample.password}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Account Role: </div>
            <div class = "ml-3"> <Input disabled label = "" value = {sample.role}/> </div>
        </div>

        <div class = "information mt-5">
            <div class = "w-50"> Account Email: </div>
            <div class = "ml-3"> <Input disabled label = "" value = {sample.email}/> </div>
        </div>
    </div>
</div>

<div class = "mt-5 ml-25">
    <button onclick = {() => location.href = '/dashboard/staff-profile/edit'}> Edit Profile</button>
</div>