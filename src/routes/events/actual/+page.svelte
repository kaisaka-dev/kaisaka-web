<script lang="ts">
	import Header from "../../../components/Header.svelte";
	import FilterSearch from "../../../components/styled-buttons/FilterSearch.svelte";
	import Table from "../../../components/text/Table.svelte";
	import InputText from '../../../components/input/InputText.svelte';
	import Select from '../../../components/input/Select.svelte';

	// Datatype (format) of a row to be displayed in the table
	type Activity = {
		category: string;
		objective: string;			// Not sure if we need this, but temporarily, I am including it
		target_activity: string;
		activity_name: string;
		date_time: string;
		target_participants: number | null;
		actual_participants: number | null;
	};

	// [TEMPLATE] Activities data (it's fine if date_time is formatted that way, since it'll run through a function
	const activities: Activity[] = [
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "medical care",
			activity_name: "medical asst and referrals (medicines, vitamins, dental, laboratory, check up, supplements)",
			date_time: "2025-01-12T09:00",
			target_participants: 15,
			actual_participants: 3
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "Medical check-up/ Laboratory/Assessment/ Medical Evaluation/ Hospitalization",
			activity_name: "medical check up and referrals, assessment and hospitalization assistance",
			date_time: "2025-01-15T13:30",
			target_participants: 15,
			actual_participants: 8
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "therapy",
			activity_name: "PT, OT, Music therapies",
			date_time: "2025-01-20T10:00",
			target_participants: 20,
			actual_participants: 11
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "assistive devices",
			activity_name: "referral, provision",
			date_time: "2025-01-22T11:15",
			target_participants: 5,
			actual_participants: null
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "emergency care and relief response",
			activity_name: "provision of health/ hygiene kits, fire relief and burial asst",
			date_time: "2025-02-01T16:45",
			target_participants: 20,
			actual_participants: 13
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "home visit / monitoring",
			activity_name: "transpo/ meals / load support",
			date_time: "2025-02-10T08:00",
			target_participants: 150,
			actual_participants: 69
		},
		{
			category: "Health",
			objective: "To facilitate, provide for the health needs of the children and youth with disabilities",
			target_activity: "SRHR/ Health and welfare webinars/ activities",
			activity_name: "infotalks, activities and FGDs",
			date_time: "2025-02-14T14:00",
			target_participants: 75,
			actual_participants: 22
		},
		{
			category: "Education",
			objective: "To facilitate, provide for the educational needs of CYWDs",
			target_activity: "provision of educational assistance",
			activity_name: "provision of educ supplies, early intervention classes, monitoring",
			date_time: "2025-01-17T09:30",
			target_participants: 85,
			actual_participants: 54
		},
		{
			category: "Education",
			objective: "To facilitate, provide for the educational needs of CYWDs",
			target_activity: "Parateacher",
			activity_name: "handle EIC, monitoring, area visitations, trainings, parent case conference, HMP",
			date_time: "2025-01-23T15:00",
			target_participants: 25,
			actual_participants: 25
		},
		{
			category: "Education",
			objective: "To facilitate, provide for the educational needs of CYWDs",
			target_activity: "sessions on child rights, protection and promotion",
			activity_name: "orientation and child rights sessions/ activities",
			date_time: "2025-02-03T10:30",
			target_participants: 50,
			actual_participants: 12
		},
		{
			category: "Social",
			objective: "Children with disabilities and their caregivers, parents stand up for themselves and influence decision makers",
			target_activity: "participation in consultation/ conferences and other social activities",
			activity_name: "special socialization activities, special games, art sessions, children's consultation and conferences",
			date_time: "2025-03-05T09:00",
			target_participants: 75,
			actual_participants: 34
		},
		{
			category: "Social",
			objective: "Children with disabilities and their caregivers, parents stand up for themselves and influence decision makers",
			target_activity: "organizing , activities of Youth with disabilities",
			activity_name: "Training, meetings, special activities",
			date_time: "2025-03-08T11:00",
			target_participants: 15,
			actual_participants: 7
		},
		{
			category: "Livelihood",
			objective: "CYWDs with improved pre vocational skills",
			target_activity: "sessions on developing pre vocational skills: materials, other expense",
			activity_name: "prevocational activities",
			date_time: "2025-03-11T14:30",
			target_participants: 20,
			actual_participants: 15
		},
		{
			category: "Livelihood",
			objective: "Caregivers participate in income generating activities; CYWDs acquiring work skills",
			target_activity: "training / activities related to livelihood, transition sessions",
			activity_name: "meetings, training, transition assessments, sessions",
			date_time: "2025-03-15T13:00",
			target_participants: 30,
			actual_participants: 9
		}
	];


	// Filter state
	let filter = $state({
		main: "",
		category: "",
		objective: "",
		target_activity: "",
		activity_name: "",
		date_from: "",
		date_to: "",
		target_participants: "",
		actual_participants: ""
	});

	// Get unique values for category filter
	const categories = [...new Set(activities.map(a => a.category))];

	// Date formatter function
	function formatActivityDate(dateTimeString: string): string {
		if (!dateTimeString) return '';

		try {
			const date = new Date(dateTimeString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch (e) {
			console.error('Error formatting date:', e);
			return dateTimeString;
		}
	}

	// Create a derived version with formatted dates
	const activitiesWithFormattedDates = $derived(
		activities.map(activity => ({
			...activity,
			formatted_date: formatActivityDate(activity.date_time)
		}))
	);

	// Filtered data
	let filteredData = $state(activitiesWithFormattedDates);

	// Apply filters
	$effect(() => {
		const search = filter.main?.toLowerCase();

		filteredData = activitiesWithFormattedDates.filter(activity => {
			const matchesMain =
				!search || Object.values(activity).some(val =>
					String(val).toLowerCase().includes(search)
				);

			const matchesSpecific =
				(!filter.category || activity.category === filter.category) &&
				(!filter.objective || activity.objective.toLowerCase().includes(filter.objective.toLowerCase())) &&
				(!filter.target_activity || activity.target_activity.toLowerCase().includes(filter.target_activity.toLowerCase())) &&
				(!filter.activity_name || activity.activity_name.toLowerCase().includes(filter.activity_name.toLowerCase())) &&
				(!filter.date_from || activity.date_time >= filter.date_from) &&
				(!filter.date_to || activity.date_time <= filter.date_to) &&
				(!filter.target_participants ||
					(activity.target_participants !== null &&
						activity.target_participants.toString().includes(filter.target_participants))) &&
				(!filter.actual_participants ||
					(activity.actual_participants !== null &&
						activity.actual_participants.toString().includes(filter.actual_participants)));

			return matchesMain && matchesSpecific;
		});
	});

	function resetFilters() {
		filter = {
			main: "",
			category: "",
			objective: "",
			target_activity: "",
			activity_name: "",
			date_from: "",
			date_to: "",
			target_participants: "",
			actual_participants: ""
		};
		filteredData = activitiesWithFormattedDates;
	}
</script>

<Header category="events" page="actual" />

<section id="main">
	<FilterSearch bind:searchedValue={filter.main} addLink="/activities/add">
		<div slot="modal">
			<!-- Category remains as dropdown -->
			<Select label="Category" options={categories} bind:value={filter.category} margin={false} />
			<InputText label="Objective" bind:value={filter.objective} margin={false} />
			<InputText label="Target Activity" bind:value={filter.target_activity} margin={false} />
			<InputText label="Activity Name" bind:value={filter.activity_name} margin={false} />
			<InputText type="date" label="Date From" bind:value={filter.date_from} margin={false} />
			<InputText type="date" label="Date To" bind:value={filter.date_to} margin={false} />
			<InputText type="number" label="Target Participants" bind:value={filter.target_participants} margin={false} />
			<InputText type="number" label="Actual Participants" bind:value={filter.actual_participants} margin={false} />

			<div id="reset" class="flex justify-end">
				<button onclick={resetFilters}>Reset Filters</button>
			</div>
		</div>
	</FilterSearch>

	<br>
	<Table
		data={filteredData}
		headers={['Category', /*'Objective',*/ 'Target Activity', 'Activity Name', 'Date', 'Target', 'Actual']}
		includedKeys={['category', /*'objective',*/ 'target_activity', 'activity_name', 'formatted_date', 'target_participants', 'actual_participants']}
	/>
</section>