
// export enum Sex_enum {
//   "Male",
//   "Female",
//   "Other"
// }

// export enum Education_type_enum {
//   "Home Program",
//   "Nonformal",
//   "Integrated/SPED",
//   "Inclusive/Gen. Ed."
// }

// export enum Employment_type_enum {
//   "Wage Employed",
//   "Self-Employed",
//   "Sheltered Workshop"
// }

// export enum Improvement_status_enum{
//   "Improved",
//   "Neutral",
//   "Regressed"
// }

// export interface Caregivers {
//   id: Number,
//   member_id: Number,
//   contact_number: String,
//   facebook_link: String,
//   email: String,
//   occupation: String,
//   Remarks: String,
// }

// export interface Members {
//   id: Number,
//   first_name: String,
//   middle_name: String,
//   last_name: String,
//   birthday: Date,
//   sex: Sex_enum,
//   street_id: Number,
//   barangay: Number,
//   admission_date: Date,
//   date_created: Date,
//   last_updated: Date,
//   last_approved: Date
// }

// export interface Children {
//   id: Number,
//   member_id: Number,
//   pwd_id: Number,
//   has_philhealth: Boolean,
//   philhealth_id: Number,
//   has_birt_cert: Boolean,
//   has_medical_cert: Boolean,
//   has_barangay_cert: Boolean,
//   is_active: Boolean, //
//   remarks: String
// }

// export interface Relationship_cc {
//   child_id: Number,
//   caregiver_id: Number,
//   relationship: String
// }

// export interface PWD_ids {
//   id: Number,
//   exp_date: Date
// }

// export interface Philhealth_ids {
//   id: Number,
//   exp_date: Date
// }

// export interface Disabililty_status {
//   id: Number,
//   child_id: Number,
//   disability_id: Number,
//   disability_nature: String,
//   date_created: Date,
//   last_updated: Date
// }

// export interface Disabilities {
//   id: Number,
//   name: String
// }

// export interface Education_status {
//   id: Number,
//   child_id: Number,
//   education_type: Education_type_enum,
//   year_start: Number,
//   year_end: Number,
//   grade_level: Number,
//   date_created: Date,
//   last_updated: Date
// }

// export interface Employment_Status {
//   id: Number,
//   child_id: Number,
//   able_to_work: Boolean,
//   employment_type: Employment_type_enum
// }

// export interface Social_Protection_Status {
//   id: Number,
//   child_id: Number,
//   year_accessed: Number,
//   date_created: Date,
//   last_updated: Date
// }

// export interface Intervention {
//   id: Number,
//   child_id: Number,
//   service_category_id: Number,
//   intervention: String,
//   status: Improvement_status_enum, //
//   remarks: String, // 
//   date_created: Date,
//   last_updated: Date
// }

// export interface Service_Categories {
//   id: Number,
//   name: String
// }

// export interface Family {
//   id: Number,
//   date_created: Date
// }

// export interface Family_members {
//   family_id: Number,
//   member_id: Number,
//   is_child: Boolean,
//   relationship_type: String,
//   date_added: Date
// }