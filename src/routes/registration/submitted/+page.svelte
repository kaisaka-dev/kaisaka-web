<script>
	import MessagePresentDocuments from '$components/shared/registration/MessagePresentDocuments.svelte';
	import { goto } from '$app/navigation';
</script>

<section>
	Thank you for submitting your registration!
	<br>
	<br>
	<MessagePresentDocuments/>
	<br>
	<br>
	<button on:click={goto('/')}> Back to home </button>
</section>