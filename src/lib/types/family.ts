import type { member } from './member.js'
import type { membershipFee } from './membershipFee.js'

export type family = {
    id:number | null,
    members: member[],
    payments: membershipFee[],
    dateCreated: Date
}