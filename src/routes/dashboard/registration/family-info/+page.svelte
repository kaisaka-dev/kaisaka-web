<script lang="ts">
	/**
	 * NOTE: THIS PAGE IS EXACTLY THE SAME FOR /dashboard/registration/family-info and /registration/family-info
	 * when editing this page, just copy the file and move it to its counterpart in the other folder
	 */
	import Header from '$components/Header.svelte';
	import CaregiverForm from './CaregiverForm.svelte';
	import { childFormData } from '$lib/stores/childForm.js';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { Caregiver, CaregiverError, NewCaregiver, LinkedCaregiver } from './+page.server.js';
	import type { PageData } from '../../../../../.svelte-kit/types/src/routes/$types.js';
	import { dropdownOptions } from '$lib/types/options.js';


	/**
	 * note: /dashboard/registration and /registration is just the same, the constant is to hide
	 * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
	 * staffView = false if it is the parent who is accessing the page
	 * staffView = true if it is the staff who is accessing the page
	 */
	const staffView = /dashboard/i.test(page.url.pathname);
	const childRegData = get(childFormData)
	console.log(childRegData);


	// load the data
	const { data } = $props<{ data: PageData }>();
	const options = $state({
		comGroupType: data.options.comGroupType,
		incomeType: dropdownOptions.income_category,
		sex: dropdownOptions.sex
	});
	const members = $state(data.members)


	let caregivers = $state<Caregiver[]>([
		{
			type: 'new', // explicit discriminator
			firstName: '',
			lastName: '',
			bday: '',
			sex: '',
			contactNo: '',
			fbLink: '',
			email: '',
			address: '',
			brgy: '',
			occupation: '',
			relationship: '',
			communityGrp_id: null,
			income: '',
			communityYr: new Date().getFullYear()
		}
	]); // initialize variable so that the page will have at least one caregiver

	$inspect(caregivers)

	let caregiverErrors = $derived<CaregiverError[]>(
		caregivers.map(() => ({
				firstName: '',
				lastName: '',
				sex: '',
				contactNo: '',
				address: '',
				brgy: '',
				msg: ''
		}))
	);

	function addNewCaregiver() {
		caregivers = [
			...caregivers,
			{
				type: 'new',
				firstName: '',
				lastName: '',
				bday: '',
				sex: '',
				contactNo: '',
				fbLink: '',
				email: '',
				address: '',
				brgy: '',
				occupation: '',
				relationship: '',
				communityGrp_id: null,
				income: '',
				communityYr: new Date().getFullYear()
			}
		];

		caregiverErrors = [
			...caregiverErrors,
			{
				firstName: '',
				lastName: '',
				sex: '',
				contactNo: '',
				brgy: '',
				address: '',
				msg: ''
			}
		];
	}

	/**
	 * deletes item from the array (reflected on the ui too)
	 * @param index
	 */
	function deleteCaregiver(index: number) {
		caregivers = caregivers.filter((_, i) => i !== index);
		caregiverErrors = caregiverErrors.filter((_, i) => i !== index);
	}

	/**
	 * checks if a linked caregiver exists
	 * returns the index if a family is linked
	 * returns -1 if not
	 */
	let linkedIndex = $derived(caregivers.findIndex(g => g.type === 'linked'));

	// validates the caregiver form data
	function validateForm(): boolean {
		let isValid = true;

		caregiverErrors = caregivers.map((caregiver) => {
			// ensures at least 1 existing family member
			if (caregiver.type === 'linked') {
				if (!caregiver.infoLinked || caregiver.infoLinked.length === 0) {
					isValid = false;
					return { msg: "Please have at least one family member" };
				}
				return { msg: '' };
			} else {
				const errors = {
					firstName: !caregiver.firstName.trim() ? 'Required' : '',
					lastName: !caregiver.lastName.trim() ? 'Required' : '',
					sex: !caregiver.sex ? 'Required' : '',
					contactNo: !caregiver.contactNo.trim() ? 'Required' : '',
					address: !caregiver.address.trim() ? 'Required' : '',
					brgy: !caregiver.brgy ? 'Required' : '',
				};
				if (Object.values(errors).some(msg => msg)) isValid = false;
				return errors;
			}
		});

		return isValid;
	}

	// called by handle submit whenever calling the POST api
	async function safeFetch<T = any>(url: string, payload: any): Promise<T> {
		const res = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: { 'Content-Type': 'application/json' }
		});
		if (!res.ok) {
			const error = await res.text();
			throw new Error(`Failed to POST ${url}: ${error}`);
		}
		return await res.json();
	}

	// handles the submission of both child-info and family-info
	async function handleSubmit() {
		try {
			if (!validateForm()) {
				goto('#family-info');    // scrolls to top
				return;
			}
			console.log(childRegData)

			// insert address
			const addressData = await safeFetch('/api/addresses', childRegData.address);
			console.log(addressData.message)
			childRegData.member!.address_id = addressData.data.id;

			// insert barangay
			const barangayData = await safeFetch('/api/barangays', childRegData.barangay);
			console.log("Barangay ", barangayData.message)
			childRegData.member!.barangay_id = barangayData.data.id;

			// insert member
			const memberData = await safeFetch('/api/members', childRegData.member);
			console.log(memberData.message)
			const memberId = memberData.data.id;

			var pwdId = null;

			// insert PWD ID
			if(childRegData.pwd_id !== undefined){
				const pwdIdData = await safeFetch('/api/pwd_ids', childRegData.pwd_id);
				console.log(pwdIdData.message)
				pwdId = pwdIdData.data.id;
			}

			// insert child info
			childRegData.child!.member_id = memberId;
			childRegData.child!.pwd_id = pwdId;
			const childData = await safeFetch('/api/children', childRegData.child);
			console.log(childData.message)
			const childId = childData.data.id;

			// insert education status
			if(childRegData.education_status !== undefined) {
				childRegData.education_status!.child_id = childId;
				const eduStatusData = await safeFetch('/api/education_status', childRegData.education_status);
				console.log(eduStatusData.message)
			}

			// insert social protection status (for community group)
			if(childRegData.social_participation_com !== undefined) {
				childRegData.social_participation_com!.child_id = childId;
				const socProtStatusDataCom = await safeFetch('/api/social_participation', childRegData.social_participation_com);
				console.log(socProtStatusDataCom.message)
			}

			// insert social participation status (for family life)
			if(childRegData.social_participation_fam !== undefined) {
				childRegData.social_participation_fam!.child_id = childId;
				const socProtStatusDataFam = await safeFetch('/api/social_participation', childRegData.social_participation_fam);
				console.log(socProtStatusDataFam.message)
			}

			// insert employment status
			if(childRegData.employment_status !== undefined) {
				childRegData.employment_status!.member_id = memberId;
				const empStatusData = await safeFetch('/api/employment_status', childRegData.employment_status);
				console.log(empStatusData.message)
			}

			// for family

			// if linked family exists
			if (linkedIndex !== -1 && !isNewCaregiver(caregivers[linkedIndex])) {
				// get the family id of the existing family
				const familyId = caregivers[linkedIndex].family_id;

				// create new relationships for each child-familyMember relationship which isn't null

				// add the child and caregivers to the newly created family
				await POST_family(memberId, familyId)


			} // if registering a new family
			else {
				// create a new family
				const familyData = await safeFetch('/api/families', null);

				console.log(familyData.message, familyData.data.id)
				const familyId = familyData.data.id

				// add the child and caregivers to the newly created family
				await POST_family(memberId, familyId)


			}





			console.log('All data successfully inserted!');
			alert('All data sucessfully inserted!');

			if (staffView) goto('/dashboard');			// back to dashboard if previous view is dashboard
			else goto('/'); // back to main page if previous view is main page

		} catch (err) {
			console.error('Submission failed:', err);
			alert('Submission failed')
		}

		async function POST_family(member_id, family_id) {
			// add the child to the existing family (POST to family_members)
			const famChildData = await safeFetch('/api/family_members', {
				is_child: true,
				member_id: member_id,
				family_id: family_id
			});
			console.log('Child added to family:', famChildData.message);


			// add the other caregivers to the existing family
			for (const [i, caregiver] of caregivers.entries()) {
				if (isNewCaregiver(caregiver)) {
					// add all the caregivers to the db (POST to member, and POST to caregivers)
					const caregiverMember = await POST_caregiver(caregiver);

					// add the caregivers to the existing family
					const famMemData = await safeFetch('/api/family_members', {
						is_child: false,
						member_id: caregiverMember.id,
						family_id: family_id
					});
					console.log(caregiver.firstName, ' added to family: ', famMemData.message)
				}
			}
		}

		async function POST_caregiver(caregiver: NewCaregiver) {
			console.log("... inserting: ", caregiver)
			// insert address
			const addressData = await safeFetch('/api/addresses', { address: caregiver.address });
			console.log(addressData.message)
			const address_id = addressData.data.id;

			// insert barangay
			const barangayData = await safeFetch('/api/barangays', { name: caregiver.brgy });
			console.log("Barangay ", barangayData.message)
			const barangay_id = barangayData.data.id;

			// create the member record for caregiver
			const memberData = await safeFetch('/api/members', {
				first_name: caregiver.firstName,
				last_name: caregiver.lastName,
				birthday: caregiver.bday || null,
				sex: caregiver.sex,
				admission_date: childRegData.member.admission_date ?? `${new Date()}-01T00:00:00Z`, 	// makes it the same as the child
				address_id: address_id,
				barangay_id: barangay_id
			});
			console.log(memberData.message)
			const member_id = memberData.data.id;

			// create the caregiver record for the caregiver
			const caregiverData = await safeFetch('/api/caregivers', {
				contact_number: caregiver.contactNo,
				facebook_link: caregiver.fbLink,
				email: caregiver.email,
				occupation: caregiver.occupation,
				member_id: member_id
			})
			console.log(caregiverData.message)
			const caregiver_id = caregiverData.data.id;

			// create the caregiver_groups record
			if (caregiver.communityGrp_id != null) {
				const comGrpData = await safeFetch('/api/caregiver_groups', {
					date_joined: new Date(caregiver.communityYr, 0, 1),	// converts year into january
					community_group_id: caregiver.communityGrp_id,
					caregiver_id: caregiver_id
				})
				console.log(comGrpData.message)
			}

			// create the income type record
			if (caregiver.income != null && caregiver.income !== "") {
				const incomeData = await safeFetch('/api/income_type', {
					income_category: caregiver.income,
					date_start: new Date(),
					caregiver_id: caregiver_id
				})
				console.log(incomeData.message)
			}

			return memberData.data;
		}

		// helper functions
		// to identify the datatype of the caregiver
		function isNewCaregiver(caregiver: Caregiver): caregiver is NewCaregiver {
			return caregiver.type === 'new';
		}

	}
</script>
{#if staffView}
	<Header category="members" page="children" />
{/if}
<section id="family-info">
	<h1>Family Information</h1>

	{#each caregivers as caregiver, index (index + caregiver.firstName + caregiver.lastName + caregiver.contactNo + caregiver.type)}
		<CaregiverForm
			bind:formData={caregivers[index]}
			errors={caregiverErrors[index]}
			{index}
			{linkedIndex}
			deleteCaregiver={deleteCaregiver}
			options={options}
		/>
	{/each}

	<br>
	<button id="caregiver-1" onclick={addNewCaregiver}>Add another caregiver</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = 'child'}>Back</button>

	<button class="green" onclick="{handleSubmit}">Submit</button>
</section>