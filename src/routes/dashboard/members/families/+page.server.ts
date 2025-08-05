import type { PageLoad } from './$types';

/**
 * surnames: all unique surnames in a family, separated by comma
 * caregivers: all caregivers, separated by comma
 * children: all children, separated by comma
 * yrLastPaid: the last year that they paid their membership fee
 */
type FamiliesList = {
	id: string;
	surnames: string;
	caregivers: string;
	children: string;
	yrLastPaid: number;
};

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/families');

		if (!response.ok) {
			throw new Error(`Failed to fetch families: ${response.status}`);
		}

		const familiesRaw = await response.json();
		const families = transformFamilyData(familiesRaw.data);

		return { families };
	} catch (error) {
		return {
			families: [],
			error: error instanceof Error ? error.message : 'Failed to load families data'
		};
	}
};

function transformFamilyData(rawData: any[]): FamiliesList[] {
	const familyMap = new Map<string, any>();

	rawData.forEach(item => {
		if (!familyMap.has(item.id)) {
			familyMap.set(item.id, {
				id: item.id,
				surnames: new Set<string>(),
				caregivers: [],
				children: [],
				yrLastPaid: 0
			});
		}

		const family = familyMap.get(item.id);

		item.family_members?.forEach((member: any) => {
			const memberInfo = member.members;
			if (memberInfo) {
				family.surnames.add(memberInfo.last_name);
				const fullName = `${memberInfo.first_name} ${memberInfo.last_name}`;
				if (member.is_child) {
					family.children.push(fullName);
				} else {
					family.caregivers.push(fullName);
				}
			}
		});

		item.membership_annual_renewal?.forEach((renewal: any) => {
			if (renewal.updated_at) {
				const year = new Date(renewal.updated_at).getFullYear();
				if (year > family.yrLastPaid) {
					family.yrLastPaid = year;
				}
			}
		});
	});

	return Array.from(familyMap.values()).map(family => ({
		id: family.id,
		surnames: Array.from(family.surnames).join(', '),
		caregivers: family.caregivers.join(', '),
		children: family.children.join(', '),
		yrLastPaid: family.yrLastPaid || 0
	}));
}
