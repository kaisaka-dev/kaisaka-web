<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<script lang="ts">
    /**
     * an array of object, where object is a row of data
     */
    export let data: Record<string, any>[] = [];

    /**
     * an array of column keys (strings) to be INCLUDED in the table view
     * EX: includedKeys={['firstName', 'lastName', 'age']}
     */
    export let includedKeys: string[] = [];

    /**
     * (optional) list of column headers to be displayed
     * EX: headers={['First Name', 'Last Name', 'Contact No.', 'Relationship']}
     */
    export let headers: string[] = [];

    /**
     * (optional) key for the link property in each row
     * Defaults to 'link' if not specified
     */
    export let linkKey: string = 'link';

    /**
     * (optional) whether to enable clickable rows with links
     * Defaults to false
     */
    export let hasLink: boolean = false;

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
    $: visibleKeys = includedKeys.length > 0
      ? includedKeys.filter(key => data[0]?.hasOwnProperty(key) && (!hasLink || key !== linkKey))
      : Object.keys(data[0] ?? {}).filter(key => !hasLink || key !== linkKey);

    // Create pairs of [key, headerLabel]
    $: displayColumns = visibleKeys.map((key, i) => ({
        key,
    }));

    // Handle row click
    function handleRowClick(link: string, event: MouseEvent) {
        if (!link || !hasLink) return;

        const target = event.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            return;
        }

        window.location.href = link;
    }
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
            <tr
              on:click={hasLink ? (e) => handleRowClick(row[linkKey], e) : null}
              style="cursor: {hasLink && row[linkKey] ? 'pointer' : 'default'}"
              class:clickable={hasLink && !!row[linkKey]}>
                {#each displayColumns as col}
                    <td>
                        {#if hasLink && row[linkKey] && col.key === visibleKeys[0]}
                            <a href={row[linkKey]} style="color: inherit; text-decoration: none;">
                                {row[col.key]}
                            </a>
                        {:else}
                            {row[col.key]}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
{:else}
    <p>No data to show.</p>
{/if}
