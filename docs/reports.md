<!-- markdownlint-disable -->
## In the Program report

Unique Identifying Headers. These act as filters for a specific group:

 - Age Group (0 - 5 years old, etc..)
 - Disability ("All" or Down Syndrome)
 - Sex (Male or Female)


There are Four Functions to investigate,each having unique identifiers:

 1) In the Program: Total of individuals within given id. headers WITH or WITHOUT intervention plan
 2) with Individual Intervention plan: Total of individuals WITH an intervention plan only
 3) Improved in line with the targets of the intervention: Total of intervention plan WITH at least one IMPROVED status within the year
 4) With Transition / Graduation Plan: Total of individuals that are designated as terminated within the year.

Formulas:

 1) Total "All" Disabilities: Sum every disability row with the same id. header except with disability as "All"
 2) Total Down Syndrome: Same above except with Down Syndrome
 3) Total "All" Disabilities except Down Syndrome: Difference of Formula 1 and Formula 2

*Missing*:
Tieing children to annual program. 

Metaphorically, there is an academic year, that is "Annual Program", but we do not have a "Grade Level" to determine if they are in or not, unless they are dated to terminated. Thus, assume to be within the program unless otherwise specified.


### Four Function Select Statement:
  
#### In the Program

Join Select Statement
  
```sql
SELECT 
  *,                                                  -- All information (though id is only necessary)
  disability_category!inner(name),                    -- Disability Category
  members!inner(first_name, last_name, sex, birthday) -- Sex, Birthday (must have)

```

Filter statement

```json
{ 
 eq:    { 'members.sex': sex, `is_active`: true },        // sex, checks if they are within the annual program (assumed with is_active)
 ilike: {'disability_category.name':  `disability.name`}, // disability
 gte:   { 'members.birthday': birthdayRange.gte },        // age min
 lte:   { 'members.birthday': birthdayRange.lte }         // age max
}
```

#### With Individual Intervention Plan

```sql
SELECT 
  *,                                                      -- All information (though id is only necessary)
  disability_category!inner(name),                        -- Disability Category
  members!inner(first_name, last_name, sex, birthday),    -- Sex, Birthday
  intervention!inner(intervention)			                  -- Intevention (inner since must have)
```
			
```json			
{
  eq:    { 'members.sex': sex },                           // sex, checks if they are within the annual program (assumed with is_active)
  ilike: {'disability_category.name':  `disability.name`}, // disability
  gte:   { 'members.birthday': birthdayRange.gte },        // age min
  lte:   { 'members.birthday': birthdayRange.lte }         // age max
}
```
### Improved in line with the targets of the intervention 
```sql
SELECT 
  *,                                                    -- id
  disability_category!inner(name),                      -- disability, inner as its a must
  members!inner(first_name, last_name, sex, birthday),  -- sex, age
  intervention!inner(                                   -- intevention
    intervention, 
    intervention_history!inner(improvement, status)     -- To find the "Improvement" Status, Inner since its a must
  )
```
				
```json		
{ 
  eq:    { 
    'members.sex': sex 
  },                             // sex
  ilike: {
    'disability_category.name':  `disability.name`            // disability
    'intervention.intervention_history.status': `Improvement` // search for status "Improved"
  }, 
  gte:   { 
    'members.birthday': birthdayRange.gte                     // age
    // is improvment within annual program
  },                                                        
  lte:   { 
    'members.birthday': birthdayRange.lte                     // age
    // is improvment within annual program 
  }
}
```
				
#### With Transition / Graduation Plan
```sql
SELECT 
  * 
  disability_category!inner(name), 
  members!inner(first_name, last_name, sex, birthday)		
```			

```json
{ 
 eq:    { 'members.sex': sex, `is_active`: false },        // sex, checks if they are within the annual program (assumed with is_active)
 ilike: {'disability_category.name':  `disability.name`}, // disability
 gte:   { 'members.birthday': birthdayRange.gte },        // age min
 lte:   { 'members.birthday': birthdayRange.lte }         // age max
}
```

