<script lang="ts">
  import LoginModal from '../components/LoginModal.svelte'
	import LoginError from '../components/login/LoginError.svelte';
	import LoginInputLabel from '../components/login/LoginInputLabel.svelte';
  import SignUpinputLabel from "../components/login/SignUpInputLabel.svelte"
   //var controls if the modal is on screen
  let showModal = $state(false)
  let isError = $state(true)
   //function that closes the modal
   

   const handleClose = () => {
      showModal = false;
   }

   const handleLogin = () => {
    
   }
</script>

<!-- Below is the code that formats the main login screen-->
<div
   class="hero min-h-screen"
   style = "background-image: url(/img/bgimage.png);">

  <div class = "absolute inset-x-0 bottom-10 grid grid-cols-1 grid-rows-2 gap-5 sm:mx-auto" style="margin-inline: clamp(1rem, 10vw, 220px)" >
    <button class = "btn font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5] !p-8 !rounded-md hover:!shadow-xl"
      onclick={() => location.href = '/registration/child'}>
          Register a Child
    </button>

    <button class = "btn font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5] !p-8 !rounded-md hover:!shadow-xl"
      onclick = {() => (showModal = true)}>
          Staff Login
    </button>
   </div>
</div>

<!--Below is the login modal code-->
<LoginModal loginFunction={handleLogin} bind:showModal>

    {#snippet header()}
      <div class="flex justify-center">
        <img src="/img/logo.png" alt="logo" class="w-55 h-40" />
      </div>
    {/snippet}

    <!--Only one of these error divs will display depending on the kind of failure that is returned by the login API-->

    <LoginError data = { {error: ""} }/>

     <!--ERROR MESSAGES END HERE-->

    <!--Body formatting of the modal-->
  
    <LoginInputLabel labelText="USERNAME:" forType="useername" inputName="username" placeholder="Type usernamee ..."/>
  
    <LoginInputLabel labelText="PASSWORD:" forType="password" inputName="password" placeholder="Type password ..."/>

    <div style="text-align:center;">
        <a href="/sign-up/" style="color: cornflowerblue;" class="hover:cursor-pointer hover:underline">
            <i style="color: cornflowerblue;">Click here to sign-up</i>
        </a>
    </div>

  <!--BODY ENDS HERE-->

</LoginModal>



   