<script lang="ts">
	import InputRange from '$components/input/InputRange.svelte';
	import InputText from '$components/input/InputText.svelte';
	import type { Income} from '../+page.server.js';

	export let id: string;
	export let data: Income[];
	export let editing: true;





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
							<i class="fa-solid fa-trash"></i>
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