### Access To Social Protection


Unique Identifying Headers. These act as filters for a specific group:

For the First Report:

 - Age Group (All, 15 or older, etc..)
 - Requirement (Card ID)
   - pwd id acquisition
   - pwd id renewal
   - philhealth membership
   - voters id
   - national id
   - other social protection schemes - support from LGUs and other institutions
 - Disability ("All" or Down Syndrome)
 - Sex (Male or Female)
 - Annual Program (Already Accessed Last Year vs Newly Accessed This Year)

For the Second Report

 - Age Group (All or 6 older)
 - Disability ("All" or Down Syndrome)
 - Participation in X Group ("Family Life" or "Community Life / Clubs")

*Missing*: 
Tieing IDs and Group Participation with a History Table 

#### First Report
```sql
SELECT
  *,                                -- (pwd id, has_philhealth, has_voters, has_national_id, has_social)
  disability_category!inner(name),  -- disability
  members!inner(sex, birthday)      -- sex, age
ON public.children
```

```json
{
  eq: {
    'members.sex': reportParams.sex,
    uniqueCard.eq
                                                                          // no type
  },
  { ilike: { 'disability_category.name': reportParams.disability.ilike}},
  { gte: { 'members.birthday': birthdayRange.gte } },
  { lte: { 'members.birthday': birthdayRange.lte } },
  { isNot: uniqueCard.isNot}
}
```

#### Second Report
```sql
SELECT
  *,                                -- (pwd id, has_philhealth, has_voters, has_national_id, has_social)
  disability_category!inner(name),  -- disability
  members!inner(sex, birthday)      -- sex, age
ON public.children
```

```json
{
  eq: {
    'members.sex': reportParams.sex,                                    // sex
    'social_protection_status.x': true,          // participation in x group (participates_family_life, participates_community_club)
  },
  ilike: { 'disability_category.name': reportParams.disability.ilike},  // disabilities
  gte: { 'members.birthday': birthdayRange.gte },                       // age min
  lte: { 'members.birthday': birthdayRange.lte },                       // age max
}
```


#### Participation of Caregivers

Unique Identifying Headers. These act as filters for a specific group:

 - Group Membership (Joining a new group this year or Participating in existing group)
 - Disability

Functions for each

 - Income-generating Activities
 - Community Groups (Formal / Nonformal)

```sql
SELECT
  *,
  id,
  member:members (
    first_name,
    last_name,
    sex,
    birthday
  ),
  relationship_cc (
    child:children (
      id,
      member:members (
        first_name,
        last_name,
        sex,
        birthday
      ),
      disability_category (
        name
      )
    )
  )
```

```json
{
  eq: {
    'members.sex': reportParams.sex,   
  }
}

```

#### Access to Labor Market

Unique Identifying Headers. These act as filters for a specific group:

 - Labor Market Access ("Already had access in previous year", "Gained access this year", "Not Able to Work")
 - Disability
 - Sex
 - Work status (Wage-employed, Self-employed, Sheltered workshop)

Functions for Each:
 - Already had access in the previous year
 - Gained access this year
 - Total of the previous two
 - Not Able to Work
 

```sql
SELECT
  id,
  member:members (
    sex,
    birthday
  ),
  relationship_cc (
    child:children (
      id,
      member:members (
        first_name,
        last_name,
        sex,
        birthday
      ),
      disability_category (name)
    )
  )
  employment_status(*)
```

```json
{
  eq: {
    'members.sex': reportParams.sex,                                    // sex
    'social_protection_status.x': true,          // participation in x group (participates_family_life, participates_community_club)
  },
  ilike: { 'disability_category.name': reportParams.disability.ilike},  // disabilities
  gte: { 'members.birthday': birthdayRange.gte },                       // age min
  lte: { 'members.birthday': birthdayRange.lte },                       // age max
}
```