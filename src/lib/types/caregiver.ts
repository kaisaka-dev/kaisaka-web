import type { family } from './family.js'
import type { membershipFee } from './membershipFee.js'

export type caregiver = {
    firstName: string,
    lastName: string,
    contactNo: string,
    fblink: string | null,
    email: string | null,
    address: string,
    barangay: string,
    dateAdmission: Date,
    dateTermination: Date | null,
    remarks: string|null
    family: family[]
    paymentHistory: membershipFee[]
}