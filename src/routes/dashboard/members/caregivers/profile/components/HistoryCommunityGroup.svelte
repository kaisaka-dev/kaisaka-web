<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import { onMount } from 'svelte';
	import type { Community } from '../+page.server.js';
	
	import Select from '$components/input/Select.svelte';
	import Validation from '$lib/components/text/Validation.svelte';
	import AddCommunityGroupModal from './AddCommunityGroupModal.svelte';

	export let id: string;
	export let data: Community[];
	export let editing: boolean;
	export let error: string;
	


	console.log(data)

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
	}

	// adds a community group to the caregiver's history
	function addComGroup(): void {
		const newCommunity: Community = {
			isDeleted: false,
			isNew: true,
			name: "",
			date_joined: new Date().toISOString().split('T')[0], // today
			date_left: null, // null means active
			isNew: true,
			isDeleted: false
		};
		data = [...data, newCommunity];
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
				modalOpen = false
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
	<div id = {id} class = "w-240 min-w-240">
		<h2> Community Group </h2>
		<Validation msg = {error}/>
		<table>
			<thead>
			<tr>
				<th class="w-[435px]">Date</th>
				<th class="w-[435px]">Community Group</th>
				{#if editing}
					<th class="w-[100px]">Delete</th>
				{/if}
			</tr>
			</thead>
			<tbody>
			{#each data as com, index}
			{#if com.isDeleted == false && editing}
				<tr class="group hover:bg-gray-50">
					{#if com.isDeleted == false}
					{#if editing}
						<td><InputRange type="date" bind:valueFrom={com.date_joined} bind:valueTo={com.date_left} /></td>
						<td class="community-cell !pb-0">
							<Select bind:value={com.id} options={options_community} required />
							<button class="add hover-button" on:click={() => modalOpen = true}>
								Not in choices?
							</button>
						</td>
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
			{:else if editing == false}
				<tr class="group hover:bg-gray-50">
					{#if editing}
						<td><InputRange type="date" bind:valueFrom={com.date_joined} bind:valueTo={com.date_left} /></td>
						<td class="community-cell !pb-0">
							<Select bind:value={com.name} options={options_community} required />
							<button class="add hover-button" on:click={() => modalOpen = true}>
								Not in choices?
							</button>
						</td>
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
				</tr>
			{/if}
			{/each}
			{#if editing}
				<tr>
					<td><i class="fa-solid fa-plus" on:click={()=>addComGroup()}></i></td>
					<td></td>
					<td></td>
				</tr>
			{/if}
			</tbody>
		</table>

	</div>
</div>

<AddCommunityGroupModal 
	bind:modalOpen 
	bind:newComGroup 
	bind:msg_newComGroup 
	{handleSubmit} 
/>

<style>
		i {
				font-size: inherit;
		}
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
		.fa-plus {
				color: var(--green);
		}
		button {
        all: unset;
        cursor: pointer;
				color: darkgray;
				font-size: 0.8rem;
				opacity: 0;
				transition: opacity 0.2s ease;
        margin-top: -12px !important;
				margin-left: 0.5rem;
        display: block;
		}
		button:hover, button:hover > * {
        color: var(--green);
		}
		
		.group:hover button {
				opacity: 1;
		}
</style>