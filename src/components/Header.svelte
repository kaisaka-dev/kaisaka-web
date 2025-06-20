
<script>
    let logoimg = '/img/logo.png';
    let profileimg = '/img/Profile Icon.png'
</script>

<div id = "navbar" style="font-weight:bold">
    <img src = {logoimg} alt = "logo" id = "logo">
    <a href="/" > Home</a>
    <a href="/"> Members</a>
    <a href="/"> Events</a>
    <a id = "reports" href="/"> Reports </a>

    <img src = {profileimg} alt = "profile" id = "profile"/>
</div>

<style>

    #navbar {
        background-color : #513737;
        display:flex;
        padding: 10px;
    }

    #navbar > a {
        color: #F7B0CD;
        padding: 15px;
        font-size: var(--medium-text);
    }
    #navbar > a:hover {
        color: var(--green);
    }

    #navbar > #logo {
        height: 70px;
        padding-top:10px;
    }

    #navbar > #profile {
        height: 70px;
        padding-top:20px;
        margin-left: auto;
    }

</style>