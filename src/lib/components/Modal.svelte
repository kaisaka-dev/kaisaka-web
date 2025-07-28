<script>
	export let buttonText = "Show more";	// set to "" if you want to hide the button which opens the modal
	export let isOpen = false;						// alternative to button in opening modal, if you want to control it using other html elements OUTSIDE this component
	export let width = "70%";							// controls width of the pop-up shown
</script>

{#if buttonText !== ""}
	<button onclick={() => isOpen = true}>{buttonText}</button>
{/if}

<!-- DaisyUI Modal -->
<div class="modal {isOpen ? 'modal-open' : ''}">
	<div class="modal-box !w-[{width}] !max-w-none">
		<section>
			<slot name="modal" />
		</section>
	</div>
	<div class="modal-backdrop">
		<button type = "button" aria-label="Close" onclick={() => isOpen = false}></button>
	</div>
</div>

<style>
	.modal-backdrop button{
			width: 105%;
			height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
	}

	.modal-box {
			background-color: var(--background);
	}
</style>