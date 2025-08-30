<script lang="ts">
	import Header from '$components/Header.svelte';
	import { page } from '$app/state';
	import type { PageData } from '../../../../.svelte-kit/types/src/routes/$types.js';
	import RegistrationForm from '$components/shared/registration/RegistrationForm.svelte';

	/**
	 * note: /dashboard/registration and /registration is just the same, the constant is to hide
	 * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
	 * staffView = false if it is the parent who is accessing the page
	 * staffView = true if it is the staff who is accessing the page
	 */
	const staffView = /dashboard/i.test(page.url.pathname);
	console.log("staffview:", staffView)

	// get the url parameters
	const url = {
		caregiverId: page.url.searchParams.get('caregiver'),
		childId: page.url.searchParams.get('cwd'),
		familyId: page.url.searchParams.get('familyId')
	}

	// load the data
	const { data } = $props<{ data: PageData }>();
</script>

{#if staffView}
	<Header />
{/if}


<RegistrationForm {staffView} {data} {url}/>
