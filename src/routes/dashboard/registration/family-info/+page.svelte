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
	import type { FamilyMembers, CaregiverError, NewCaregiver } from '$lib/types/registrationForm.js';
	import { onMount } from 'svelte';

	import type { PageData } from '../../../../../.svelte-kit/types/src/routes/$types.js';
	import { dropdownOptions } from '$lib/types/options.js';
	import ExistingForm from './ExistingForm.svelte';


	/**
	 * note: /dashboard/registration and /registration is just the same, the constant is to hide
	 * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
	 * staffView = false if it is the parent who is accessing the page
	 * staffView = true if it is the staff who is accessing the page
	 */
	const staffView = /dashboard/i.test(page.url.pathname);

	// get the url parameters
	const url = {
		familyId: page.url.searchParams.get('family'),
		childId: page.url.searchParams.get('cwd')
	}

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

	let familyMembers: FamilyMembers = $state(
		 {
			hasExisting: !!url.familyId,
			linkedFamily: {
				type: 'linked',
				family_id: url.familyId,
				firstName: "",
				lastName: "",
				contactNo: "",

				// info of a list of family members which are linked to the searched family member
				infoLinked: []
			},
			newCaregivers: []
		}
	)

	// $inspect(familyMembers)

	let caregiverErrors = $derived<CaregiverError[]>(
		familyMembers.newCaregivers.map(() => ({
			firstName: '',
			lastName: '',
			sex: '',
			contactNo: '',
			address: '',
			brgy: '',
			communityYr: '',
			msg: ''
		}))
	);
	let linkedFamilyError = $state('')	// default no errors
	let showtable: boolean = $state(false); // for the existing family table
	let childId = url.childId, memberId, familyId = url.familyId;	// for the posts
	$effect(() => console.log("relavent ids: ", childId, memberId, familyId))

	// pre-populate the family information based on URL
	onMount(async () => {
		console.log('URL params:', url);
		if (url.familyId) {
			await handleFamilyIdParam(url.familyId);		// pre-populate family information
		}
		if (url.childId) {
			await handleChildIdParam(url.childId);
		}
	})

	async function handleFamilyIdParam(familyId: string) {
		console.log('handleFamilyIdParam called with:', familyId);
		try {
			// find all the members with the family id from the URL
			const familyMembers_found = members.filter(m => m.family_id === familyId);

			// set family as existing and populate the linked info
			if (familyMembers_found.length > 0) {
				familyMembers.hasExisting = true;
				familyMembers.linkedFamily.family_id = familyId;
				familyMembers.linkedFamily.infoLinked = familyMembers_found.map(member => ({
					member_id: member.member_id,
					caregiver_id: null,						// TODO: fill this with caregiverid
					firstName: member.firstName,
					lastName: member.lastName,
					contactNo: member.contactNo,
					relationship: member.relationship || ''
				}))

				console.log(`loaded ${familyMembers.linkedFamily.infoLinked.length}`)
				showtable = true;
			}
		} catch (error) {
			console.error('Error handling familyid parameter:', error)
		}
	}

	async function handleChildIdParam(childId: string) {
		// call the api to get the information
		const childRecRes = await fetch(`/api/children/${childId}`)
		const childRecord = await childRecRes.json()
		console.log('childRecord: ', childRecord)
		memberId = childRecord.member_id

		// get the member id (need for famly)
		const famMemRes = await fetch(`/api/family_members?member_id=${memberId}`)
		const famMemberRecord = await famMemRes.json()
		console.log('familyMemberRecord: ', famMemberRecord)
		familyId = famMemberRecord.data[0].family_id

		await handleFamilyIdParam(familyId)

	}


	function addNewCaregiver() {
		const newCaregiver = {
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
		};

		const newError = {
			firstName: '',
			lastName: '',
			sex: '',
			contactNo: '',
			brgy: '',
			address: '',
			communityYr: '',
			msg: ''
		};

		familyMembers.newCaregivers = [...familyMembers.newCaregivers, newCaregiver];
		caregiverErrors = [...caregiverErrors, newError];
	}

	/**
	 * deletes item from the array (reflected on the ui too)
	 * @param index
	 */
	function deleteCaregiver(index: number) {
		const newCaregivers = [];
		const newErrors = [];

		for (let i = 0; i < familyMembers.newCaregivers.length; i++) {
			if (i !== index) {
				newCaregivers.push(familyMembers.newCaregivers[i]);
				newErrors.push(caregiverErrors[i]);
			}
		}

		familyMembers.newCaregivers = newCaregivers;
		caregiverErrors = newErrors;
	}

	// validates the caregiver form data
	function validateForm(): boolean {
		let isValid = true;

		// validation for existing
		if (familyMembers.hasExisting) {
			const hasLinkedMembers = (familyMembers.linkedFamily?.infoLinked?.length ?? 0) > 0;
			if (!hasLinkedMembers) {
				isValid = false;
				linkedFamilyError = "Please have at least one family member";
			} else {
				linkedFamilyError = "";
			}
		}

		// validation for new caregivers

		caregiverErrors = familyMembers.newCaregivers.map((caregiver) => {
			const errors = {
				firstName: !caregiver.firstName.trim() ? 'Required' : '',
				lastName: !caregiver.lastName.trim() ? 'Required' : '',
				sex: !caregiver.sex ? 'Required' : '',
				contactNo: !caregiver.contactNo.trim() ? 'Required' : '',
				address: !caregiver.address.trim() ? 'Required' : '',
				brgy: !caregiver.brgy ? 'Required' : '',
				communityYr: '',
				msg: ''
			};

			// check if any error messages are present to invalidate the form
			if (Object.values(errors).some(msg => msg)) {
				isValid = false;
			}

			return errors;
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
			console.log("NEW CWD: ", childRegData)
			console.log("INFO ON FAMILY: ", familyMembers)

			/*
			note there are 3 views,
			0. url without family id nor child id: default, register new cwd
			1. url with family id: it is the caregiver view, autofill the linked family, there is no "new" child
					purpose: to link caregiver to family
			2. url with child id (also needs family id): old child, already has linked family,
					purpose: to add new caregiver and edit the relationship_cc
			 */


			// CODE BLOCK #1: SUBMITTING CWD DATA (of previous page)
			// bypass if: has family id and has child id
			if (url.familyId == null && url.childId == null) {
				// insert address
				const addressData = await safeFetch('/api/addresses', childRegData.address);
				console.log(addressData.message);
				childRegData.member!.address_id = addressData.data.id;

				// insert barangay
				const barangayData = await safeFetch('/api/barangays', childRegData.barangay);
				console.log('Barangay ', barangayData.message);
				childRegData.member!.barangay_id = barangayData.data.id;

				// insert member
				const memberData = await safeFetch('/api/members', childRegData.member);
				console.log(memberData.message);
				memberId = memberData.data.id;

				var pwdId = null;

				// insert PWD ID
				if (childRegData.pwd_id !== undefined) {
					const pwdIdData = await safeFetch('/api/pwd_ids', childRegData.pwd_id);
					console.log(pwdIdData.message);
					pwdId = pwdIdData.data.id;
				}

				// insert child info
				childRegData.child!.member_id = memberId;
				childRegData.child!.pwd_id = pwdId;
				const childData = await safeFetch('/api/children', childRegData.child);
				console.log(childData.message);
				childId = childData.data.id;

				// insert education status
				if (childRegData.education_status !== undefined) {
					childRegData.education_status!.child_id = childId;
					const eduStatusData = await safeFetch('/api/education_status', childRegData.education_status);
					console.log(eduStatusData.message);
				}

				// insert social protection status (for community group)
				if (childRegData.social_participation_com !== undefined) {
					childRegData.social_participation_com!.child_id = childId;
					const socProtStatusDataCom = await safeFetch('/api/social_participation', childRegData.social_participation_com);
					console.log(socProtStatusDataCom.message);
				}

				// insert social participation status (for family life)
				if (childRegData.social_participation_fam !== undefined) {
					childRegData.social_participation_fam!.child_id = childId;
					const socProtStatusDataFam = await safeFetch('/api/social_participation', childRegData.social_participation_fam);
					console.log(socProtStatusDataFam.message);
				}

				// insert employment status
				if (childRegData.employment_status !== undefined) {
					childRegData.employment_status!.member_id = memberId;
					const empStatusData = await safeFetch('/api/employment_status', childRegData.employment_status);
					console.log(empStatusData.message);
				}
			}

			// for family

			// CODE BLOCK #2.0: REUSING FAMILY ID FROM LINKED MEMBERS
			if (familyMembers.hasExisting && familyMembers.linkedFamily != null) {
				// get the family id of the existing family
				const familyId = familyMembers.linkedFamily.family_id;

				// TODO: create new relationships for each child-familyMember relationship which isn't null
				// if (familyMembers.hasExisting && familyMembers.linkedFamily?.infoLinked) {
				// 	for (const linkedMember of familyMembers.linkedFamily.infoLinked) {
				// 		if (linkedMember.relationship && linkedMember.relationship.trim() !== '') {
				// 			const relationshipData = await safeFetch('/api/relationship_cc', {
				// 				caregiver: linkedMember.member_id,
				// 				child: childId,
				// 				relationship: linkedMember.relationship
				// 			});
				// 			console.log(relationshipData.message)
				// 		}
				// 	}
				// }

				// add the child and caregivers to the newly created family
				await POST_family(childId, memberId, familyId)


			} // CODE BLOCK #2.1: CREATING NEW FAMILY ID
			else {
				// create a new family
				const familyData = await safeFetch('/api/families', null);

				console.log(familyData.message, familyData.data.id)
				const familyId = familyData.data.id

				// add the child and caregivers to the newly created family
				await POST_family(childId, memberId, familyId)

			}


			console.log('All data successfully inserted!');
			alert('All data sucessfully inserted!');

			if (staffView) goto('/dashboard');			// back to dashboard if previous view is dashboard
			else goto('/'); // back to main page if previous view is main page

		} catch (err) {
			console.error('Submission failed:', err);
			alert('Submission failed')
		}

		async function POST_family(child_id: string | null, member_id: string, family_id: string) {

			// CODE BLOCK #3: ADD CHILD TO FAMILY MEMBERS RECORD
			// bypass if: caregiver (has familyid, but no childid)
			console.log(familyId, family_id)
			console.log("is caregiver:", !(url.familyId != null && url.childId == null) )
			console.log("is cwd and famliy diff:", (url.childId != null && familyId  != family_id) )
			console.log("is cwd and famliy diff:", url.familyId == null && url.childId == null
				, " || ", !(url.familyId != null && url.childId == null) 		// if not caregiver
				, " && ", (url.childId != null && familyId  != family_id))


			if (url.familyId == null && url.childId == null
				|| !(url.familyId != null && url.childId == null) 		// if child ..
				&& (url.childId != null && familyId  != family_id)) {	// .. and its family changed
				console.log("inserting:", child_id, member_id, family_id);

				// TODO: if existing child, delete its old family_members record

				if (!(url.familyId != null && url.childId == null) 		// if child exists
					&& (url.childId != null && familyId != family_id)) {	// and family is changing

					console.log('Child is changing families - deleting old family record');

					// Delete the old family_members record
					try {
						const deleteRes = await fetch('/api/family_members', {
							method: 'DELETE',
							body: JSON.stringify({
								family_id: familyId, // old family ID
								member_id: member_id
							}),
							headers: { 'Content-Type': 'application/json' }
						});

						if (deleteRes.ok) {
							const deleteResult = await deleteRes.json();
							console.log('Old family record deleted:', deleteResult);
						} else {
							console.warn('Failed to delete old family record');
						}
					} catch (error) {
						console.error('Error deleting old family record:', error);
					}
				}

				// add the child to the existing family (POST to family_members)
				const famChildData = await safeFetch('/api/family_members', {
					is_child: true,
					member_id: member_id,
					family_id: family_id
				});
				console.log('Child added to family:', famChildData.message);
			}


			// CODE BLOCK #4: ADD ALL NEW CAREGIVERS TO THE EXISTING FAMILY
			// bypass if: [no scenarios]
			for (const [i, newCaregiver] of familyMembers.newCaregivers.entries()) {
				// add all the caregivers to the db (POST to member, and POST to caregivers)
				const caregiverMember = await POST_caregiver(newCaregiver);

				// add the caregivers to the existing family
				const famMemData = await safeFetch('/api/family_members', {
					is_child: false,
					member_id: caregiverMember.member_id,
					family_id: family_id
				});
				console.log(newCaregiver.firstName, ' added to family: ', famMemData.message)

				// add the relationship of caregivers to child IF NOT EMPTY
				// bypass if: family view
				if (url.childId != null && newCaregiver.relationship && newCaregiver.relationship.trim() !== '') {
					const relationshipData = await safeFetch('/api/relationship_cc', {
						caregiver: caregiverMember.caregiver_id,
						child: child_id,
						relationship: newCaregiver.relationship
					});
					console.log(relationshipData.message)
				}
			}
		}

		// CODE BLOCK #5: INSERT NEW CAREGIVER
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
			console.log("member:" , {
				first_name: caregiver.firstName,
				last_name: caregiver.lastName,
				birthday: caregiver.bday || null,
				sex: caregiver.sex,
				admission_date: childRegData?.member?.admission_date ??  new Date().toISOString(), 	// makes it the same as the child
				address_id: address_id,
				barangay_id: barangay_id
			})
			const memberData = await safeFetch('/api/members', {
				first_name: caregiver.firstName,
				last_name: caregiver.lastName,
				birthday: caregiver.bday || null,
				sex: caregiver.sex,
				admission_date: childRegData?.member?.admission_date ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), 	// makes it the same as the child
				address_id: address_id,
				barangay_id: barangay_id
			});
			console.log(memberData.message)
			const member_id = memberData.data.id;

			// create the caregiver record for the caregiver
			const caregiverData = await safeFetch('/api/caregivers', {
				contact_number: caregiver.contactNo.replace(/\s/g, ''),
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
				console.log("Community group: ", comGrpData.message)
			}

			// create the income type record
			if (caregiver.income != null && caregiver.income !== "") {
				const incomeData = await safeFetch('/api/income_type', {
					income_category: caregiver.income,
					date_start: new Date(),
					caregiver_id: caregiver_id
				})
				console.log("Income: ", incomeData.message)
			}

			return {
				member_id: memberData.data.id,
				caregiver_id: caregiver_id
			};
		}


	}
</script>
{#if staffView}
	<Header category="members" page="children" />
{/if}
<section id="family-info">
	<h1>Family Information</h1>

	<ExistingForm bind:formData={familyMembers} error_msg={linkedFamilyError} members={members} bind:showtable={showtable} />

	{#each familyMembers.newCaregivers as _, index (index)}
		<CaregiverForm
			bind:formData={familyMembers.newCaregivers[index]}
			errors={caregiverErrors[index]}
			{index}
			deleteCaregiver={deleteCaregiver}
			{options}
		/>
	{/each}

	<br>
	<button id="caregiver-1" onclick={addNewCaregiver}>Add new caregiver</button>

</section>

<section style="text-align: center;">
	<button onclick={() => location.href = 'child'}>Back</button>

	<button class="green" onclick="{handleSubmit}">Submit</button>
</section>