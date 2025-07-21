<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import InputText from '$components/input/InputText.svelte';
	import type { Income} from '../+page.server.js';

	export let id: string;
	export let data: Income[];
	export let editing: true;


	function deleteInc(id:number): void {
		console.log("deleted", id);
		data = data.filter((item) => item.id != id)
	}
	function addInc(): void {
		const newIncome: Income = {
			id: null, // left blank for now (cant be left blank though, since deleting is by key, and having 2 nulls would delete both)
			name: "",
			date_start: new Date().toISOString().split('T')[0], // today
			date_end: null // null means active
		};
		data = [...data, newIncome];
	}


</script>


<div class = "mt-10">
	<div id = {id} class = "w-240 min-w-240">
		<h2> Income Type </h2>
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
			{#each data as inc}
				<tr>
					{#if editing}
						<td><InputRange type="date" bind:valueFrom={inc.date_start} bind:valueTo={inc.date_end} /></td>
						<td><InputText bind:value={inc.name} /></td>
						<td style="text-align:center;">
							<i class="fa-solid fa-trash" on:click={() => deleteInc(inc.id)}></i>
						</td>

					{:else}
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
</style>