<script lang="ts">
	import Modal from '$components/Modal.svelte';
	import InputText from '$components/input/InputText.svelte';

	export let modalOpen: boolean;
	export let newComGroup: string;
	export let msg_newComGroup: string;
	export let handleSubmit: () => void;
</script>

<Modal buttonText="" bind:isOpen={modalOpen}>
	<div slot="modal">
		<h2>New Community Group</h2>
		<InputText label="Community Group" bind:value={newComGroup} msg={msg_newComGroup} required />
		<br>
		<p>note that this change will reflect across <span class="!text-[var(--green)]"> all caregivers </span></p>
		<button type="button" on:click={() => modalOpen = false}>Cancel</button>
		<button class="green" type="button" on:click={handleSubmit}>Submit</button>
	</div>
</Modal>