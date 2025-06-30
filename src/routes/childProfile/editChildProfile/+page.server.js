import {userData} from '$lib/store.js'
//imports temporary data from the store.js file

//defines the load function that page.svelte will use to get its data
export const load = async() => {
    return {
        user: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            education: userData.education,
            birthday: userData.birthday,
            age: userData.findAge(),
            category: userData.disabilityCategory,
            nature: userData.disabilityNature,
        }
    }
}

