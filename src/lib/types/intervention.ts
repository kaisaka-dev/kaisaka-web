import type { interventionStatus } from "./interventionStatus.js"

export type interventionType = {
    id: number,
    name: string,
    type: string,
    status: interventionStatus[]
}