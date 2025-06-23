<script>
    import Header from '../../components/Header.svelte'
    import PageLabel from '../../components/text/pageHeader.svelte'
    import Input from '../../components/input/InputText.svelte'
    import TextArea from '../../components/input/InputTextarea.svelte'
</script>

<div>
    <Header/>
    <PageLabel purpose = {"{Child Name}'s Profile"}/>

</div>

<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Information
</h1>

<!-- PERSONAL INFORMATION SECTION BELOW-->
<div class = "border-[var(--border)] border-4 ml-55 mr-10" id ="Personal Info">
    <div class = "!flex !flex-row !justify-start mt-2">
        <div class = "flex flex-col">
            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> First Name</div>
                <div> <Input disabled value = "First Name"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Last Name</div>
                <div> <Input disabled value = "Last Name"/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-40"> Birthday</div>
                <div> <Input disabled value = "Birthday"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Age</div>
                <div> <Input disabled value = "Age"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Sex</div>
                <div> <Input disabled value = "Sex"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Address</div>
                <div> <Input disabled value = "Address"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-40"> Barangay</div>
                <div> <Input disabled value = "Barangay"/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Category of Disability</div>
                <div> <Input disabled value = "Category"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Nature of Disability</div>
                <div> <Input disabled value = "Nature"/> </div>
            </div>

            <div class = "flex flex-row mt-10">
                <div class = "ml-4 mt-3 w-70"> Date of Admission</div>
                <div> <Input disabled value = "Date"/> </div>
            </div>

            <div class = "flex flex-row">
                <div class = "ml-4 mt-3 w-70"> Date of Termination</div>
                <div> <Input disabled value = "Date"/> </div>
            </div>
        </div>
        
        
        <div class = "flex flex-col -ml-10"> 
            <div class = "-ml-8"> <TextArea label = "Remarks"/> </div>
        </div>
    </div>
</div>
<!-- PERSONAL INFORMATION SECTION END-->

<!--CONTAINER FOR FAMILY AND MEMBERSHIP LABELS-->
<div class = "flex flex-row">
    <div class = "mr-64">
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Family
        </h1>
    </div>

    <div>
        <h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 -mb-5">
        Membership
        </h1>
    </div>
</div>

<!--CONTAINER FOR FAMILY AND MEMBERSHIP INFORMATION-->
<div class = "flex flex-row mt-10">
    <div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-125" id ="Family Info">
        <div class = "flex flex-row">
            <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Caregiver </div>
            <div class = "!font-[JSans] mt-2"> Paolo Rivera</div>
        </div>

        <div class = "flex flex-row mt-10">
            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
            <div class = "!font-[JSans] mt-2 "> Child Name</div>
        </div>

        <div class = "flex flex-row mt-10">
            <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)] mr-20" > Child </div>
            <div class = "!font-[JSans] mt-2"> Child Name2</div>
        </div>
    </div>

    <div class = "border-[var(--border)] border-4 p-6 flex flex-col" id ="Membership Info">
        <div class = "flex flex-row">
            <div class = 'mr-25 font-bold'> 2025 </div>
            <div> Payment Made on DATE</div>
        </div>

         <div class = "flex flex-row mt-5">
            <div class = 'mr-25 font-bold'> 2024 </div>
            <div class = "!text-red-500 "> Payment Pending</div>
        </div>
    </div>
</div>
<!--END OF FAMILY AND MEMBERSHIP INFORMATION-->

<!--EVENT AND ATTENDANCE STARTS HERE-->
<h1 class = "!text-[var(--green)] font-[JSans] ml-55 mt-5 mb-2">
        Event and Attendance
</h1>

<div class = "flex flex-col border-[var(--border)] border-4 ml-55 mr-10 p-6 w-238" id ="Event Info">
    <div class = "flex flex-col">
        <div class = "!bg-[var(--green)] p-3 flex flex-row">
           <div class = "!text-[var(--background)] !font-bold">Event Name </div>
           <div class = "!text-[var(--background)] !font-bold ml-85">Event Type </div>
           <div class = "!text-[var(--background)] !font-bold ml-35">Date Attended </div>
        </div>

        <div class = "border-[var(--border)] border-4 flex flex-col p-3 ">
            <div class = "flex flex-row">
                <div>
                    EVENT NAME
                </div>

                <div class = "ml-73">
                    <div class = "!bg-[var(--green)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > SOCIAL </div>
                </div>

                <div class = "ml-25">
                    DATE ATTENDED
                </div>
            </div>

            <div class = "flex flex-row mt-3">
                <div>
                    EVENT NAME
                </div>

                <div class = "ml-73">
                    <div class = "!bg-[var(--pink)] p-2 w-45 rounded-full text-center !font-bold !text-[var(--background)]" > EDUCATION </div>
                </div>

                <div class = "ml-25">
                    DATE ATTENDED
                </div>
            </div>
        </div>
    </div>
</div>




