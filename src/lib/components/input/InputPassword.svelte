<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<script lang="ts">
	import Validation from '../text/Validation.svelte';

	// things that usually affect the component
	export let label = "";
	export let id = "";
	export let value: string | number = "";		// string for date, number for number

	// other extra things to customize the input
	export let type = "password";			// can also be: date, number
	export let required = false;
	export let msg = ""; 					// error message passed from parent
	export let disabled = false;
	export let margin = true;			// false if no margin, true if the default margin
	export let showPassword = false;

	function togglePassword(e: Event) {
		e.preventDefault(); // Prevent form submission
		showPassword = !showPassword;
	}
</script>

<div class="input-container" class:no-margin={label === '' || !margin}>
	{#if label !== ""}
		<label for={id}>{label} {required ? " *" : ""}</label>
	{/if}

	<div class="input-wrapper">
		{#if type !== "password"}
			<input {type} {id} class="input" bind:value {disabled}/>
		{:else}
			<div class="flex grow basis-0">
				<input type={showPassword ? 'text' : 'password'} {id} class="input" bind:value {disabled}/>
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

		{#if msg}
			<Validation {msg} />
		{/if}
	</div>

</div>

<style>
	input:disabled {
			background-color:gray;
			font-weight: bold;
			color: white;
	}
  input[type="number"] {
			padding-right: 15px;
  }
  .toggle-password {
      all: unset; /* Resets all properties to initial values */
      margin-left: -2.05rem;
      cursor: pointer;
      z-index: 1;
  }
  .toggle-password i {
      color: var(--background);
      font-size: 1.2rem;
  }
</style>