<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import { onMount } from 'svelte';
	import type { Community } from '../+page.server.js';
	
	import Select from '$components/input/Select.svelte';
	import Modal from '$components/Modal.svelte';
	import InputText from '$components/input/InputText.svelte';

	export let id: string;
	export let data: Community[];
	export let editing: true;



	let modalOpen = false; 	// modal for creating new community group
	let newComGroup = "";
	let msg_newComGroup = "";

	// options for community group dropdown
	let options_community: [] = [];
	onMount(async () => {
		options_community = await getOptions();
	})

	// GET the options for community group dropdown
	async function getOptions(): Promise<[]> {
		const response = await fetch('/api/community_group_type');
		const options_community = await response.json()
		return options_community.data;
	}

	// delete the community group to the caregiver's history
	function deleteComGroup(index:number): void {
		data[index].isDeleted = true
		data = data
	}

	// adds a community group to the caregiver's history
	function addComGroup(): void {
		const newCommunity: Community = {
			name: "",
			date_joined: new Date().toISOString().split('T')[0], // today
			date_left: null, // null means active
			isNew: true,
			isDeleted: false
		};
		data = [...data, newCommunity];
		console.log(data)
	}

	async function handleSubmit() {
		msg_newComGroup = "";		// clear
		// Trim and validate input
		newComGroup = newComGroup.trim();

		if (newComGroup === "") {
			msg_newComGroup= 'Please enter a community group name';
		}


		else{
			// Check for uniqueness against existing options
			const isUnique = !options_community.some(
			(option: { id: number; name: string }) =>
				option.name.toLowerCase() === newComGroup.toLowerCase()
			);

			if (!isUnique) {
			msg_newComGroup = 'This community group already exists';
			}
			// If unique, proceed with submission
			else{
				try {
				const response = await fetch('/api/community_group_type', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: newComGroup })
				});

				if (response.ok) {
				// Refresh options if successful
				options_community = await getOptions();
				newComGroup = "";
				} else {
				throw new Error('Failed to add community group');
				}
				} catch (error) {
				console.error('Error:', error);
				alert('Error adding community group');
				}
			}
			
		}
	}


</script>


<div class = "mt-10">
				{console.log(data)}

	<div id = {id} class = "w-240 min-w-240">
		<h2> Community Group </h2>
		<table>
			<thead>
			<tr>
				<th>Date</th>
				<th>Community Group</th>
				{#if editing}
					<th>Delete</th>
				{/if}
			</tr>
			</thead>
			<tbody>
			{#each data as com,index}
				<tr>
					{#if com.isDeleted == false}
					{#if editing}
						<td><InputRange type="date" bind:valueFrom={com.date_joined} bind:valueTo={com.date_left} /></td>
						<td><Select bind:value={com.name} options={options_community} required /></td>
						<td style="text-align:center;">
							<i class="fa-solid fa-trash" on:click={() => deleteComGroup(index)}></i>
						</td>

					{:else}
						<td>{com.date_joined}
							<i class="fa-solid fa-arrow-right !text-[var(--green)]"></i>
							{#if com.date_left === null}
								<span class="!text-[var(--green)]"> Present </span>
							{:else}
								{com.date_left}
							{/if}
						</td>
						<td>{com.name}</td>

					{/if}
					{/if}
				</tr>
			{/each}
			{#if editing}
				<tr>
					<td><i class="fa-solid fa-plus" on:click={()=>addComGroup()}></i></td>
					<td>
						<span class="add" on:click={()=>{modalOpen = true}}><i class="fa-solid fa-plus" ></i> Add new community group</span>
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
					</td>
					<td></td>
				</tr>
			{/if}
			</tbody>
		</table>

	</div>
</div>

<style>
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
		.add, .add > *, .fa-plus {
				color: var(--green);
		}
		.add:hover {
				text-decoration: underline;
		}
</style>