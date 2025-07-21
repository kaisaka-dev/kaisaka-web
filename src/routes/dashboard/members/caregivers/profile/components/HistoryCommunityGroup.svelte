<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import InputText from '$components/input/InputText.svelte';
	import type { Community } from '../+page.server.js';

	export let id: string;
	export let data: Community[];
	export let editing: true;


	function deleteComGroup(id:number): void {
		console.log("deleted", id);
		data = data.filter((item) => item.id != id)
	}
	function addComGroup(): void {
		const newCommunity: Community = {
			id: null, // left blank for now (cant be left blank though, since deleting is by key, and having 2 nulls would delete both)
			name: "",
			date_joined: new Date().toISOString().split('T')[0], // today
			date_left: null // null means active
		};
		data = [...data, newCommunity];
	}

</script>


<div class = "mt-10">
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
			{#each data as com}
				<tr>
					{#if editing}
						<td><InputRange type="date" bind:valueFrom={com.date_joined} bind:valueTo={com.date_left} /></td>
						<td><InputText bind:value={com.name} /></td>
						<td style="text-align:center;">
							<i class="fa-solid fa-trash" on:click={() => deleteComGroup(com.id)}></i>
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

<style>
    i:hover {
        cursor: pointer;
        color: var(--error-color)
    }
</style>