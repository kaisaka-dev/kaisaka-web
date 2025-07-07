
<script>
    let logoimg = '/img/logo.png';
    let profileimg = '/img/Profile Icon.png';
    export let category = "";
    export let page = "";
</script>

<div id = "navbar" style="font-weight:bold; position: sticky">
    <img src = {logoimg} alt = "logo" id = "logo">
    <a href="/dashboard" id="home"> Home</a>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Members</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[var(--header-color)]">
            <li><a href="/dashboard/members/children">Children</a></li>
            <li><a href="/dashboard/members/caregivers">Caregivers</a></li>
            <li><a href="/dashboard/members/families">Families</a></li>
            <li><a href="/dashboard/members/pending">Pending</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Events</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[var(--header-color)]">
            <li><a href="/dashboard/events/target">Target Events</a></li>
            <li><a href="/dashboard/events/actual">Actual Events</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Reports</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[var(--header-color)]">
            <li><a href="/dashboard/reports/annual">Annual Report</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-left dropdown-hover" id="profile">
        <div class="navlink" role="button" tabindex="-1"><img src = {profileimg} alt = "profile" style="height:50px;" /></div>

        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[var(--header-color)]">
            <li><a href="/dashboard/staff-profile">My Profile</a></li>
            <li><a href="/">Log Out</a></li>
        </ul>
    </div>


</div>

<div id="subnav">
    {#if category === "members"}
        <ul>
            <li class={page === "children" ? "active" : ""}><a href="/dashboard/members/children">Children</a></li>
            <li class={page === "caregivers" ? "active" : ""}><a href="/dashboard/members/caregivers">Caregivers</a></li>
            <li class={page === "families" ? "active" : ""}><a href="/dashboard/members/families">Families</a></li>
            <li class={page === "pending" ? "active" : ""}><a href="/dashboard/members/pending">Pending</a></li>
        </ul>
    {/if}

    {#if category === "events"}
        <ul>
            <li class={page === "target" ? "active" : ""}><a href="/dashboard/events/target">Target</a></li>
            <li class={page === "actual" ? "active" : ""}><a href="/dashboard/events/actual">Actual</a></li>
        </ul>
    {/if}
</div>

<style>
    :root {
        --header-color: rgb(245, 231, 243);
    }
    #navbar {
        position: relative;
        top: 0;
        /*background-color : #513737;*/
        background-color: var(--header-color);
        display:flex;
        padding: 10px;
        height: 90px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
        z-index: 2;
    }

    a, .navlink {
        color: var(--pink);
        padding: 15px;
        font-size: var(--medium-text);
    }
    a:hover, .navlink:hover {
        color: var(--green);
    }

    li > a {
        font-size: var(--small-text);
        font-weight: 500;
    }

    #navbar > #logo {
        height: 70px;
        padding-top:10px;
    }

    #navbar > #profile {
        height: 70px;
        margin-left: auto;
    }

    #subnav {
        position: relative;
        background-color: var(--pink);
        height: auto;
        z-index: 1;
    }

    li.active {         /* shading for active page */
        /*background-color: rgb(123, 88, 102);*/
        background-color: var(--green);
    }

    #subnav li:hover {
        transition: 0.3s;
        /*background-color: rgb(123, 88, 102);*/
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
    }

    #subnav ul {
        display: flex;
        flex-direction: row;
        margin: 0;
        list-style: none;
    }

    #subnav li {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0 2rem;
        height: 100%;
        color: var(--background);
    }

    #subnav a {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 10px;
        font-weight: bold;
        font-size: var(--small-text);
        text-decoration: none;
        color: inherit;
    }



</style>