<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script lang="ts">
  let { labelText, forType, inputName, placeholder}: { labelText: string, forType: string, inputName: string, placeholder: string } = $props()
  let showPassword = $state(false);   // for password
  function togglePassword(e: Event) {
    e.preventDefault(); // Prevent form submission
    showPassword = !showPassword;
  }
</script>

<!-- Username -->
<div class="flex flex-wrap items-center mb-3 gap-2">
  <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for={ forType }>
    { labelText }
  </label>
  {#if forType !== "password"}
    <input name={ inputName } type={ forType } class="input !min-w-[50%] grow basis-0 !h-10" placeholder={ placeholder } />
  {:else }
    <!-- for the password -->
    <div class="flex grow basis-0 !h-10">
      <input name={ inputName } type={showPassword ? 'text' : 'password'} class="input !min-w-[50%] !max-w-[100%] grow basis-0 !h-10" placeholder={ placeholder } />
      <button type="button" onclick={togglePassword} class="toggle-password">
        <!-- or else the eye disappears after you lose focus on the password -->
        {#if showPassword}
          <i class="fa-regular fa-eye"></i>
        {:else}
          <i class="fa-regular fa-eye-slash"></i>
        {/if}
      </button>
    </div>
  {/if}
</div>





<style>
  .toggle-password {
    all: unset; /* Resets all properties to initial values */
    margin-left: -2rem;
    cursor: pointer;
    z-index: 1;
  }
  .toggle-password i {
    color: var(--background);
    font-size: 1.1rem;
  }
</style>