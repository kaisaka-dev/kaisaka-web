# Database

This is where our database managers would be. There are three tasks that we can easily separate else we make it very redundant for us.

This of a better dev experience, so we use this pattern.

**Database repository**: Database Logic.

Interacts with the supabase backend, and handles all of the db-specific implementation.

**Concrete repositories**: Business Logic.

Actual implementation of this (DB repository) abstract notion of a repository. CRUD operations can be customized here (for example, Deletion can be omitted)

**Controller interface**: API Logic.
Any communications with the client will be handled here

> Client needs to know certain barangays in the neighborhood
> If they have invalid data, it'll send it in a message / 400 bad request type thing

## Example: Barangay pipeline

This deals with every information under *barangay*.

- *Database logic / table manager*: The file that connects to supabase and handles it.
  - Delicate, refrain from touching unless necessary
- *Business logic / barangay model*: A class that can communicate with the table manager
  - Barangay model is handled by the barangay api, it will handle all the requests related to the barangay object logic.
  - If you want to find a certain name / city / etc.
- *Controller logic / barangay API*: Code that validate any requests from the client.

## Context Notes

This for the T3AY2024-2025 Team Members.

## List of Models
- activity
- addresses
- annual_program
- attendance_log
- barangays
- caregiver_groups
- caregivers
- children
- cities
- community_group_type
- disability_category
- education_status
- employment_status
- families
- family_members
- income_type
- intervention
- intervention_history
- major_target_activity
- members
- membership_annual_renewal
- membership_payment
- philhealth_ids
- pwd_ids
- relationship_cc
- service_category
- service_objective
- social_protection_status
- streets
- users

On June 29,
The following were removed:
- disabilities
- disability_status

The following were added:
- activity
- attendance_log
- caregiver_groups
- community_group_type
- disability_category
- income_type
- major_target_activity
- service_objective
- users

### Developers

@ImaginaryLogs already made it work, so if you want you can just replicate the existing barangay code (the thought pattern, so dont need to think too much).

- Business logic: it creates crud operations (every single model should handle every single crud operation right here)
- If you're developing: prioritize the model first, then do API after

### Quality Assurance

Based on the model, you can create unit tests / future unit tests ahead of time.

### Designers

For the api, if you need to retrieve any sort of information, ex: login page, if you want to search children, go to children api and search for whatever necessary headers / body you need to pass.

### P.S

@ImaginaryLogs: Session API soon


