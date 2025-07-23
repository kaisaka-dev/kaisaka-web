import type { PageLoad } from '../../../../../.svelte-kit/types/src/routes/$types.js';

export const load: PageLoad = async({fetch}) => {

	const response = await fetch('/api/disability_category');
	const options_disCategory = await response.json();

	return {
		options: {
			disCategory: options_disCategory.data

		}
	};
}