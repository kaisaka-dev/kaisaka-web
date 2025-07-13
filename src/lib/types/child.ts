import type {family} from './family.ts'
import type { EventType } from './event.ts'
import type { interventionType } from './intervention.ts'
import type { SocialSecurity } from './SocialSecurity.ts'

export type child = {
    firstName: string,
    lastName: string,
    education: string,
    educationStatus: string,
    birthday: Date,
    sex: string,
    address: string,
    barangay: string,
    employmentStatus: string,
    disabilityCategory: string,
    disabilityNature: string,
    dateAdmission: Date,
    dateTermination: Date | null,
    remarks: string | null
    family: family,
    natID: boolean,
    voterID: boolean,
    eventAttendance: EventType[],
    PWD: boolean,
    PhilHealth: boolean,
    medCert: boolean,
    birthCert: boolean,
    barangayCert: boolean,
    interventionHistory: interventionType[],
    socialSecurity: SocialSecurity
}