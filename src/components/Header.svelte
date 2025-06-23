
<script>
    let logoimg = '/img/logo.png';
    let profileimg = '/img/Profile Icon.png'
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

<style>

    #navbar {
        background-color : #513737;
        display:flex;
        padding: 10px;
        height: 90px;
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

</style>