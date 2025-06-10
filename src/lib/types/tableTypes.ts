

export interface Caregivers {
  id: Number,
  member_id: Number,
  contact_number: String,
  facebook_link: String,
  email: String,
  occupation: String,
  Remarks: String,
}

export enum Sex_enum {
  Male,
  Female,
  Other
}

export interface Members {
  id: Number,
  first_name: String,
  middle_name: String,
  last_name: String,
  birthday: Date,
  sex: Sex_enum,
  street_id: Number,
  barangay: Number,
  admission_date: Date,
  date_created: Date,
  last_updated: Date,
  last_approved: Date
}