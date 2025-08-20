<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import type { Income } from '../+page.server.js';
	import { dropdownOptions } from '$lib/types/options.js';
	import Select from '$components/input/Select.svelte';
	import Validation from '$lib/components/text/Validation.svelte';


	export let id: string;
	export let data: Income[];
	export let editing: boolean;
	export let error: string;


	function deleteInc(index:number): void {
		data[index].isDeleted = true
	}
	function addInc(): void {
		const newIncome: Income = {
			name: "",
			date_start: new Date().toISOString().split('T')[0], // today
			date_end: "", // empty means active,
			isDeleted: false,
			isNew: true
		};
		data = [...data, newIncome];
		console.log(data)
	}


</script>


<div class = "mt-10">
	<div id = {id} class = "w-240 min-w-240">
		<h2> Income Type </h2>
		<Validation msg = {error} />
		{#if editing || data.filter(inc => !inc.isDeleted).length > 0}
		<table>
			<thead>
			<tr>
				<th class="w-[435px]">Date</th>
				<th class="w-[435px]">Income Type</th>
				{#if editing}
				<th class="w-[100px]">Delete</th>
				{/if}
			</tr>
			</thead>
			<tbody>
			{#each data as inc,index}
				<tr>
					{#if editing}
						{#if inc.isDeleted == false}
						<td><InputRange type="date" bind:valueFrom={inc.date_start} bind:valueTo={inc.date_end} /></td>
						<td><Select bind:value={inc.name} options={dropdownOptions.income_category} required /></td>
						<td style="text-align:center;">
							<i class="fa-solid fa-trash" on:click={() => deleteInc(index)}></i>
						</td>
						{/if}
					{:else}
						{#if !inc.isDeleted}
							<td>{inc.date_start}
								<i class="fa-solid fa-arrow-right !text-[var(--green)]"></i>
								{#if inc.date_end === null}
									<span class="!text-[var(--green)]"> Present </span>
								{:else}
									{inc.date_end}
								{/if}
							</td>
							<td>{inc.name}</td>
						{/if}
					{/if}
				</tr>
			{/each}
			{#if editing}
				<tr>
					<td><i class="fa-solid fa-plus" on:click={()=>addInc()}></i></td>
					<td></td>
					<td></td>
				</tr>
			{/if}
			</tbody>
		</table>
		{:else}
			<div style="color: var(--text-color); font-style: italic; border: 3px solid var(--border);
    padding: 0.8rem;">None</div>
		{/if}
	</div>
</div>

<style>
	i:hover {
			cursor: pointer;
			color: var(--error-color)
	}
	.fa-plus {
			color: var(--green);
	}
</style>