<script lang="ts">
	import { redirect } from "@sveltejs/kit";
    import type { PageProps } from "../$types.js"
    import type { ActionData } from "./+page.server.js";
	import SignUpinputLabel from "../../components/login/SignUpInputLabel.svelte";
	import LoginError from "../../components/login/LoginError.svelte";
	import SignUpSuccess from "../../components/login/SignUpSuccess.svelte";
	import { success } from "zod/v4";
	import { onMount } from "svelte";
    
    let { data }: { data: ActionData } = $props()
    
    const waitRedirectSucess = async () => {
        setTimeout(()=>{
            window.location.href='/';
        }, 5000)
    }

    onMount(async () => {
        if (data.success) {
            await waitRedirectSucess()
        }
    })
</script>

<div style="background-color: rgb(113,137,38); height: 100vh; display: flex; align-items: center; justify-content: center;">
    <!--Form actions are done by `+page.server.ts` \@ `../sign-up/register`-->
    <form method="POST" action="?/register" style="max-height: 90vh; overflow-y: auto; background-color: ghostwhite; width: 50em; box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4); padding: 2rem; border-radius: 16px;">

        <!-- Logo -->
        <div class="flex justify-center" style="margin:20px">
            <img src="/img/logo.png" alt="logo" class="w-55 h-40" />
        </div>

        <!--Only one of these error divs will display depending on the kind of failure that is returned by the login API-->
        
        <LoginError data = { data.error ?? '' }/>
        
        <SignUpSuccess data = { data.success ?? false }/>

        <SignUpinputLabel labelText="USERNAME:" forType="username" inputName="username" placeholder="Type username ..."/>
        
        <SignUpinputLabel labelText="PASSWORD:" forType="password" inputName="password" placeholder="Type password ..."/>
        
        <SignUpinputLabel labelText="RE-ENTER:" forType="password" inputName="confirmPassword" placeholder="Re-enter password ..."/>

        <SignUpinputLabel labelText="EMAIL:" forType="email" inputName="email" placeholder="example@gmail.com"/>

        <!-- Submit -->
        <div style="text-align:center; margin-top: 3rem">
            <button class="green" style="width:100%" type="submit">Sign-up</button>
        </div>
    </form>
</div>
