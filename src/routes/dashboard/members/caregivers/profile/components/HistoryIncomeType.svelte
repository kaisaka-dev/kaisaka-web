<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import type { Income } from '../+page.server.js';
	import { dropdownOptions } from '$lib/types/options.js';
	import Select from '$components/input/Select.svelte';
	import Validation from '$lib/components/text/Validation.svelte';


	export let id: string;
	export let data: Income[];
	export let editing;
	export let error: string;


	function deleteInc(index:number): void {
		data[index].isDeleted = true
	}
	function addInc(): void {
		const newIncome: Income = {
			income_category: "",
			date_start: new Date().toISOString().split('T')[0], // today
			date_end: null, // null means active,
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
		<table>
			<thead>
			<tr>
				<th>Date</th>
				<th>Income Type</th>
				{#if editing}
				<th>Delete</th>
				{/if}
			</tr>
			</thead>
			<tbody>
			{#each data as inc,index}
				<tr>
					{#if editing}
						{#if inc.isDeleted == false}
						<td><InputRange type="date" bind:valueFrom={inc.date_start} bind:valueTo={inc.date_end} /></td>
						<td><Select bind:value={inc.income_category} options={dropdownOptions.income_category} required /></td>
						<td style="text-align:center;">
							<i class="fa-solid fa-trash" on:click={() => deleteInc(index)}></i>
						</td>
						{/if}
					{:else}
						<td>{inc.date_start}
							<i class="fa-solid fa-arrow-right !text-[var(--green)]"></i>
							{#if inc.date_end === null}
								<span class="!text-[var(--green)]"> Present </span>
							{:else}
								{inc.date_end}
							{/if}
						</td>
						<td>{inc.income_category}</td>

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