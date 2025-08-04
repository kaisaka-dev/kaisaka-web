<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />

<script lang="ts">
import Header from "$components/Header.svelte";
import { onMount } from 'svelte';

let loading = false;
let pendingList =[];
let totalCwds: number;
let pendingCwds: number;

onMount(fetchPendingDocuments)

async function fetchPendingDocuments() {
    try {
        loading = true;
        console.log('Fetching: /api/children?type=pending-documents');

        const [response, allChildRes] = await Promise.all([
            fetch('/api/children?type=pending-documents'),
            fetch('/api/children')
        ]);

        if (!response.ok || !allChildRes.ok) {
            throw new Error('Failed to fetch pending documents');
        }

        const [result, childResult] = await Promise.all([
            response.json(),
            allChildRes.json()
        ]);

        // transform API data to match component expectations
        const transformedList = result.data.map((child: any) => ({
            id: child.id || '',
            name: child.members?.first_name + ' ' + child.members?.last_name,
            medCert: child.has_medical_cert ? "✅" : "❌",
            birthCert: child.has_birth_cert ? "✅" : "❌",
            brgyCert: child.has_barangay_cert ? "✅" : "❌",
            interventionPlan: child.intervention?.[0]?.intervention ? "✅" : "❌",
            link: `/dashboard/members/children/profile?id=${child.id}`
        }));

        // filters the list (removes records which has ✅ for all records
        pendingList = transformedList.filter((child) =>
          child.medCert !== "✅" ||
          child.birthCert !== "✅" ||
          child.brgyCert !== "✅" ||
          child.interventionPlan !== "✅"
        );

        console.log(pendingList)

        pendingCwds = pendingList.length;
        totalCwds = childResult.data.length;
    } catch (err) {
        console.error('Error fetching pending documents:', err);
    } finally {
        loading = false;
    }
}

</script>
<!-- boostrap icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">

<Header page="dashboard" />

<section id="nav-board" class="flex flex-row gap-[1rem] p-0 m-0">

    <div class="nav-main flex flex-col gap-[1rem]">
        <button id="overview" class="!w-[100%] !bg-[var(--pink)] !p-[2rem]
                        !rounded-2xl flex flex-row"
                onclick={() => location.href="/dashboard/members/children"}>
            <div id="cwds-w-intervention" class=" !px-[4rem]" style="font-size:var(--text-8xl); border-right:1px solid var(--background)">
                {#if loading}
                    <i class="fa fa-circle-notch fa-spin mr-2 !text-[var(--background)] !text-[150px] !mx-auto !my-auto"></i>
                {:else}
                    {totalCwds-pendingCwds}
                    <span id="cwds-total" style="font-size:var(--text-3xl)">/ {totalCwds}</span>
                {/if}
            </div>
            <div class="!px-[4rem] flex flex-col gap-[2rem]" style="justify-content:space-between">
                <div class="mt-[1.5rem]">CWDs registered with intervention plans</div>
                <a href="/dashboard/members/pending" style="text-align:right">assign CWDs ></a>
            </div>
        </button>

        <!-- grid-like navigation info panel-->
        <div class="nav-links flex flex-row gap-[1rem]">
            <div class="nav-column flex flex-col gap-[1rem] w-[50%]">
                <a class="panel" href="/dashboard/members/children"><i class="bi bi-person-wheelchair"></i>View CWDs<i class="bi bi-chevron-compact-right"></i></a>
                <a class="panel" href="/dashboard/members/caregivers"><i class="bi bi-person-hearts"></i>View caregivers<i class="bi bi-chevron-compact-right"></i></a>
                <a class="panel" href="/dashboard/members/families"><i class="bi bi-people-fill"></i>View families<i class="bi bi-chevron-compact-right"></i></a>
            </div>
            <div class="nav-column flex flex-col gap-[1rem] w-[50%]">
                <a class="panel" href="/dashboard/registration/child"><i class="bi bi-person-plus-fill"></i>Register new CWD<i class="bi bi-chevron-compact-right"></i></a>
                <a class="panel" href="/dashboard/information/how-to-add-caregiver"><i class="bi bi-person-hearts"></i>Register new caregiver<i class="bi bi-chevron-compact-right"></i></a>
                <a class="panel" href="/dashboard/reports/list"><i class="bi bi-file-earmark-plus-fill"></i>View reports history<i class="bi bi-chevron-compact-right"></i></a>
            </div>
        </div>
    </div>

    <!-- the notification column -->
    <div id="notif-column" class="flex flex-col gap-[0.5rem]" style="margin-left:auto;">
        <a class="notif-head" href="/dashboard/members/pending"><i class="bi bi-bell-fill mr-[0.5rem]" style="color: var(--background);"></i> Pending review </a>
        <ul class="!ml-[2rem]">
            {#if loading}
                <li>Loading...</li>
            {:else if pendingList.length === 0}
                <li>No pending members</li>
            {:else}
                {#each pendingList.slice(0, 5) as child}
                    <li><a href={child.link}>{child.name}</a></li>
                {/each}
                {#if pendingList.length > 5}
                    <br>
                    <a href="/dashboard/members/pending">see more > </a>
                {/if}
            {/if}
        </ul>
    </div>
</section>

<style>

    a.panel {
        text-align: left !important;
        display: flex;
        align-items: center;
        padding: 0.5rem 0 0.5rem 1.5rem;
        width: 100%;
        max-width: 35rem;
        flex-grow: 1;
        background-color: var(--header-color);
        color: var(--pink);
    }
    a.panel i {
        color: var(--pink);
        margin-right: 1rem;
        font-size: 50px;
    }
    a.panel .bi-chevron-compact-right {
        margin-left: auto;
        margin-right: 0.5rem;
    }

    a.panel,
    #overview {
        text-align: center;
        border-radius: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    }
    a.panel:hover,
    #overview:hover {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.25);
    }
    a.panel:hover, a.panel:hover i {
        color: var(--green);
    }
    .nav-main {
        width: 100%;
        max-width: 70rem;
    }
    #overview *{
        color: var(--background);
    }
    #overview a:hover,
    #notif-column a:hover
    {
        text-decoration: underline;
    }

    #notif-column {
        min-width: 200px;
        width: 30%;
    }
    #notif-column > .notif-head {
        margin-top: 3rem;
        padding: 0.5rem 1.5rem;
        background-color: var(--green);
        color: var(--background);
        border-radius: 0;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);

    }



    @media (max-width: 640px) {
        .nav-links {
            flex-direction: column;
            align-items: center;
        }
        #overview {
            flex-direction: column;
        }
        .nav-links,
        .nav-column,
        .nav-main {
            width: 100%;
        }

        .nav-main {
            flex-shrink: 1;

        }
    }

    @media (max-width: 1000px) {
        #nav-board {
            flex-direction: column;
            align-items: center;
        }
        #notif-column {
            width: 100%;
        }
    }



</style>