<div style="background-color: rgb(113,137,38); height: 100vh; display: flex; align-items: center; justify-content: center;">
    <section style="max-height: 90vh; overflow-y: auto; background-color: ghostwhite; width: 50em;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4); padding: 2rem; border-radius: 16px;">

        <!--Only one of these error divs will display depending on the kind of failure that is returned by the login API-->
            <div id="error-msg" style="position: absolute; z-index: 10; width: 65%" class = "!mb-5 !bg-red-400 !text-black !text-sm !border-red-400 !rounded-lg alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Password do not match!
            </div>

        <!-- Logo -->
        <div class="flex justify-center" style="margin:20px">
            <img src="/img/logo.png" alt="logo" class="w-55 h-40" />
        </div>



        <!-- Username -->
        <div class="flex flex-wrap items-center mb-3 gap-2">
            <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="username">
                USERNAME:
            </label>
            <input class="input !min-w-[50%] grow basis-0 !h-10" placeholder="Type username..." />
        </div>

        <!-- Password -->
        <div class="flex flex-wrap items-center mb-3 gap-2">
            <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="password">
                PASSWORD:
            </label>
            <input type="password" class="input !min-w-[50%] grow basis-0 !h-10" placeholder="Type password..." />
        </div>

        <!-- Re-enter -->
        <div class="flex flex-wrap items-center mb-3 gap-2">
            <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="reenter">
                RE-ENTER:
            </label>
            <input type="password" class="input !min-w-[50%] grow basis-0 !h-10" placeholder="Re-enter password..." />
        </div>

        <!-- Email -->
        <div class="flex flex-wrap items-center mb-3 gap-2">
            <label class="!shrink-0 !text-[var(--green)] !text-[35px] !font-bold" for="email">
                E-MAIL:
            </label>
            <input class="input !min-w-[50%] grow basis-0 !h-10" placeholder="example@gmail.com" />
        </div>

        <!-- Submit -->
        <div style="text-align:center; margin-top: 3rem">
            <button class="green" style="width:100%">Sign-up</button>
        </div>
    </section>
</div>
