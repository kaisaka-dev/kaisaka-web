<script>
   import LoginModal from '../components/LoginModal.svelte'
   //var controls if the modal is on screen
   let showModal = $state(false)

   //function that closes the modal
   const handleClose = () => {
      showModal = false;
   }
</script>

<div
   class="hero min-h-screen"
   style = "background-image: url(/img/bgimage.png);">
  <div class = "!mx-55 absolute inset-x-0 bottom-10 grid grid-cols-1 grid-rows-2 gap-5">
        <button class = "btn !text-black font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5]  !p-8 !px-50 !rounded-md hover:!shadow-xl">
            Register a Child
        </button>

      <button 
      onclick = {() => (showModal = true)}
      class = "btn !text-black font-[JSans] !text-[var(--medium-text)] !bg-[#C5C5C5]  !p-8 !px-50 !rounded-md hover:!shadow-xl">
           Staff Login
        </button>
   </div>


</div>

<LoginModal bind:showModal>
	{#snippet header()}
		<img src = '/img/logo.png' alt = 'logo'
      class = "!mx-85 w-55 h-40"/>
	{/snippet}

   
   <p class = "!text-[var(--green)] !mb-11"> USERNAME</p>
   <p class = "!text-[var(--green)]"> PASSWORD</p>

</LoginModal>



   