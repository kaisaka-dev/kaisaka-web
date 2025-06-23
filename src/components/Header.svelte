
<script>
    let logoimg = '/img/logo.png';
    let profileimg = '/img/Profile Icon.png';
    export let curr_category = "members";
    export let curr_page = "children";
</script>

<div id = "navbar" style="font-weight:bold">
    <img src = {logoimg} alt = "logo" id = "logo">
    <a href="/" id="home"> Home</a>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Members</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[#513737]">
            <li><a>Children</a></li>
            <li><a>Caregivers</a></li>
            <li><a>Families</a></li>
            <li><a>Pending</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Events</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[#513737]">
            <li><a>Target Events</a></li>
            <li><a>Conducted Events</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-hover">
        <div class="navlink" role="button" tabindex="-1">Reports</div>
        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[#513737]">
            <li><a>Item</a></li>
            <li><a>Item</a></li>
        </ul>
    </div>

    <div class="dropdown dropdown-left dropdown-hover" id="profile">
        <div class="navlink" role="button" tabindex="-1"><img src = {profileimg} alt = "profile" /></div>

        <ul tabindex="-1" class="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm !bg-[#513737]">
            <li><a>My Profile</a></li>
            <li><a>Log Out</a></li>
        </ul>
    </div>


</div>

<div id="subnav">
    {#if curr_category === "members"}
        <ul>
            <li><a>Children</a></li>
            <li><a>Caregivers</a></li>
            <li><a>Families</a></li>
            <li><a>Pending</a></li>
        </ul>
    {/if}

    {#if curr_category === "events"}
        <ul>
            <li><a>Target Events</a></li>
            <li><a>Conducted Events</a></li>
        </ul>
    {/if}
</div>

<style>

    #navbar {
        position: relative;
        background-color : #513737;
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


    #subnav li:hover {
        background-color: rgb(123, 88, 102);
        transition: 0.3s;
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
    }

    #subnav a {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 10px;
        color: var(--background);
        font-weight: bold;
        font-size: var(--small-text);
        text-decoration: none;
    }



</style>