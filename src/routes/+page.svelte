<script>
   import LoginModal from '../components/LoginModal.svelte'
   //var controls if the modal is on screen
   let showModal = $state(false)

   //function that closes the modal
   const handleClose = () => {
      showModal = false;
   }
</script>

<!-- Below is the code that formats the main login screen-->
<div
   class="hero min-h-screen"
   style = "background-image: url(/img/bgimage.png);">

  <div class = "absolute inset-x-0 bottom-10 grid grid-cols-1 grid-rows-2 gap-5 sm:mx-auto" style="margin-inline: clamp(1rem, 10vw, 220px)" >
        <button class = "btn !text-black font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5]  !p-8  !rounded-md hover:!shadow-xl"
                onclick={() => location.href = '/registration/child'}>
            Register a Child
        </button>

      <button 
      onclick = {() => (showModal = true)}
      class = "btn !text-black font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5]  !p-8  !rounded-md hover:!shadow-xl">
           Staff Login
        </button>
   </div>
</div>

<!--Below is the login modal code-->
<LoginModal bind:showModal>
  {#snippet header()}
    <div class="flex justify-center">
      <img src="/img/logo.png" alt="logo" class="w-55 h-40" />
    </div>
  {/snippet}


  <!--Only one of these error divs will display depending on the kind of failure that is returned by the login API-->
   <div class = "!mb-5 !bg-red-400 !text-black !text-sm !border-red-400 !rounded-lg alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
          Incorrect Username or Password!
   </div>


   <div class = "!mb-5 !bg-red-400 !text-black !text-sm !border-red-400 !rounded-lg alert alert-warning">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
          Incomplete Information!
   </div>
   <!--ERROR MESSAGES END HERE-->

   <!--Body formatting of the modal-->

  <div class="flex flex-wrap items-center mb-4 mx-10 gap-2">
    <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="username">
      USERNAME:
    </label>
    <input class = "input !min-w-[50%] grow basis-0 !h-10" placeholder = "Type username..."/>
  </div>

  <div class="flex flex-wrap items-center mb-8 mx-10 gap-2">
    <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="password">
      PASSWORD:
    </label>
    <input type = "password" class = "input !min-w-[50%] grow basis-0 !h-10" placeholder = "Type password..."/>
  </div>

  <!--BODY ENDS HERE-->
   

</LoginModal>



   