<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    /**
     * an array of object, where object is a row of data
     */
    export let data: Record<string, any>[] = [];

    /**
     * an array of column keys (strings) to be excluded from the table view
     * EX: excludedKeys={['caregiver_id', 'relationship']}
     */
    export let excludedKeys: string[] = [];

    /**
     * (optional) list of column headers to be displayed
     * EX: headers={['First Name', 'Last Name', 'Contact No.', 'Relationship']}
     */
    export let headers: string[] = [];

    let sortKey: string = '';
    let sortAsc: boolean = true;

    // Sort the data based on sortKey and direction
    $: sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal === bVal) return 0;
        return (aVal > bVal ? 1 : -1) * (sortAsc ? 1 : -1);
    });

    // Toggle sort
    function sortBy(key: string) {
        if (sortKey === key) {
            sortAsc = !sortAsc;
        } else {
            sortKey = key;
            sortAsc = true;
        }
    }

    // Extract visible keys (in order)
    $: visibleKeys = Object.keys(data[0] ?? {}).filter(key => !excludedKeys.includes(key));

    // Create pairs of [key, headerLabel]
    $: displayColumns = visibleKeys.map((key, i) => ({
        key,
        label: headers[i] ?? key  // fallback to key name if no header provided
    }));

</script>

{#if data.length > 0}
    <table>
        <thead>
        <tr>
            {#each displayColumns as col}
                <th on:click={() => sortBy(col.key)} style="cursor: pointer;">
                    {col.label}
                    <i
                        class={
                          sortKey === col.key
                            ? sortAsc
                              ? 'fa-solid fa-arrow-up active'
                              : 'fa-solid fa-arrow-down active'
                            : 'fa-solid fa-sort'
                        }
                        style="margin-left: 0.5rem; opacity: {sortKey === col.key ? 1 : 0.5}; transition: opacity 0.2s ease; color: var(--background)"
                        aria-hidden="true"
                    ></i>
                </th>

            {/each}
        </tr>
        </thead>
        <tbody>
        {#each sortedData as row}
            <tr>
                {#each displayColumns as col}
                    <td>{row[col.key]}</td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
{:else}
    <p>No data to show.</p>
{/if}