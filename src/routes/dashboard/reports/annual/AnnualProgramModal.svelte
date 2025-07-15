<script>
import InputText from '../../../../components/input/InputText.svelte';
import Modal from '../../../../components/Modal.svelte';
import Textarea from '../../../../components/input/InputTextarea.svelte';

export let modalIsOpen = false;
export let title = "";
export let button_title = title;
export let formData = {						// data to be loaded (if edit), default is none (for creating new)
	id: "",
	startYYYY: "",
	startMM: "",
	startDD: "",
	endYYYY: "",
	endMM: "",
	endDD: "",
	total_target_CWDS: "",
	new_target_CWDS: "",
	old_target_CWDS: "",
	total_actual_CWDS: "",
	new_actual_CWDS: "",
	old_actual_CWDS: "",
	general_reflection: "",
	lessons_learned: ""
};

</script>

<Modal buttonText="{button_title}" width="50%" bind:isOpen={modalIsOpen}>
	<div slot="modal">
		<h2>{title}</h2>

		<InputText type="number" label="Start Year" id="startYYYY" bind:value={formData.startYYYY} required/>
		<InputText type="number" label="Start Month" id="startMM" bind:value={formData.startMM} />
		<InputText type="number" label="Start Date" id="startDD" bind:value={formData.startDD} />
		<InputText type="number" label="End Year" id="endYYYY" bind:value={formData.endYYYY} required/>
		<InputText type="number" label="End Month" id="endMM" bind:value={formData.endMM} />
		<InputText type="number" label="End Date" id="endDD" bind:value={formData.endDD} />

		<InputText type="number" label="Target New CWDs" id="targetCWDs" bind:value={formData.new_target_CWDS} />
		<Textarea label="General Reflection" id="reflection" bind:value={formData.general_reflection} />
		<Textarea label="Lessons Learned" id="lessons" bind:value={formData.lessons_learned} />

		<slot name="footer" />

	</div>
</Modal>