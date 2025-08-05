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
	import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';
	import Validation from '$components/text/Validation.svelte';


	/**
	 * note: /dashboard/registration and /registration is just the same, the constant is to hide
	 * whether components will be shown or hidden based on if the view is for staff or if the view is for parents
	 * staffView = false if it is the parent who is accessing the page
	 * staffView = true if it is the staff who is accessing the page
	 */
	const staffView = /dashboard/i.test(page.url.pathname);

	// get the url parameters
	const url = {
		caregiverId: page.url.searchParams.get('caregiver'),
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
	console.log("members: ", members)

	let familyMembers: FamilyMembers = $state(
		 {
			hasExisting: false,
			linkedFamily: {
				type: 'linked',
				family_id: "",
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
			email: '',
			address: '',
			brgy: '',
			communityYr: '',
			msg: ''
		}))
	);
	let linkedFamilyError = $state('');	// default no errors
	let mainError = $state('');
	let showTable: boolean = $state(false); // for the existing family table
	let childId = url.childId, memberId: string, familyId: string, caregiverId = url.caregiverId;	// for the posts
	let isNewChild = url.childId == null && url.caregiverId == null;
	let loadingSubmission = $state(false);
	$effect(() => console.log("relavent ids: ", childId, memberId, familyId))

	// pre-populate the family information based on URL
	onMount(async () => {
		console.log('URL params:', url);
		if (url.caregiverId) {
			await handleCaregiverIdParam(url.caregiverId);		// pre-populate family information
		}
		if (url.childId) {
			await handleChildIdParam(url.childId);
		}
	})

	async function handleFamilyIdParam(familyId: string) {
		console.log('handleFamilyIdParam called with:', familyId);
		try {
			// find all the members with the family id from the URL
			const familyMembersFound = members.filter(m => m.family_id === familyId);

			// set family as existing and populate the linked info
			if (familyMembersFound.length > 0) {
				familyMembers.hasExisting = true;
				familyMembers.linkedFamily.family_id = familyId;
				familyMembers.linkedFamily.infoLinked = familyMembersFound.map(member => ({
					member_id: member.member_id,
					caregiver_id: member.caregiver_id,
					firstName: member.firstName,
					lastName: member.lastName,
					contactNo: member.contactNo,
					relationship: member.relationship || ''
				}))

				console.log(`loaded ${familyMembers.linkedFamily.infoLinked.length}`)
				showTable = true;
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

	async function handleCaregiverIdParam(caregiverId: string) {
		// call the api to get the information
		const caregiverRecRes = await fetch(`/api/caregivers/${caregiverId}`)
		const caregiverRecord = await caregiverRecRes.json()
		console.log('caregiverRecord: ', caregiverRecord)
		memberId = caregiverRecord.member_id

		// get the member id (need for famly)
		const famMemRes = await fetch(`/api/family_members?member_id=${memberId}`)
		const famMemberRecord = await famMemRes.json()
		console.log('familyMemberRecord: ', famMemberRecord)
		familyId = famMemberRecord.data[0].family_id

		await handleFamilyIdParam(familyId)

	}

	// cleans the contact number, used for validation and posting the data
	const cleanContactNumber = (contactNo: string): string => {
		return contactNo.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
	};

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
			email: '',
			brgy: '',
			address: '',
			communityYr: '',
			msg: ''
		};

		familyMembers.newCaregivers = [...familyMembers.newCaregivers, newCaregiver];
		caregiverErrors = [...caregiverErrors, newError];
		console.log(familyMembers)
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

		// base submission requirements: must have (1) existing family w/ 1+ members, (2) 1+ new caregiver
		const hasExistingFamily = familyMembers.hasExisting && (familyMembers.linkedFamily?.infoLinked?.length ?? 0) > 0;
		const hasNewCaregivers = familyMembers.newCaregivers.length > 0;

		if (!hasExistingFamily && !hasNewCaregivers) {
			isValid = false;
			mainError = "Please either select an existing family member or add at least one new caregiver";
		} else {
			mainError = "";
		}

		// validation for existing
		if (familyMembers.hasExisting && !hasExistingFamily) {
			isValid = false;
			linkedFamilyError = "Please select at least one family member from the existing family";
		}

		// new caregiver helper function: for email validation
		const isValidEmail = (email: string): boolean => {
			if (!email.trim()) return true; // Email is optional, so empty is valid
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		};
		// new caregiver helper function: for contact no validation
		const isValidContactNumber = (contactNo: string): boolean => {
			if (!contactNo.trim()) return false; 			// Contact number is required
			const mobileRegex = /^09\d{9}$/; 					// Philippine mobile number format: starts with 09 and has 11 digits total
			const landlineRegex = /^0\d{1,2}\d{7}$/; 	// Or landline format: area code + 7 digits
			const cleanNumber = cleanContactNumber(contactNo); // Remove spaces, dashes, parentheses
			return mobileRegex.test(cleanNumber) || landlineRegex.test(cleanNumber);
		};


		// validation for new caregivers
		caregiverErrors = familyMembers.newCaregivers.map((caregiver) => {
			const errors = {
				firstName: !caregiver.firstName.trim() ? 'Required' : '',
				lastName: !caregiver.lastName.trim() ? 'Required' : '',
				sex: !caregiver.sex ? 'Required' : '',
				contactNo: !caregiver.contactNo.trim() ? 'Required' :
					!isValidContactNumber(caregiver.contactNo) ? 'Invalid phone number format' : '',
				email: !isValidEmail(caregiver.email) ? 'Invalid email format' : '',
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
	async function safeFetch<T = any>(method: 'POST' | 'PUT', url: string, payload: any): Promise<T> {
		const res = await fetch(url, {
			method,
			body: JSON.stringify(payload),
			headers: { 'Content-Type': 'application/json' }
		});
		if (!res.ok) {
			const error = await res.text();
			throw new Error(`Failed to ${method} ${url}: ${error}`);
		}
		return await res.json();
	}

	// handles the submission of both child-info and family-info
	async function handleSubmit() {
		loadingSubmission = true;
		try {
			if (!validateForm()) {
				goto('#family-info');    // scrolls to top
				loadingSubmission = false;
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
			if (url.caregiverId == null && url.childId == null) {
				// insert address
				const addressData = await safeFetch('POST', '/api/addresses', childRegData.address);
				console.log(addressData.message);
				childRegData.member!.address_id = addressData.data.id;

				// insert barangay
				const barangayData = await safeFetch('POST', '/api/barangays', childRegData.barangay);
				console.log('Barangay ', barangayData.message);
				childRegData.member!.barangay_id = barangayData.data.id;

				// insert member
				const memberData = await safeFetch('POST', '/api/members', childRegData.member);
				console.log(memberData.message);
				memberId = memberData.data.id;

				var pwdId = null;

				// insert PWD ID
				if (childRegData.pwd_id !== undefined) {
					const pwdIdData = await safeFetch('POST', '/api/pwd_ids', childRegData.pwd_id);
					console.log(pwdIdData.message);
					pwdId = pwdIdData.data.id;
				}

				// insert child info
				childRegData.child!.member_id = memberId;
				childRegData.child!.pwd_id = pwdId;
				const childData = await safeFetch('POST', '/api/children', childRegData.child);
				console.log(childData.message);
				childId = childData.data.id;

				// insert education status
				if (childRegData.education_status !== undefined) {
					childRegData.education_status!.child_id = childId;
					const eduStatusData = await safeFetch('POST', '/api/education_status', childRegData.education_status);
					console.log(eduStatusData.message);
				}

				// insert social protection status (for community group)
				if (childRegData.social_participation_com !== undefined) {
					childRegData.social_participation_com!.child_id = childId;
					const socProtStatusDataCom = await safeFetch('POST', '/api/social_participation', childRegData.social_participation_com);
					console.log(socProtStatusDataCom.message);
				}

				// insert social participation status (for family life)
				if (childRegData.social_participation_fam !== undefined) {
					childRegData.social_participation_fam!.child_id = childId;
					const socProtStatusDataFam = await safeFetch('POST', '/api/social_participation', childRegData.social_participation_fam);
					console.log(socProtStatusDataFam.message);
				}

				// insert employment status
				if (childRegData.employment_status !== undefined) {
					childRegData.employment_status!.member_id = memberId;
					const empStatusData = await safeFetch('POST', '/api/employment_status', childRegData.employment_status);
					console.log(empStatusData.message);
				}
			}

			// for family

			// CODE BLOCK #2.0: REUSING FAMILY ID FROM LINKED MEMBERS
			if (familyMembers.hasExisting && familyMembers.linkedFamily != null) {
				// get the family id of the existing family
				const familyId = familyMembers.linkedFamily.family_id;

				// update relationships in family_members
				if (familyMembers.hasExisting && familyMembers.linkedFamily?.infoLinked) {
					for (const linkedMember of familyMembers.linkedFamily.infoLinked) {
							const relationshipData = await safeFetch('PUT', '/api/family_members', {
								member_id: linkedMember.member_id,
								family_id: familyId,
								relationship_type: linkedMember.relationship
							});
							console.log(relationshipData.message)
					}
				}

				// add the child and caregivers to the newly created family
				await POST_family(familyId)


			} // CODE BLOCK #2.1: CREATING NEW FAMILY ID
			else {
				// create a new family
				const familyData = await safeFetch('POST', '/api/families', null);

				console.log(familyData.message, familyData.data.id)
				const familyId = familyData.data.id

				// add the child and caregivers to the newly created family
				await POST_family(familyId)

			}


			console.log('All data successfully inserted!');
			alert('All data sucessfully inserted!');

			if (staffView) goto('/dashboard');			// back to dashboard if previous view is dashboard
			else goto('/'); // back to main page if previous view is main page

		} catch (err) {
			loadingSubmission = false;
			console.error('Submission failed:', err);
			alert('Submission failed')
		}

		async function POST_family(newFamilyId: string) {
			let isChild = childId != null
			let oldChildNewFamily = (url.childId != null && familyId != newFamilyId)
			let oldCareNewFamily = (url.caregiverId != null && familyId != newFamilyId)

			// CODE BLOCK #3: ADD MEMBER TO FAMILY MEMBERS RECORD
			// if currently exists in a family, delete its old family_members record
			if ((oldChildNewFamily	|| oldCareNewFamily) && familyId != null) {
				console.log('Child/Caregiver is changing families - deleting old family record');
				// #1 delete old family first
				try {
					const deleteRes = await fetch('/api/family_members', {
						method: 'DELETE',
						body: JSON.stringify({
							family_id: familyId, // old family ID
							member_id: memberId
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

				// update the record in family_members
				const famMemData = await safeFetch('PUT', '/api/family_members', {
					is_child: isChild,
					member_id: memberId,
					family_id: newFamilyId
				});
				console.log('Member updated to family:', famMemData.message);
				familyId = newFamilyId
			}
			// add the child to the existing family (POST to family_members) if new registration
			else if (isNewChild) {
				const famMemData = await safeFetch('POST', '/api/family_members', {
					is_child: isChild,
					member_id: memberId,
					family_id: newFamilyId,
					relationship_type: isChild ? "CWD" : "Caregiver"
				});
				console.log('Member added to family:', famMemData.message);
				familyId = newFamilyId
			}


			// CODE BLOCK #4: ADD ALL NEW CAREGIVERS TO THE EXISTING FAMILY
			for (const [i, newCaregiver] of familyMembers.newCaregivers.entries()) {
				// add all the caregivers to the db (POST to member, and POST to caregivers)
				const caregiverMember = await POST_caregiver(newCaregiver);

				// add the caregivers to the existing family
				const famMemData = await safeFetch('POST', '/api/family_members', {
					is_child: false,
					member_id: caregiverMember.member_id,
					family_id: newFamilyId,
					relationship_type: newCaregiver.relationship.trim() !== "" ? newCaregiver.relationship : "Caregiver"
				});
				console.log(newCaregiver.firstName, ' added to family: ', famMemData.message)
			}
		}

		// CODE BLOCK #5: INSERT NEW CAREGIVER
		async function POST_caregiver(caregiver: NewCaregiver) {
			console.log("... inserting: ", $state.snapshot(caregiver))
			// insert address
			const addressData = await safeFetch('POST', '/api/addresses', { address: caregiver.address });
			console.log(addressData.message)
			const address_id = addressData.data.id;

			// insert barangay
			const barangayData = await safeFetch('POST', '/api/barangays', { name: caregiver.brgy });
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
			const memberData = await safeFetch('POST', '/api/members', {
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
			const caregiverData = await safeFetch('POST', '/api/caregivers', {
				contact_number: cleanContactNumber(caregiver.contactNo),
				facebook_link: caregiver.fbLink,
				email: caregiver.email,
				occupation: caregiver.occupation,
				member_id: member_id
			})
			console.log(caregiverData.message)
			const caregiver_id = caregiverData.data.id;

			// create the caregiver_groups record
			if (caregiver.communityGrp_id != null) {
				const comGrpData = await safeFetch('POST', '/api/caregiver_groups', {
					date_joined: new Date(caregiver.communityYr, 0, 1),	// converts year into january
					community_group_id: caregiver.communityGrp_id,
					caregiver_id: caregiver_id
				})
				console.log("Community group: ", comGrpData.message)
			}

			// create the income type record
			if (caregiver.income != null && caregiver.income !== "") {
				const incomeData = await safeFetch('POST', '/api/income_type', {
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

	<ExistingForm bind:formData={familyMembers} error_msg={linkedFamilyError} members={members} bind:showTable={showTable} isChildView={url.caregiverId == null}/>

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
	{#if loadingSubmission}
		<LoadingBtn label="Submit" />
	{:else}
		<Validation msg={mainError} />
		<button class="green" onclick={handleSubmit}>Submit</button>
	{/if}
</section>