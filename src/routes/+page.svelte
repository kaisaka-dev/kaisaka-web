<script lang="ts">
  import Button from '$lib/components/example/Button/Button.svelte';
	import { redirect } from '@sveltejs/kit';
import LoginModal from '$components/LoginModal.svelte'
	import LoginError from '$components/login/LoginError.svelte';
	import LoginOption from '$components/login/LoginOption.svelte';
  import SignUpinputLabel from "$components/login/SignUpInputLabel.svelte"
	import type { ActionData } from './+page.js';

  

  //function that closes the modal
  const handleClose = () => showModal = false
  const handleOpen = () => showModal = true
  const gotoChildRegister = () => location.href = '/registration/child'
  const handleLogout = async () => {
      const formData = new FormData();
  const res = await fetch('/auth/logout', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error('[Logout Failed]', msg);
    alert('Logout failed');
    return;
  }

  window.location.href = '/';
};
  let { data }: { data: ActionData } = $props()

  //var controls if the modal is on screen
  let showModal = $state(data.error ?? false)
</script>

<!-- Below is the code that formats the main login screen-->
<div class="hero min-h-screen" style = "background-image: url(/img/bgimage.png);">
  <div class = "absolute inset-x-0 bottom-10 grid grid-cols-1 grid-rows-2 gap-5 sm:mx-auto" style="margin-inline: clamp(1rem, 10vw, 220px)" >

    <LoginOption ButtonText="Register a Child"  buttonFunction={gotoChildRegister}/>
    {#if !data.session}
    <LoginOption ButtonText="Staff Login"       buttonFunction={handleOpen}/>
    {:else}
    
    <LoginOption ButtonText="Logout Account" buttonFunction={handleLogout}/>
    
    
    {/if}
   </div>
</div>

<!--Below is the login modal code-->
{#if !data.session}
 <form method="POST" action="?/login">
  <LoginModal bind:showModal>
    
    {#snippet header()}
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="logo" class="w-55 h-40" />
      </div>
    {/snippet}
    
      <LoginError data = { data.error }/>
      
      <SignUpinputLabel labelText="EMAIL:" forType="email" inputName="email" placeholder="Type email ..."/>
    
      <SignUpinputLabel labelText="PASSWORD:" forType="password" inputName="password" placeholder="Type password ..."/>

      <div style="text-align:center;">
          <a href="/sign-up" style="color: cornflowerblue;" class="hover:cursor-pointer hover:underline">
              <i style="color: cornflowerblue;">Click here to sign-up</i>
          </a>
      </div>

    <!--BODY ENDS HERE-->
    
  </LoginModal>
</form>
{/if}


   