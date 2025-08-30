<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<script lang="ts">
	import { childFormData } from '$lib/stores/childForm.js';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import type { FamilyMembers, CaregiverError, NewCaregiver, NewChild, ChildError } from '$lib/types/registrationForm.js';
	import { onMount } from 'svelte';

	import { dropdownOptions } from '$lib/types/options.js';
	import LoadingBtn from '$components/styled-buttons/LoadingBtn.svelte';
	import Validation from '$components/text/Validation.svelte';
	import CaregiverForm from '$components/shared/registration/CaregiverForm.svelte';
	import ChildForm from '$components/shared/registration/ChildForm.svelte';
	import Modal from '$components/Modal.svelte';
	import ExistingForm from '$components/shared/registration/ExistingForm.svelte';

	// Props
	const { data, staffView, url } = $props<{
		data: any;
		staffView: boolean;
		url: { caregiverId: string | null, childId: string | null, familyId: string | null };
	}>();
	const pageHeight = staffView? "height: calc(100vh - 90px);" : "height: 100vh";	// makes way for the header

	const options = $state({
		comGroupType: data.options.comGroupType,
		incomeType: dropdownOptions.income_category,
		sex: dropdownOptions.sex,
		disability_category: data.options.disCategory,
		education_status: dropdownOptions.education_status,
		education_level: dropdownOptions.education_level,
		education_type: dropdownOptions.education_type,
		employment_type: dropdownOptions.employment_type
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

	// Children data structure
	let children: NewChild[] = $state([]);
	let childrenErrors: ChildError[] = $state([]);
	const thisYear = new Date().getFullYear();

	// $inspect(familyMembers)

	let caregiverErrors = $derived<CaregiverError[]>(
		familyMembers.newCaregivers.map(() => ({
			firstName: '',
			lastName: '',
			sex: '',
			bday: '',
			contactNo: '',
			email: '',
			address: '',
			brgy: '',
			communityYr: '',
			admissionDate: '',
			msg: ''
		}))
	);
	let linkedFamilyError = $state('');	// default no errors
	let mainError = $state('');
	let showTable: boolean = $state(false); // for the existing family table
	let showModalLink: boolean = $state(false); // for the link existing family modal
	let childId = url.childId, memberId: string, familyId: string, caregiverId = url.caregiverId;	// for the posts
	let isNewChild = url.childId == null && url.caregiverId == null;
	
	// Track which records are existing vs new for proper form disabling
	let existingChildIndex = -1;  // Index of existing child in children array
	let existingCaregiverIndex = -1;  // Index of existing caregiver in caregivers array
	let wasRemovedFromFamily = false;  // Track if member was removed from an existing family
	let form = $state({
		idx: -1,
		type: ""
	});
	let loadingSubmission = $state(false);
	$effect(() => console.log("relavent ids: ", childId, memberId, familyId))

	// pre-populate the family information based on URL
	onMount(async () => {
		console.log('URL params:', url);
		if (url.caregiverId) {
			await handleCaregiverIdParam(url.caregiverId, url.familyId);		// pre-populate family information
		}
		if (url.childId) {
			await handleChildIdParam(url.childId, url.familyId);
		}

		// Open link modal by default when page loads (if no existing family)
		if (!url.caregiverId && !url.childId && !familyMembers.hasExisting) {
			showModalLink = true;
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

	async function handleChildIdParam(childId: string, familyId?: string | null) {
		// call the api to get the information
		const childRecRes = await fetch(`/api/children/${childId}`)
		const childRecord = await childRecRes.json()
		console.log('childRecord: ', childRecord)
		memberId = childRecord.member_id

		// get the member information with address and barangay using joins
		const memberRes = await fetch(`/api/members/${memberId}?select=*, addresses(*), barangays(*)`)
		const memberRecord = await memberRes.json()
		console.log('memberRecord with joins: ', memberRecord)

		// get education records (may not exist for all children)
		let educationRecords = [];
		try {
			const educationRes = await fetch(`/api/education_status?id=${childId}`)
			if (educationRes.ok) {
				educationRecords = await educationRes.json()
				console.log('educationRecords: ', educationRecords)
			}
		} catch (error) {
			console.log('No education records found for child:', childId)
		}

		// get participation records (may not exist for all children)
		let participationRecords = [];
		try {
			const participationRes = await fetch(`/api/social_participation?child_id=${childId}`)
			if (participationRes.ok) {
				participationRecords = await participationRes.json()
			}
		} catch (error) {
			console.log('No participation records found for child:', childId)
		}

		// get employment status (may not exist for all members)
		let employmentRecord = null;
		try {
			const employmentRes = await fetch(`/api/employment_status?id=${memberId}`)
			if (employmentRes.ok) {
				employmentRecord = await employmentRes.json()
			}
		} catch (error) {
			console.log('No employment record found for member:', memberId)
		}

		// Create pre-populated child object
		const existingChild: NewChild = {
			first_name: memberRecord.first_name || '',
			middle_name: memberRecord.middle_name || '',
			last_name: memberRecord.last_name || '',
			birthday: memberRecord.birthday ? memberRecord.birthday.split('T')[0] : '',
			age: '',
			sex: memberRecord.sex || '',
			address: memberRecord.addresses?.address || '',
			barangay: memberRecord.barangays?.name || '',
			remarks: childRecord.remarks || '',
			date_admission: memberRecord.admission_date ? memberRecord.admission_date.slice(0, 7) : '',
			disability: {
				category_id: childRecord.disability_id || null,
				nature: childRecord.disability_nature || ''
			},
			education: (educationRecords && Array.isArray(educationRecords) && educationRecords.length > 0) 
				? educationRecords.map((edu: any) => ({
					type: edu.education_type || '',
					grade_level: edu.grade_level || '',
					status: edu.student_status_type || '',
					year_start: edu.year_start?.toString() || '',
					year_end: edu.year_end?.toString() || ''
				})) 
				: [{ type: 'Not enrolled', grade_level: '', status: '', year_start: '', year_end: '' }],
			has: {
				birth_cert: childRecord.has_birth_cert || false,
				medical_cert: childRecord.has_medical_cert || false,
				barangay_cert: childRecord.has_barangay_cert || false,
				philhealth: childRecord.has_philhealth || false,
				pwd_id: childRecord.pwd_id != null,
				pwd: {
					expiry_date: childRecord.pwd_id?.expiry_date || '',
					id: childRecord.pwd_id?.pwd_id || ''
				},
				vote: childRecord.has_vote || false,
				national_id: childRecord.has_national_id || false,
			},
			employment: {
				able_to_work: employmentRecord?.able_to_work || false,
				type: employmentRecord?.employment_type || ''
			},
			part: {
				family_life: false,
				fam_year: thisYear,
				community: false,
				com_year: thisYear
			},
			participation: (participationRecords && Array.isArray(participationRecords) && participationRecords.length > 0) 
				? participationRecords.reduce((acc: any[], part: any) => {
					const existingYear = acc.find(p => p.year === part.year);
					if (existingYear) {
						if (part.participation_type === 'Social Protection') existingYear.social_protection = true;
						if (part.participation_type === 'Family Life') existingYear.family_life = true;
						if (part.participation_type === 'Community Life') existingYear.community_life = true;
					} else {
						acc.push({
							year: part.year,
							social_protection: part.participation_type === 'Social Protection',
							family_life: part.participation_type === 'Family Life',
							community_life: part.participation_type === 'Community Life'
						});
					}
					return acc;
				}, []) 
				: [{ year: thisYear, social_protection: false, family_life: false, community_life: false }]
		};

		// Add to children array and track as existing
		children = [existingChild];
		childrenErrors = [{ // Initialize errors array for the existing child
			overall: "",
			firstName: "",
			lastName: "",
			birthday: "",
			sex: "",
			address: "",
			barangay: "",
			disCategory: "",
			disNature: "",
			educType: "",
			educLvl: "",
			educStatus: "",
			pwdId: "",
			pwdExpy: "",
			admissionDate: "",
			partFamilyYear: "",
			ayStart: "",
			ayEnd: "",
			partCommunityYear: ""
		}];
		existingChildIndex = 0;
		
		// Set form to show linked family members by default
		form = {idx: -1, type: "FAMILY"};

		// get the family id (need for family)
		if (familyId) {
			// Use the specific family ID provided in URL
			console.log('Using specific family ID from URL:', familyId)
			await handleFamilyIdParam(familyId)
		} else {
			// Fallback to first family if no specific family ID provided
			const famMemRes = await fetch(`/api/family_members?member_id=${memberId}`)
			const famMemberRecord = await famMemRes.json()
			console.log('familyMemberRecord: ', famMemberRecord)
			
			if (famMemberRecord.data && famMemberRecord.data.length > 0) {
				familyId = famMemberRecord.data[0].family_id
				console.log('Using first family ID as fallback:', familyId)
				await handleFamilyIdParam(familyId)
			} else {
				console.log('No family memberships found for child')
			}
		}
	}

	async function handleCaregiverIdParam(caregiverId: string, familyId?: string | null) {
		// call the api to get the information
		const caregiverRecRes = await fetch(`/api/caregivers/${caregiverId}`)
		const caregiverRecord = await caregiverRecRes.json()
		console.log('caregiverRecord: ', caregiverRecord)
		memberId = caregiverRecord.member_id

		// get the member information with address and barangay using joins
		const memberRes = await fetch(`/api/members/${memberId}?select=*, addresses(*), barangays(*)`)
		const memberRecord = await memberRes.json()
		console.log('memberRecord with joins: ', memberRecord)

		// get community groups (may not exist for all caregivers)
		let communityRecords = [];
		try {
			const communityRes = await fetch(`/api/caregiver_groups?caregiver_id=${caregiverId}`)
			if (communityRes.ok) {
				communityRecords = await communityRes.json()
			}
		} catch (error) {
			console.log('No community group records found for caregiver:', caregiverId)
		}

		// get income types (may not exist for all caregivers)
		let incomeRecords = [];
		try {
			const incomeRes = await fetch(`/api/income_type?caregiver_id=${caregiverId}`)
			if (incomeRes.ok) {
				incomeRecords = await incomeRes.json()
			}
		} catch (error) {
			console.log('No income records found for caregiver:', caregiverId)
		}

		// Create pre-populated caregiver object
		const existingCaregiver: NewCaregiver = {
			type: 'new',
			firstName: memberRecord.first_name || '',
			lastName: memberRecord.last_name || '',
			bday: memberRecord.birthday ? memberRecord.birthday.split('T')[0] : '',
			sex: memberRecord.sex || '',
			contactNo: caregiverRecord.contact_number || '',
			fbLink: caregiverRecord.facebook_link || '',
			email: caregiverRecord.email || '',
			address: memberRecord.addresses?.address || '',
			brgy: memberRecord.barangays?.name || '',
			occupation: caregiverRecord.occupation || '',
			relationship: '', // This will be filled from family relationship
			admission_date: memberRecord.admission_date ? memberRecord.admission_date.slice(0, 7) : '',
			communityGrp: (communityRecords && Array.isArray(communityRecords) && communityRecords.length > 0) 
				? communityRecords.map((comm: any) => ({
					id: comm.community_group_id,
					yrFrom: comm.date_joined || '',
					yrTo: comm.date_left || ''
				})) : [],
			income: (incomeRecords && Array.isArray(incomeRecords) && incomeRecords.length > 0)
				? incomeRecords.map((inc: any) => ({
					type: inc.income_category,
					yrFrom: inc.date_start || '',
					yrTo: inc.date_end || ''
				})) : []
		};

		// Add to caregivers array and track as existing
		familyMembers.newCaregivers = [existingCaregiver];
		caregiverErrors = [{ // Initialize errors array for the existing caregiver
			firstName: '',
			lastName: '',
			sex: '',
			bday: '',
			contactNo: '',
			email: '',
			address: '',
			brgy: '',
			communityYr: '',
			admissionDate: '',
			msg: ''
		}];
		existingCaregiverIndex = 0;
		
		// Set form to show linked family members by default
		form = {idx: -1, type: "FAMILY"};

		// get the family id (need for family)
		if (familyId) {
			// Use the specific family ID provided in URL
			console.log('Using specific family ID from URL:', familyId)
			
			// Get the relationship for this specific family
			const famMemRes = await fetch(`/api/family_members?member_id=${memberId}&family_id=${familyId}`)
			const famMemberRecord = await famMemRes.json()
			if (famMemberRecord.data?.[0]?.relationship_type) {
				familyMembers.newCaregivers[0].relationship = famMemberRecord.data[0].relationship_type;
			}
			
			await handleFamilyIdParam(familyId)
		} else {
			// Fallback to first family if no specific family ID provided
			const famMemRes = await fetch(`/api/family_members?member_id=${memberId}`)
			const famMemberRecord = await famMemRes.json()
			console.log('familyMemberRecord: ', famMemberRecord)
			
			if (famMemberRecord.data && famMemberRecord.data.length > 0) {
				familyId = famMemberRecord.data[0].family_id
				console.log('Using first family ID as fallback:', familyId)
				
				// Get the relationship from family_members table
				if (famMemberRecord.data[0].relationship_type) {
					familyMembers.newCaregivers[0].relationship = famMemberRecord.data[0].relationship_type;
				}
				
				await handleFamilyIdParam(familyId)
			} else {
				console.log('No family memberships found for caregiver')
			}
		}
	}

	// cleans the contact number, used for validation and posting the data
	const cleanContactNumber = (contactNo: string): string => {
		return contactNo.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
	};

	function addNewCaregiver() {
		const newCaregiver: NewCaregiver = {
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
			admission_date: new Date().toISOString().slice(0, 7),
			communityGrp: [],
			income: []
		};

		const newError = {
			firstName: '',
			lastName: '',
			sex: '',
			bday: '',
			contactNo: '',
			email: '',
			brgy: '',
			address: '',
			communityYr: '',
			admissionDate: '',
			msg: ''
		};

		familyMembers.newCaregivers = [...familyMembers.newCaregivers, newCaregiver];
		caregiverErrors = [...caregiverErrors, newError];

		// Set to the newly added caregiver
		form = {idx: familyMembers.newCaregivers.length - 1, type: "CAREGIVER"};
		// console.log(familyMembers)
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

		// Update form.idx after deletion
		if (form.idx === index) {
			// If we deleted the currently selected item, reset to no selection
			form.idx = -1;
		} else if (form.idx > index) {
			// If we deleted an item before the current selection, adjust the index
			form.idx = form.idx - 1;
		}
		// If form.idx < index, no change needed
	}

	// Child management functions
	function addNewChild() {
		const newChild: NewChild = {
			first_name: '',
			middle_name: '',
			last_name: '',
			birthday: '',
			age: '',
			sex: '',
			address: '',
			barangay: '',
			remarks: '',
			date_admission: new Date().toISOString().slice(0, 7),
			disability: {
				category_id: null,
				nature: ''
			},
			education: [],
			has: {
				birth_cert: false,
				medical_cert: false,
				barangay_cert: false,
				philhealth: false,
				pwd_id: false,
				pwd: {
					expiry_date: '',
					id: ''
				},
				vote: false,
				national_id: false,
			},
			employment: {
				able_to_work: false,
				type: ''
			},
			part: {
				family_life: false,
				fam_year: thisYear,
				community: false,
				com_year: thisYear
			}
		};

		const newError = {
			overall: "",
			firstName: "",
			lastName: "",
			birthday: "",
			sex: "",
			address: "",
			barangay: "",
			disCategory: "",
			disNature: "",
			educType: "",
			educLvl: "",
			educStatus: "",
			pwdId: "",
			pwdExpy: "",
			admissionDate: "",
			partFamilyYear: "",
			ayStart: "",
			ayEnd: "",
			partCommunityYear: ""
		};

		children = [...children, newChild];
		childrenErrors = [...childrenErrors, newError];

		// Set to the newly added child
		form = {idx: children.length - 1, type: "CHILD"};
	}

	function deleteChild(index: number) {
		const newChildren = [];
		const newErrors = [];

		for (let i = 0; i < children.length; i++) {
			if (i !== index) {
				newChildren.push(children[i]);
				newErrors.push(childrenErrors[i]);
			}
		}

		children = newChildren;
		childrenErrors = newErrors;

		// Update form.idx after deletion
		if (form.idx === index && form.type === "CHILD") {
			// If we deleted the currently selected child, reset to no selection
			form.idx = -1;
		} else if (form.idx > index && form.type === "CHILD") {
			// If we deleted a child before the current selection, adjust the index
			form.idx = form.idx - 1;
		}
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
		// new caregiver helper function: for birthday (no future birthdays)
		const isValidBirthday = (birthday: string): boolean => {
			if (!birthday.trim()) return true; // Birthday is optional, so empty is valid
			const birthdayDate = new Date(birthday);
			const today = new Date();
			return !isNaN(birthdayDate.getTime()) && birthdayDate <= today;
		};


		// validation for new caregivers
		caregiverErrors = familyMembers.newCaregivers.map((caregiver) => {
			const errors = {
				firstName: !caregiver.firstName.trim() ? 'Required' : '',
				lastName: !caregiver.lastName.trim() ? 'Required' : '',
				sex: !caregiver.sex ? 'Required' : '',
				bday: !isValidBirthday(caregiver.bday) ? 'Birthday cannot be in the future' : '',
				contactNo: !caregiver.contactNo.trim() ? 'Required' :
					!isValidContactNumber(caregiver.contactNo) ? 'Invalid phone number format' : '',
				email: !isValidEmail(caregiver.email) ? 'Invalid email format' : '',
				address: !caregiver.address.trim() ? 'Required' : '',
				brgy: !caregiver.brgy ? 'Required' : '',
				communityYr: '',
				admissionDate: !caregiver.admission_date ? 'Required' : '',
				msg: ''
			};

			// check if any error messages are present to invalidate the form
			if (Object.values(errors).some(msg => msg)) {
				isValid = false;
			}

			return errors;
		});

		// validation for children
		childrenErrors = children.map((child) => {
			// Check if child has at least one education record with a valid type (including "Not enrolled")
			const hasValidEducation = child.education && child.education.length > 0 &&
				child.education.some(edu => edu.type && edu.type.trim() !== "");

			// Check if any education record needs level/status validation
			let needsEducLevel = false;
			let needsEducStatus = false;
			let needsAcademicYear = false;

			if (child.education && child.education.length > 0) {
				for (const edu of child.education) {
					if (edu.type && edu.type.trim() !== "" && edu.type !== "Not enrolled") {
						if (!edu.grade_level || !edu.grade_level.trim()) needsEducLevel = true;
						if (!edu.status || !edu.status.trim()) needsEducStatus = true;
						if (!edu.year_start || !edu.year_end) needsAcademicYear = true;
					}
				}
			}

			// PWD validation
			const needsPwdId = child.has?.pwd_id && (!child.has?.pwd?.id || !child.has.pwd.id.trim());
			const needsPwdExpiry = child.has?.pwd_id && (!child.has?.pwd?.expiry_date || !child.has.pwd.expiry_date.trim());

			// Social participation year validation
			let needsPartYear = false;
			if (child.participation && child.participation.length > 0) {
				for (const part of child.participation) {
					// If any participation type is checked but year is missing
					if ((part.social_protection || part.family_life || part.community_life) && !part.year) {
						needsPartYear = true;
						break;
					}
				}
			}

			const errors = {
				overall: "",
				firstName: !child.first_name.trim() ? 'Required' : '',
				lastName: !child.last_name.trim() ? 'Required' : '',
				birthday: !child.birthday ? 'Required' : '',
				sex: !child.sex ? 'Required' : '',
				address: !child.address.trim() ? 'Required' : '',
				barangay: !child.barangay.trim() ? 'Required' : '',
				disCategory: !child.disability?.category_id ? 'Required' : '',
				disNature: "",
				educType: !hasValidEducation ? 'Required' : '',
				educLvl: needsEducLevel ? 'Required' : '',
				educStatus: needsEducStatus ? 'Required' : '',
				pwdId: needsPwdId ? 'Required' : '',
				pwdExpy: needsPwdExpiry ? 'Required' : '',
				admissionDate: !child.date_admission ? 'Required' : '',
				partFamilyYear: needsPartYear ? 'Required' : '',
				ayStart: needsAcademicYear ? 'Required' : '',
				ayEnd: needsAcademicYear ? 'Required' : '',
				partCommunityYear: needsPartYear ? 'Required' : ''
			};

			// check if any error messages are present to invalidate the form
			if (Object.values(errors).some(msg => msg)) {
				isValid = false;
			}

			return errors;
		});

		return isValid;
	}

	// Reactive validation - update errors whenever data changes
	$effect(() => {
		// Silently validate without showing error messages until submit
		validateFormSilently();
	});

	// Silent validation for sidebar indicators only
	function validateFormSilently() {
		// validation for children
		childrenErrors = children.map((child) => {
			// Check if child has at least one education record with a valid type (including "Not enrolled")
			const hasValidEducation = child.education && child.education.length > 0 &&
				child.education.some(edu => edu.type && edu.type.trim() !== "");

			// Check if any education record needs level/status validation
			let needsEducLevel = false;
			let needsEducStatus = false;
			let needsAcademicYear = false;

			if (child.education && child.education.length > 0) {
				for (const edu of child.education) {
					if (edu.type && edu.type.trim() !== "" && edu.type !== "Not enrolled") {
						if (!edu.grade_level || !edu.grade_level.trim()) needsEducLevel = true;
						if (!edu.status || !edu.status.trim()) needsEducStatus = true;
						if (!edu.year_start || !edu.year_end) needsAcademicYear = true;
					}
				}
			}

			// PWD validation
			const needsPwdId = child.has?.pwd_id && (!child.has?.pwd?.id || !child.has.pwd.id.trim());
			const needsPwdExpiry = child.has?.pwd_id && (!child.has?.pwd?.expiry_date || !child.has.pwd.expiry_date.trim());

			// Social participation year validation
			let needsPartYear = false;
			if (child.participation && child.participation.length > 0) {
				for (const part of child.participation) {
					// If any participation type is checked but year is missing
					if ((part.social_protection || part.family_life || part.community_life) && !part.year) {
						needsPartYear = true;
						break;
					}
				}
			}

			return {
				overall: "",
				firstName: !child.first_name.trim() ? 'Required' : '',
				lastName: !child.last_name.trim() ? 'Required' : '',
				birthday: !child.birthday ? 'Required' : '',
				sex: !child.sex ? 'Required' : '',
				address: !child.address.trim() ? 'Required' : '',
				barangay: !child.barangay.trim() ? 'Required' : '',
				disCategory: !child.disability?.category_id ? 'Required' : '',
				disNature: "",
				educType: !hasValidEducation ? 'Required' : '',
				educLvl: needsEducLevel ? 'Required' : '',
				educStatus: needsEducStatus ? 'Required' : '',
				pwdId: needsPwdId ? 'Required' : '',
				pwdExpy: needsPwdExpiry ? 'Required' : '',
				admissionDate: !child.date_admission ? 'Required' : '',
				partFamilyYear: needsPartYear ? 'Required' : '',
				ayStart: needsAcademicYear ? 'Required' : '',
				ayEnd: needsAcademicYear ? 'Required' : '',
				partCommunityYear: needsPartYear ? 'Required' : ''
			};
		});

		// validation for caregivers
		caregiverErrors = familyMembers.newCaregivers.map((caregiver) => {
			return {
				firstName: !caregiver.firstName.trim() ? 'Required' : '',
				lastName: !caregiver.lastName.trim() ? 'Required' : '',
				sex: !caregiver.sex ? 'Required' : '',
				bday: '',
				contactNo: !caregiver.contactNo.trim() ? 'Required' : '',
				email: '',
				address: !caregiver.address.trim() ? 'Required' : '',
				brgy: !caregiver.brgy ? 'Required' : '',
				communityYr: '',
				admissionDate: !caregiver.admission_date ? 'Required' : '',
				msg: ''
			};
		});
	}

	// Helper function to log validation errors
	function logValidationErrors() {
		console.log("=== VALIDATION FAILED ===");
		console.log("Main error:", mainError);
		console.log("Linked family error:", linkedFamilyError);
		console.log("Children errors:", $state.snapshot(childrenErrors));
		console.log("Caregiver errors:", $state.snapshot(caregiverErrors));

		// Log specific child errors
		$state.snapshot(children).forEach((child, index) => {
			const errors = $state.snapshot(childrenErrors)[index];
			const hasErrors = Object.values(errors).some(msg => msg && msg.trim() !== '');
			if (hasErrors) {
				console.log(`Child ${index} (${child.first_name || 'Unnamed'}) errors:`,
					Object.entries(errors).filter(([key, value]) => value && value.trim() !== ''));
			}
		});

		// Log specific caregiver errors
		$state.snapshot(familyMembers.newCaregivers).forEach((caregiver, index) => {
			const errors = $state.snapshot(caregiverErrors)[index];
			const hasErrors = Object.values(errors).some(msg => msg && msg.trim() !== '');
			if (hasErrors) {
				console.log(`Caregiver ${index} (${caregiver.firstName || 'Unnamed'}) errors:`,
					Object.entries(errors).filter(([key, value]) => value && value.trim() !== ''));
			}
		});
	}

	// Helper functions to check if member has errors
	function childHasErrors(childIndex: number): boolean {
		if (!childrenErrors[childIndex]) return false;
		const errors = childrenErrors[childIndex];
		return Object.values(errors).some(msg => msg && msg.trim() !== '');
	}

	function caregiverHasErrors(caregiverIndex: number): boolean {
		if (!caregiverErrors[caregiverIndex]) return false;
		const errors = caregiverErrors[caregiverIndex];
		return Object.values(errors).some(msg => msg && msg.trim() !== '');
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
				logValidationErrors();
				goto('#family-info');    // scrolls to top
				loadingSubmission = false;
				return;
			}
			console.log("INFO ON FAMILY: ", $state.snapshot(familyMembers))
			console.log("CHILDREN DATA: ", $state.snapshot(children))

			/*
			note there are 3 views,
			0. url without family id nor child id: default, register new cwd
			1. url with family id: it is the caregiver view, autofill the linked family, there is no "new" child
					purpose: to link caregiver to family
			2. url with child id (also needs family id): old child, already has linked family,
					purpose: to add new caregiver and edit the relationship_cc
			 */


			// CODE BLOCK #1: SUBMITTING CWD DATA (from children array)
			// Process each child in the children array
			for (const [childIndex, child] of children.entries()) {
				let currentMemberId: string;
				let currentChildId: string;
				
				// Check if this is an existing child (pre-populated from URL)
				const isExistingChild = childIndex === existingChildIndex;
				
				if (isExistingChild) {
					// For existing child, just use the existing IDs - skip processing
					currentMemberId = memberId;
					currentChildId = childId!;
					console.log('Skipping existing child processing - using existing IDs');
				} else {
					// For new child, create new records
					// insert address
					const addressData = await safeFetch('POST', '/api/addresses', { address: child.address });
					console.log(addressData.message);
					const address_id = addressData.data.id;

					// insert barangay
					const barangayData = await safeFetch('POST', '/api/barangays', { name: child.barangay });
					console.log('Barangay ', barangayData.message);
					const barangay_id = barangayData.data.id;

					// insert member
					const memberData = await safeFetch('POST', '/api/members', {
						first_name: child.first_name,
						middle_name: child.middle_name,
						last_name: child.last_name,
						birthday: child.birthday,
						sex: child.sex,
						admission_date: child.date_admission ? `${child.date_admission}-01T00:00:00Z` : new Date().toISOString(),
						address_id: address_id,
						barangay_id: barangay_id
					});
					console.log(memberData.message);
					currentMemberId = memberData.data.id;
					
					var pwdId = null;
					// insert PWD ID
					if (child.has?.pwd_id && child.has?.pwd?.id) {
						const pwdIdData = await safeFetch('POST', '/api/pwd_ids', {
							pwd_id: child.has.pwd.id,
							expiry_date: child.has.pwd.expiry_date
						});
						console.log(pwdIdData.message);
						pwdId = pwdIdData.data.id;
					}

					// insert child info
					const childData = await safeFetch('POST', '/api/children', {
						has_barangay_cert: child.has?.barangay_cert || false,
						has_birth_cert: child.has?.birth_cert || false,
						has_medical_cert: child.has?.medical_cert || false,
						has_vote: child.has?.vote || false,
						has_national_id: child.has?.national_id || false,
						has_philhealth: child.has?.philhealth || false,
						is_active: true,
						disability_id: child.disability?.category_id,
						disability_nature: child.disability?.nature || '',
						remarks: child.remarks || '',
						member_id: currentMemberId,
						pwd_id: pwdId
					});
					console.log(childData.message);
					currentChildId = childData.data.id;
				}

				// Set the first child as the main child for family operations
				if (childIndex === 0) {
					memberId = currentMemberId;
					childId = currentChildId;
				}

				// insert education records
				if (child.education && child.education.length > 0) {
					console.log('Child education records:', $state.snapshot(child.education));
					for (const educRecord of child.education) {
						console.log('Processing education record:', $state.snapshot(educRecord));
						if (educRecord.type && educRecord.type !== "" && educRecord.type !== "Not enrolled") {
							const eduStatusData = await safeFetch('POST', '/api/education_status', {
								child_id: currentChildId,
								education_type: educRecord.type,
								grade_level: educRecord.grade_level,
								student_status_type: educRecord.status,
								year_start: educRecord.year_start,
								year_end: educRecord.year_end
							});
							console.log('Education record added:', eduStatusData.message);
						} else {
							console.log('Skipping education record - type is empty or "Not enrolled"');
						}
					}
				} else {
					console.log('No education records found for child');
				}

				// insert participation records
				if (child.participation && child.participation.length > 0) {
					for (const partRecord of child.participation) {
						if (partRecord.social_protection) {
							const socProtData = await safeFetch('POST', '/api/social_participation', {
								child_id: currentChildId,
								participation_type: "Social Protection",
								year: partRecord.year
							});
							console.log('Social protection record added:', socProtData.message);
						}
						if (partRecord.family_life) {
							const famLifeData = await safeFetch('POST', '/api/social_participation', {
								child_id: currentChildId,
								participation_type: "Family Life",
								year: partRecord.year
							});
							console.log('Family life record added:', famLifeData.message);
						}
						if (partRecord.community_life) {
							const comLifeData = await safeFetch('POST', '/api/social_participation', {
								child_id: currentChildId,
								participation_type: "Community Life",
								year: partRecord.year
							});
							console.log('Community life record added:', comLifeData.message);
						}
					}
				}

				// insert employment status
				if (child.employment?.able_to_work) {
					const empStatusData = await safeFetch('POST', '/api/employment_status', {
						able_to_work: child.employment.able_to_work,
						employment_type: child.employment.type || null,
						member_id: currentMemberId
					});
					console.log('Employment status added:', empStatusData.message);
				}
			}

			// for family

			// CODE BLOCK #2.0: HANDLE EXISTING FAMILY SCENARIOS
			if (familyMembers.hasExisting && familyMembers.linkedFamily != null) {
				if (familyMembers.linkedFamily.type === 'create_new_with_person') {
					// Create new family and add the person to it (they stay in both families)
					console.log('Creating new family with selected person');
					const familyData = await safeFetch('POST', '/api/families', null);
					const newFamilyId = familyData.data.id;
					console.log('New family created:', newFamilyId);

					// Add the selected person to the new family (keeping them in their original family too)
					const selectedPerson = familyMembers.linkedFamily.infoLinked[0];
					try {
						const addToNewFamilyData = await safeFetch('POST', '/api/family_members', {
							is_child: selectedPerson.caregiver_id == null,
							member_id: selectedPerson.member_id,
							family_id: newFamilyId,
							relationship_type: selectedPerson.relationship || 'Family Member'
						});
						console.log('Person added to new family (keeping original family too):', addToNewFamilyData.message);
					} catch (error) {
						console.error('Failed to add person to new family:', error);
					}

					// Add new registrants to this new family
					await POST_family(newFamilyId);
				} else {
					// Join existing family (original logic)
					const familyId = familyMembers.linkedFamily.family_id;
					console.log('Using existing family ID:', familyId, 'with', familyMembers.linkedFamily.infoLinked.length, 'linked members');

					// update relationships in family_members - only if relationship was modified
					if (familyMembers.hasExisting && familyMembers.linkedFamily?.infoLinked) {
						for (const linkedMember of familyMembers.linkedFamily.infoLinked) {
							// Only update if relationship was actually set/modified
							if (linkedMember.relationship && linkedMember.relationship.trim() !== '') {
								try {
									const relationshipData = await safeFetch('PUT', '/api/family_members', {
										member_id: linkedMember.member_id,
										family_id: familyId,
										relationship_type: linkedMember.relationship
									});
									console.log('Updated relationship for', linkedMember.firstName, ':', relationshipData.message);
								} catch (error) {
									console.error('Failed to update relationship for', linkedMember.firstName, ':', error);
								}
							}
						}
					}

					// add the child and caregivers to the existing family
					await POST_family(familyId);
				}


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

			if (staffView) goto('/dashboard');			// back to dashboard if previous view is dashboard
			else goto('/registration/submitted'); // back to success page for non-staff users

		} catch (err) {
			loadingSubmission = false;
			console.error('Submission failed:', err);
			alert('Submission failed')
		}

		async function POST_family(newFamilyId: string) {
			let isChild = childId != null
			let oldChildNewFamily = (url.childId != null && familyId != newFamilyId)
			let oldCareNewFamily = (url.caregiverId != null && familyId != newFamilyId)

			// CODE BLOCK #3: ADD NEW MEMBER TO FAMILY MEMBERS RECORD
			// Case 1: Existing child/caregiver is changing families
			if ((oldChildNewFamily || oldCareNewFamily) && familyId != null) {
				console.log('Child/Caregiver is changing families - deleting old family record');
				// Delete old family record first
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

				// Update the record to new family
				const famMemData = await safeFetch('PUT', '/api/family_members', {
					is_child: isChild,
					member_id: memberId,
					family_id: newFamilyId
				});
				console.log('Member updated to family:', famMemData.message);
				familyId = newFamilyId
			}
			// Case 2: Member was removed from existing family - move them to individual family
			else if (wasRemovedFromFamily && familyId && memberId) {
				console.log('Member was removed from family - moving to individual family');
				try {
					// Delete from old family
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
						console.log('Member removed from old family:', deleteResult);
					} else {
						console.warn('Failed to remove member from old family');
					}

					// Create new individual family and add member to it
					const isChild = childId != null;
					const famMemData = await safeFetch('POST', '/api/family_members', {
						is_child: isChild,
						member_id: memberId,
						family_id: newFamilyId,
						relationship_type: isChild ? "CWD" : "Caregiver"
					});
					console.log('Member moved to new individual family:', famMemData.message);
					familyId = newFamilyId;
				} catch (error) {
					console.error('Error moving member to individual family:', error);
				}
			}
			// Case 3: New registration - add NEW member to family (existing or new family)
			else if (isNewChild || (memberId && !familyMembers.hasExisting)) {
				console.log('Adding new member to family, memberId:', memberId, 'isChild:', isChild);
				if (memberId) {
					const famMemData = await safeFetch('POST', '/api/family_members', {
						is_child: isChild,
						member_id: memberId,
						family_id: newFamilyId,
						relationship_type: isChild ? "CWD" : "Caregiver"
					});
					console.log('New member added to family:', famMemData.message);
				} else {
					console.log('Skipping family member addition - no memberId available');
				}
				familyId = newFamilyId
			}
			// Case 4: New registration with existing family - only add NEW member, don't re-add existing ones
			else if (memberId && familyMembers.hasExisting) {
				console.log('Adding new member to existing linked family, memberId:', memberId);
				// Check if this member is already in the family (avoid duplicates)
				const isAlreadyInFamily = familyMembers.linkedFamily?.infoLinked?.some(
					linked => linked.member_id === memberId
				);

				if (!isAlreadyInFamily && memberId) {
					const famMemData = await safeFetch('POST', '/api/family_members', {
						is_child: isChild,
						member_id: memberId,
						family_id: newFamilyId,
						relationship_type: isChild ? "CWD" : "Caregiver"
					});
					console.log('New member added to existing family:', famMemData.message);
				} else {
					console.log('Member already in family or no memberId, skipping duplicate add');
				}
				familyId = newFamilyId
			}


			// CODE BLOCK #5: ADD ALL NEW CAREGIVERS TO THE EXISTING FAMILY
			for (const [i, newCaregiver] of familyMembers.newCaregivers.entries()) {
				const isExistingCaregiver = i === existingCaregiverIndex;
				
				if (isExistingCaregiver) {
					// For existing caregiver, skip processing - they're already in the database
					console.log('Skipping existing caregiver processing - already in database');
				} else {
					// add all the NEW caregivers to the db (POST to member, and POST to caregivers)
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
		}

		// CODE BLOCK #6: INSERT NEW CAREGIVER
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
			const memberData = await safeFetch('POST', '/api/members', {
				first_name: caregiver.firstName,
				last_name: caregiver.lastName,
				birthday: caregiver.bday || null,
				sex: caregiver.sex,
				admission_date: caregiver.admission_date ? `${caregiver.admission_date}-01T00:00:00Z` : new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
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

			// create the caregiver_groups records
			for (const communityGroup of caregiver.communityGrp) {
				if (communityGroup.id != null) {
					const comGrpData = await safeFetch('POST', '/api/caregiver_groups', {
						date_joined: communityGroup.yrFrom,
						date_left: communityGroup.yrTo || null,
						community_group_id: communityGroup.id,
						caregiver_id: caregiver_id
					})
					console.log("Community group: ", comGrpData.message)
				}
			}

			// create the income type records
			for (const incomeSource of caregiver.income) {
				if (incomeSource.type && incomeSource.type !== "") {
					const incomeData = await safeFetch('POST', '/api/income_type', {
						income_category: incomeSource.type,
						date_start: incomeSource.yrFrom,
						date_end: incomeSource.yrTo || null,
						caregiver_id: caregiver_id
					})
					console.log("Income: ", incomeData.message)
				}
			}

			return {
				member_id: memberData.data.id,
				caregiver_id: caregiver_id
			};
		}


	}
</script>
<div id="page" class="flex flex-row" style={pageHeight}>
	<div id="sidebar" class="w-[18vw] min-w-[270px] shadow-lg h-full bg-gray-50 flex flex-col">
		<!-- Scrollable navigation area -->
		<div class="flex-1 overflow-y-auto p-4">
			<nav class="space-y-2">
				<h2 class="!text-[var(--green)]">Registration</h2>

				<div class="step-item p-2 bg-white rounded shadow-sm border-l-4 border-[var(--green)]">
					<i class="bi bi-person-wheelchair mr-2"></i>
					Beneficiaries

					<ul>
						{#each children as _, idx (idx)}
							<li class="cursor-pointer hover:!underline p-1 rounded {form.idx === idx && form.type === 'CHILD' ? '!text-[var(--green)]' : childHasErrors(idx) ? '!text-[var(--error-color)]' : ''}" onclick={() => form = {idx, type: 'CHILD'}}>
								{children[idx].first_name || `Child ${idx + 1}`}
							</li>
						{/each}
					</ul>

					<button class="green !text-[0.9rem] !p-0 !px-[6px]" aria-label="add" onclick={addNewChild}>
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>
				<div class="step-item p-2 bg-green-100 rounded shadow-sm border-l-4 border-[var(--green)]">
					<i class="bi bi-person-hearts mr-2"></i>
					Caregivers

					<ul>
						{#each familyMembers.newCaregivers as _, idx (idx)}
							<li class="cursor-pointer hover:!underline p-1 rounded {form.idx === idx && form.type === 'CAREGIVER' ? '!text-[var(--green)]' : caregiverHasErrors(idx) ? '!text-[var(--error-color)]' : ''}" onclick={() => form = {idx, type: 'CAREGIVER'}}>
								{familyMembers.newCaregivers[idx].firstName || `Caregiver ${idx + 1}`}
							</li>
						{/each}
					</ul>

					<button class="green !text-[0.9rem] !p-0 !px-[6px]" aria-label="add" onclick={addNewCaregiver}>
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>

				{#if familyMembers.hasExisting && familyMembers.linkedFamily.infoLinked.length > 0}
					<div class="step-item p-2 bg-blue-100 rounded shadow-sm border-l-4 border-[var(--pink)] cursor-pointer hover:bg-blue-200 {form.type === 'FAMILY' ? 'bg-blue-200' : ''}" onclick={() => form = {idx: -1, type: 'FAMILY'}}>
						<i class="bi bi-link-45deg mr-2"></i>
						Linked Family Members

						<ul>
							{#each familyMembers.linkedFamily.infoLinked as member, idx}
								<li class="text-sm p-1">
									{member.firstName} {member.lastName}
									{#if member.contactNo}- {member.contactNo}{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</nav>
		</div>

		<!-- Fixed bottom buttons -->
		<div class="p-4 border-t border-gray-200 space-y-2">
			<button class="!text-[1rem] !p-[2px] !px-[12px] w-full" onclick={showModalLink = true}>
				<i class="bi bi-link-45deg mr-2"></i> Link existing family
			</button>

			{#if loadingSubmission}
				<LoadingBtn btnClass="green !text-[0.95rem] !p-[2px] !px-[12px] w-full" label="Submit" />
			{:else}
				<button class="green !text-[0.95rem] !p-[2px] !px-[12px] w-full" onclick={handleSubmit}>Submit</button>
				<Validation msg={mainError} />
			{/if}
		</div>
	</div>

	<div id="form" class="h-full flex-1 p-6 overflow-y-auto">
		{#if form.type === "FAMILY"}
			<ExistingForm bind:formData={familyMembers} error_msg={linkedFamilyError} members={members} bind:showTable={showTable} isChildView={url.caregiverId == null} memberName={url.childId ? (children[0]?.first_name || '') + ' ' + (children[0]?.last_name || '') : (familyMembers.newCaregivers[0]?.firstName || '') + ' ' + (familyMembers.newCaregivers[0]?.lastName || '')} memberId={memberId || ''} onFamilyRemoval={() => wasRemovedFromFamily = true} />
		{:else if form.idx === -1}
			<div class="h-full flex flex-row items-center justify-center text-center gap-4">
				Add a family member on the left
				<img src="/img/go_code.png" alt="go_code.png" class="w-[50px] h-[50px]" />
			</div>

		{:else if form.type === "CAREGIVER"}
			<CaregiverForm
				bind:formData={familyMembers.newCaregivers[form.idx]}
				errors={caregiverErrors[form.idx]}
				index={form.idx}
				deleteCaregiver={deleteCaregiver}
				{options}
				{staffView}
				disabled={form.idx === existingCaregiverIndex}
			/>

		{:else if form.type === "CHILD"}
			<ChildForm
				bind:formData={children[form.idx]}
				errors={childrenErrors[form.idx]}
				index={form.idx}
				deleteChild={deleteChild}
				{options}
				{staffView}
				disabled={form.idx === existingChildIndex}
			/>
		{/if}
	</div>
</div>

<!-- Modal to get an existing family -->
<Modal buttonText="" bind:isOpen={showModalLink}>
	<div slot="modal">
		<ExistingForm bind:formData={familyMembers} error_msg={linkedFamilyError} members={members} bind:showTable={showTable} isChildView={url.caregiverId == null} memberName={url.childId ? (children[0]?.first_name || '') + ' ' + (children[0]?.last_name || '') : (familyMembers.newCaregivers[0]?.firstName || '') + ' ' + (familyMembers.newCaregivers[0]?.lastName || '')} memberId={memberId || ''} onFamilyRemoval={() => wasRemovedFromFamily = true} />
		<button class="green" onclick={() => {
			// Always allow closing the modal
			showModalLink = false;
			linkedFamilyError = "";
		}}>Confirm</button>
	</div>
</Modal>



<style>
    i {
        color: inherit;
        font-size: inherit;
    }
    li {
        font-size: 1rem;
    }
</style>