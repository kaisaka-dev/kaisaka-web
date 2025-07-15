<script lang="ts">
import InputText from '../../../../components/input/InputText.svelte';
import Modal from '../../../../components/Modal.svelte';
import Textarea from '../../../../components/input/InputTextarea.svelte';
import type { Errors } from './+page.server.js';

export let modalIsOpen = false;
export let title = "";
export let button_title = title;
export let errors: Errors;
export let formData = {						// data to be loaded (if edit), default is none (for creating new)
	id: "",
	startYYYY: null,
	startMM: null,
	startDD: null,
	endYYYY: null,
	endMM: null,
	endDD: null,
	total_target_CWDS: null,
	new_target_CWDS: "",
	old_target_CWDS: "",
	total_actual_CWDS: "",
	new_actual_CWDS: "",
	old_actual_CWDS: "",
	general_reflection: "",
	lessons_learned: ""
};

// error checks
$: if (formData.startMM >= 1 && formData.startMM <= 12 || formData.startMM == null) errors.startMM = ""
   else errors.startMM = "month: 1 to 12 only"
$: if (formData.endMM >= 1 && formData.endMM <= 12 || formData.endMM == null) errors.endMM = ""
   else errors.endMM = "month: 1 to 12 only"
$: if (formData.startDD >= 1 && formData.startDD <= 31 || formData.startDD == null) errors.startDD = ""
	 else errors.startDD = "date: 1 to 31 only"
$: if (formData.endDD >= 1 && formData.endDD <= 31 || formData.endDD == null) errors.endDD = ""
   else errors.endDD = "date: 1 to 31 only"

</script>

<Modal buttonText="{button_title}" width="50%" bind:isOpen={modalIsOpen}>
	<div slot="modal">
		<h2>{title}</h2>

		<InputText type="number" label="Start Year" id="startYYYY" bind:value={formData.startYYYY} msg={errors.startYYYY} required/>
		<InputText type="number" label="Start Month" id="startMM" bind:value={formData.startMM} msg={errors.startMM} />
		<InputText type="number" label="Start Date" id="startDD" bind:value={formData.startDD} msg={errors.startDD} />
		<InputText type="number" label="End Year" id="endYYYY" bind:value={formData.endYYYY} msg={errors.endYYYY} required/>
		<InputText type="number" label="End Month" id="endMM" bind:value={formData.endMM} msg={errors.endMM} />
		<InputText type="number" label="End Date" id="endDD" bind:value={formData.endDD} msg={errors.endDD} />

		<InputText type="number" label="Target New CWDs" id="targetCWDs" bind:value={formData.new_target_CWDS} msg={errors.new_target_CWDS} />
		<Textarea label="General Reflection" id="reflection" bind:value={formData.general_reflection} />
		<Textarea label="Lessons Learned" id="lessons" bind:value={formData.lessons_learned} />

		<slot name="footer" />

	</div>
</Modal>