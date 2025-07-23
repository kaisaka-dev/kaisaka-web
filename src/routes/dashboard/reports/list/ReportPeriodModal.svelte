<script lang="ts">
import InputText from '$components/input/InputText.svelte';
import InputRange from '$components/input/InputRange.svelte';
import Modal from '$components/Modal.svelte';
import Textarea from '$components/input/InputTextarea.svelte';
import type { ReportPeriod, Errors } from './+page.server.js';

export let modalIsOpen = false;
export let title = "";
export let button_title = title;
export let formData: ReportPeriod = {
	id: null,
	startYYYY: null,
	startMM: null,
	startDD: null,
	endYYYY: null,
	endMM: null,
	endDD: null,
	total_target_CWDS: null,
	new_target_CWDS: null,
	old_target_CWDS: null,
	total_actual_CWDS: null,
	new_actual_CWDS: null,
	old_actual_CWDS: null,
	general_reflection: "",
	lessons_learned: ""
};

let errors: Errors = {
	startYYYY: "",
	startMM: "",
	startDD: "",
	endYYYY: "",
	endMM: "",
	endDD: "",
	new_target_CWDS: "",
	old_target_CWDS: "",
	new_actual_CWDS: "",
	old_actual_CWDS: ""
}

const thisYear = new Date().getFullYear();  // used to verify if year makes sense

/**
 * validates the form before submission
 */
function validateForm(): boolean {
	console.log(formData)
	errors = {
		startYYYY: formData.startYYYY ? "" : "Start Year is required",
		startMM: errors.startMM,
		startDD: errors.startDD,
		endYYYY: formData.endYYYY ? "" : "End Year is required",
		endMM: errors.endMM,
		endDD: errors.endDD,
		// for the database, int2's range is only -32768 to 32767
		new_target_CWDS: formData.new_target_CWDS && (formData.new_target_CWDS < 0 || formData.new_target_CWDS > 32767) || formData.new_target_CWDS === null
			? "Invalid" : "",
		old_target_CWDS: formData.old_target_CWDS && (formData.old_target_CWDS < 0 || formData.old_target_CWDS > 32767) || formData.old_target_CWDS === null
			? "Invalid" : "",
		new_actual_CWDS: formData.new_actual_CWDS && (formData.new_actual_CWDS < 0 || formData.new_actual_CWDS > 32767)
			? "Invalid" : "",
		old_actual_CWDS: formData.old_actual_CWDS && (formData.old_actual_CWDS < 0 || formData.old_actual_CWDS > 32767)
			? "Invalid" : ""
	}
	if (formData.endYYYY !== null && formData.startYYYY !== null) {
		// setting nulls and undefined to 0, to avoid my IDE from screaming at me
		let endMM = formData.endMM ?? 0;
		let startMM = formData.startMM ?? 0;
		let endDD = formData.endDD ?? 0;
		let startDD = formData.startDD ?? 0;

		// converting the dates into integer for easier comparison
		let sum = (formData.endYYYY - formData.startYYYY) * 10000 +
			(endMM - startMM) * 100 +
			(endDD - startDD)
		errors.endYYYY = sum >= 0 ? "" : "End Dates must be greater than Start Dates"
	}

	for (const error of Object.values(errors)) {
		if (error) {
			console.log("error found: ", error)
			return false;
		}
	}

	return true;
}
async function handleSubmit() {
	if (!validateForm()) return;

	try {
		const method = formData.id ? 'PUT' : 'POST';
		const url = formData.id ? `/api/annual_program` : `/api/annual_program`;


		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: formData.id,
				start_year: formData.startYYYY,
				start_month: formData.startMM,
				start_date: formData.startDD,
				end_year: formData.endYYYY,
				end_month: formData.endMM,
				end_date: formData.endDD,
				target_new_cwds: formData.new_target_CWDS,
				target_old_cwds: formData.old_target_CWDS,
				actual_new_cwds: formData.new_actual_CWDS,
				actual_old_cwds: formData.old_actual_CWDS,
				general_reflection: formData.general_reflection,
				lessons_learned: formData.lessons_learned
			})
		});

		if (!response.ok) {
			throw new Error(await response.text());
		}

		modalIsOpen = false;
		if (method === 'POST') window.location.reload();	// refresh if post, to reload the data.
	} catch (error) {
		console.error('Submission error:', error);
	}
}

// error checks
$: if (formData.startYYYY == null) errors.startYYYY = ""
	else if (formData.startYYYY >= thisYear-100 && formData.startYYYY <= thisYear+100) errors.startYYYY = ""
	else errors.startYYYY = "warning: year too far away"
$: if (formData.endYYYY == null) errors.endYYYY = ""
	else if (formData.endYYYY >= thisYear-100 && formData.endYYYY <= thisYear+100) errors.endYYYY = ""
	else errors.endYYYY = "warning: year too far away"
$: if (formData.startMM == null) errors.startMM = ""
	else if (formData.startMM >= 1 && formData.startMM <= 12) errors.startMM = ""
	else errors.startMM = "month: 1 to 12 only"
$: if (formData.endMM == null) errors.endMM = ""
   else if (formData.endMM >= 1 && formData.endMM <= 12) errors.endMM = ""
   else errors.endMM = "month: 1 to 12 only"
$: if (formData.startDD == null) errors.startDD = ""
	 else if (formData.startDD >= 1 && formData.startDD <= 31) errors.startDD = ""
	 else errors.startDD = "date: 1 to 31 only"
$: if (formData.endDD == null) errors.endDD = ""
	 else if (formData.endDD >= 1 && formData.endDD <= 31) errors.endDD = ""
   else errors.endDD = "date: 1 to 31 only"

</script>

<Modal buttonText="{button_title}" width="50%" bind:isOpen={modalIsOpen}>
	<div slot="modal">
		<h2>{title}</h2>
		<form on:submit|preventDefault={handleSubmit}>
			<InputRange type="number" label="Report Year" id="reportYYYY" bind:valueFrom={formData.startYYYY} bind:valueTo={formData.endYYYY} msg={errors.startYYYY + " " + errors.endYYYY} required />
			<InputRange type="number" label="Report Month" id="reportYYYY" bind:valueFrom={formData.startMM} bind:valueTo={formData.endMM} msg={errors.startMM + " " + errors.endMM} />
			<InputRange type="number" label="Report Date" id="reportYYYY" bind:valueFrom={formData.startDD} bind:valueTo={formData.endDD} msg={errors.startDD + " " + errors.endDD} />

			<InputText type="number" label="Target New CWDs" id="targetNewCWDs" bind:value={formData.new_target_CWDS} msg={errors.new_target_CWDS} required />
			<InputText type="number" label="Target Old CWDs" id="targetOldCWDs" bind:value={formData.old_target_CWDS} msg={errors.old_target_CWDS} required />
			<InputText type="number" label="Actual New CWDs" id="actualNewCWDs" bind:value={formData.new_actual_CWDS} msg={errors.new_actual_CWDS} />
			<InputText type="number" label="Actual Old CWDs" id="actualOldCWDs" bind:value={formData.old_actual_CWDS} msg={errors.old_actual_CWDS} />
			<Textarea label="General Reflection" id="reflection" bind:value={formData.general_reflection} />
			<Textarea label="Lessons Learned" id="lessons" bind:value={formData.lessons_learned} />

			<button type="button" on:click={() => modalIsOpen = false}>Cancel</button>
			<button class="green" type="submit">Submit</button>
		</form>
	</div>
</Modal>