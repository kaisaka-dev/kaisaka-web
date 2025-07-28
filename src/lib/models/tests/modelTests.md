# Model Test Suite Documentation

This document provides an overview of the unit tests for the models using the [Vitest](https://vitest.dev/) testing framework. The tests validate the correct behavior of CRUD operations and other specific methods.

---

## Testing Setup

- **Testing Framework:** Vitest
- **Mocking:** The Supabase client (`$lib/types/client.js`) is mocked to isolate the database layer.
- **Utilities Used:**
  - `vi.fn()` for mocking methods.
  - `vi.clearAllMocks()` in `beforeEach` to reset mocks between tests.

---

## Mocked Dependencies

```ts
vi.mock('$lib/types/client', () => ({
  supabase: {
    from: vi.fn()
  }
}));
```

This ensures tests are decoupled from the actual Supabase client.

---
# `ActivityModel` Test Suite

## Sample Data

```ts
const sampleActivity = {
  id: 1,
  target_activity_id: 2,
  name: 'Activity',
  type: 'Dark',
  date_and_time_conducted: '2025-04-01T00:00:00Z',
  indicators: 'Indicator',
  outcome: 'Success',
  remarks: 'Remarkable',
  date_and_time_created: '2025-04-01T00:00:00Z',
  date_and_time_last_updated: '2025-04-01T00:00:00Z',
  completion_status: 'completed'
};
```
```ts
const sampleActivity = {
  id: 1,
  target_activity_id: 2,
  name: 'Activity',
  type: 'Dark',
  date_and_time_conducted: '2025-04-01T00:00:00Z',
  indicators: 'Indicator',
  outcome: 'Success',
  remarks: 'Remarkable',
  date_and_time_created: '2025-04-01T00:00:00Z',
  date_and_time_last_updated: '2025-04-01T00:00:00Z',
  completion_status: 'completed'
};
```

---

## Create Methods

### `insertActivity(name, type, targetId, datetime, status, indicators, outcome, remarks)`

| Test Case | Description |
|-----------|-------------|
|  Creates new activity | Returns `sampleActivity` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleActivity` |
|  Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleActivity]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByType(type)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleActivity]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByTargetActivityId(targetId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleActivity]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

---

## Update Methods

### `updateName(id, newName)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateCompletionStatus(id, newStatus)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateOutcome(id, newOutcome)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

## Delete Method

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `AddressesModel` Test Suite

## Sample Data

All tests use a predefined mock address object:

```ts
const sampleAddress = {
  barangay_id: 1,
  address: '25 Hop Avenue',
  id: 'uuid-some-unique-id',
};
```

---

## Create Methods

### `insertAddress(address, barangayId)`

| Test Case | Description |
|-----------|-------------|
|  Inserts new address | Returns `sampleAddress` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleAddress` |
|  Not Found | Returns `null` |

### `findByAddress(address)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleAddress]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByBarangayId(barangayId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleAddress]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

---

## Update Methods

### `updateAddress(id, newAddress)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateBarangayId(id, newBarangayId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

## Delete Method

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `annualProgramModel` Test Suite

## Sample Data

All tests use a predefined mock annual program object:

```ts
const sampleProgram = {
    id: 1,
    start_year: 2023,
    start_month: 1,
    start_date: 1,
    end_year: 2023,
    end_month: 12,
    end_date: 31,
    target_new_cwds: 50,
    general_reflection: 'Reflection',
    lessons_learned: 'Learned a lot',
    date_created: '2023-01-01T00:00:00.000Z'
};
```

---

## Create Methods

### `insertAnnualProgram(programData)`

| Test Case | Description |
|-----------|-------------|
|  Inserts new program | Returns `sampleProgram` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findByStartYear(startYear)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleProgram]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByEndYear(endYear)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleProgram]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByTargetCwds(targetCount)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleProgram]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

---

## Update Methods

### `updateProgramDates(id, dateUpdates)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateProgramContent(id, contentUpdates)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateFullProgram(id, updates)`

| Test Case | Description |
|-----------|-------------|
|  Success with multiple fields | Returns `true` |
|  Failure with multiple fields | Returns `false` |

---

# `AttendanceLogModel` Test Suite

## Sample Data

```ts
const sampleAttendanceLog = {
    id: 1,
    conducted_activity_id: 2,
    participant_id: 'uuid-participant',
    is_late: false,
    participant_type: 'child',
    individual_intervention_plan: true,
    transition_graduation_plan: false,
    remarks: 'Remarkable'
};
```

## Create Methods

### `insertAttendanceLog(conductedActivityId, participantId, isLate, participantType, individualInterventionPlan, transitionGraduationPlan, remarks)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleAttendanceLog` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleAttendanceLog` |
|  Not Found | Returns `null` |

### `findByConductedActivityId(conductedActivityId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleAttendanceLog]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByParticipantId(participantId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleAttendanceLog]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findLateAttendances()`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleAttendanceLog]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateLateStatus(id, isLate)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `BarangayModel` Test Suite

## Sample Data

```ts
const sampleBarangay = {
    id: 1,
    name: 'Test',
    num: '1234567890',
    city_id: 10
};
```

## Create Methods

### `insertBarangay(name, cityId, num)`

| Test Case | Description |
|-----------|-------------|
|  Inserts barangay | Returns `sampleBarangay` if insertion succeeds |
|  Missing required values | Returns `null` if insertion fails |

## Read Methods

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleBarangay]` |
|  Not Found | Returns `null` |
|  Error | Returns `null` |

### `findByCityId(cityId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleBarangay]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByNum(num)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleBarangay]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateCityId(id, cityId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateNum(id, num)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteBarangay(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `CaregiverGroupsModel` Test Suite

## Sample Data

```ts
const sampleCaregiverGroup = {
    id: 1,
    caregiver_id: 'uuid-caregiver',
    community_group_id: 2,
    date_joined: '2025-04-01T00:00:00Z',
    date_left: '2025-04-01T00:00:00Z'
};
```

## Create Methods

### `insertCaregiverGroup(caregiverId, communityGroupId, dateJoined, dateLeft)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleCaregiverGroup` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiverGroup` |
|  Not Found | Returns `null` |

### `findByCaregiverId(caregiverId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCaregiverGroup]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findByCommunityGroupId(communityGroupId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCaregiverGroup]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findActiveMembers()`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCaregiverGroup]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findInactiveMembers()`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCaregiverGroup]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateDateLeft(id, dateLeft)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateDateJoined(id, dateJoined)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `markAsLeft(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `reactivateMembership(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `deleteByCaregiverId(caregiverId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `CaregiversModel` Test Suite

## Sample Data

```ts
const sampleCaregiver = {
    id: 'uuid-caregiver-id',
    member_id: 'uuid-member-id',
    income_id: 123456789,
    caregiver_group_id: 1,
    contact_number: '09123456789',
    facebook_link: 'https://facebook.com/test',
    email: 'test@gmail.com',
    occupation: 'Housewife',
};
```

## Create Methods

### `insertCaregiver(memberId, incomeId, contactNumber, facebookLink, email, occupation)`

| Test Case | Description |
|-----------|-------------|
|  Creates new caregiver | Returns `sampleCaregiver` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `null` |

### `findByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `null` |

### `findByContactNumber(contactNumber)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `null` |

### `findByEmail(email)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `null` |

### `findByOccupation(occupation)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCaregiver]` |
|  Not Found | Returns `[]` |

### `findByFacebookLink(facebookLink)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `null` |

### `findByIncomeId(incomeId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCaregiver` |
|  Not Found | Returns `[]` |

### `getAll()`

| Test Case | Description |
|-----------|-------------|
|  Returns records | Returns array of caregivers |
|  No records found | Returns `[]` |

## Update Methods

### `updateContactNumber(id, contactNumber)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateOccupation(id, occupation)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateEmail(id, email)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateFacebookLink(id, facebookLink)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateContactInfo(id, contactInfo)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateCaregiver(id, updates)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateIncomeId(id, incomeId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `deleteByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `ChildrenModel` Test Suite

## Sample Data

```ts
const sampleChild = {
    id: 'uuid-child-id',
    has_philhealth: true,
    has_birth_cert: true,
    has_medical_cert: true,
    has_barangay_cert: true,
    remarks: 'Sample remarks',
    is_active: true,
    member_id: 'uuid-member-id',
    pwd_id: 'pwd-123',
    disability_id: 1,
    disability_nature: 'Nature',  
    has_vote: true,
    has_national_id: true
};
```

## Create Methods

### `insertChild(hasPhilhealth, hasBirthCert, hasMedicalCert, hasBarangayCert, hasVote, memberId, pwdId, disabilityId, disabilityNature, remarks, isActive, hasNationalId)`

| Test Case | Description |
|-----------|-------------|
|  Creates new child | Returns `sampleChild` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleChild` |
|  Not Found | Returns `null` |

### `findByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleChild` |
|  Not Found | Returns `null` |

### `findByDisabilityId(disabilityId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleChild]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findActiveChildren()`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleChild]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
|  No filter | Returns `[sampleChild]` |
|  With filter | Returns `[sampleChild]` |
|  No matches | Returns `[]` |
|  Query fails | Returns `null` |

## Update Methods

### `updateBarangayCert(id, hasBarangayCert)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateBirthCert(id, hasBirthCert)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateMedCert(id, hasMedicalCert)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updatePhilHealthId(id, hasPhilhealth)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateActiveStatus(id, isActive)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updatePwdId(id, pwdId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateDisabilityInfo(id, disabilityId, disabilityNature)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `deleteByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `CitiesModel` Test Suite

## Sample Data

```ts
const sampleCity = {
    id: 10,
    city_name: 'City',
};
```

## Create Methods

### `insertCity(cityName)`

| Test Case | Description |
|-----------|-------------|
|  Inserts new city | Returns `sampleCity` if insertion succeeds |
|  Missing required values | Returns `null` if insertion fails |

## Read Methods

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCity` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCity` |
|  Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCity` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `CommunityGroupTypeModel` Test Suite

## Sample Data

```ts
const sampleCommunityGroupType = {
    id: 1,
    name: 'Name'
};
```

## Create Methods

### `insertCommunityGroupType(name)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleCommunityGroupType` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCommunityGroupType` |
|  Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleCommunityGroupType` |
|  Not Found | Returns `null` |

### `findByNameKeyword(keyword)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCommunityGroupType]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `getAll()`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleCommunityGroupType]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `exists(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `true` |
|  Not Found | Returns `false` |

### `existsById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `true` |
|  Not Found | Returns `false` |

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `deleteByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `DisabilitiesModel` Test Suite

## Sample Data

```ts
const sampleDisability = {
    id: 10000000,
    name: 'Sample Disability'
};
```

## Create Methods

### `insertDisability(name)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleDisability` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleDisability` |
|  Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleDisability]` |
|  Not Found | Returns `[]` |
|  Error | Returns `null` |

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
|  No filter | Returns `[sampleDisability]` |
|  With filter | Returns `[sampleDisability]` |
|  No matches | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `DisabilityCategoryModel` Test Suite

## Sample Data

```ts
const sampleDisability = {
    id: 1,
    name: 'Disability1'
};
```

## Create Methods

### `insertDisabilityCategory(name)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleDisability` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleDisability` |
|  Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleDisability` |
|  Not Found | Returns `[]` |

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
|  With filter | Returns filtered results |
|  No filter | Returns all records |
|  No records | Returns `[]` |
|  Error | Returns `null` |

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---

# `DisabilityStatusModel` Test Suite

## Sample Data

```ts
const sampleDisabilityStatus = {
    id: 11000000,
    disability_id: 10000000,
    disability_nature: 'Disability Nature',
    date_created: '2025-01-01T00:00:00Z',
    last_updated: '2025-01-01T00:00:00Z',
    child_id: 'uuid-child-id',
};
```

## Create Methods

### `insertDisabilityStatus(childId, disabilityId, disabilityNature)`

| Test Case | Description |
|-----------|-------------|
|  Creates new record | Returns `sampleDisabilityStatus` if insertion succeeds |
|  Fails to insert | Returns `null` if insertion fails |

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `sampleDisabilityStatus` |
|  Not Found | Returns `null` |

### `findByChildId(childId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleDisabilityStatus]` |
|  Not Found | Returns `null` |

### `findByDisabilityId(disabilityId)`

| Test Case | Description |
|-----------|-------------|
|  Found | Returns `[sampleDisabilityStatus]` |
|  Not Found | Returns `null` |

## Update Methods

### `updateDisabilityNature(id, newNature)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

### `deleteByChildId(childId)`

| Test Case | Description |
|-----------|-------------|
|  Success | Returns `true` |
|  Failure | Returns `false` |

---
# `MembersModel` Test Suite

## Sample Data

```ts
const sampleMember = {
    id: 'uuid-member-id',
    first_name: 'Test',
    middle_name: 'M',
    last_name: 'User',
    birthday: '2000-01-01',
    sex: 'Male',
    admission_date: '2020-01-01',
    date_created: '2020-01-01',
    last_updated: '2021-01-01',
    last_approved: '2021-06-01',
    address_id: 'uuid-address-id'
};
```

---

## Create Methods

### `insertMember(memberData)`

| Test Case | Description |
|-----------|-------------|
| Creates new member | Returns `sampleMember` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findByFirstName(firstName)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleMember]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

### `findByLastName(lastName)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleMember]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

### `findByBirthday(birthday)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleMember]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

---

## Update Methods

### `updateMemberInfo(id, updates)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateAddress(id, addressId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateAdmissionDate(id, admissionDate)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `EmploymentStatusModel` Test Suite

## Sample Data

```ts
const sampleEmployment = {
    id: 1,
    able_to_work: true,
    employment_type: 'Wage Employed',
    member_id: 'uuid-member-id'
};
```

---

## Create Methods

### `insertEmploymentStatus(ableToWork, employmentType, memberId)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleEmployment` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleEmployment` |
| Not Found | Returns `null` |

### `findByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleEmployment` |
| Not Found | Returns `null` |

---

## Update Methods

### `updateEmploymentStatus(id, ableToWork, employmentType)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `FamiliesModel` Test Suite

## Sample Data

```ts
const sampleFamily = {
    id: 'uuid-family-id',
    date_created: '2025-01-01T00:00:00.000Z'
};
```

---

## Create Methods

### `createFamily()`

| Test Case | Description |
|-----------|-------------|
| Creates new family | Returns `sampleFamily` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleFamily` |
| Not Found | Returns `null` |

### `getAll()`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamily]` |
| Not Found | Returns `null` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `FamilyMembersModel` Test Suite

## Sample Data

```ts
const sampleFamilyMember = {
    family_id: 'family-uuid',
    member_id: 'member-uuid',
    is_child: false,
    relationship_type: 'Father',
    date_added: '2025-01-01T00:00:00.000Z'
};
```

---

## Create Methods

### `insertFamilyMember(familyId, memberId, isChild, relationshipType)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleFamilyMember` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamilyMember]` |
| Not Found | Returns `null` |

### `findByMemberId(memberId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamilyMember]` |
| Not Found | Returns `null` |

### `findByRelationshipType(relationshipType)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamilyMember]` |
| Not Found | Returns `null` |

### `findChildrenByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamilyMember]` |
| Not Found | Returns `null` |

### `findAdultsByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleFamilyMember]` |
| Not Found | Returns `null` |

---

## Update Methods

### `updateRelationshipType(familyId, memberId, relationshipType)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateChildStatus(familyId, memberId, isChild)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateFamilyMember(familyId, memberId, updates)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `removeFamilyMember(familyId, memberId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `removeAllFamilyMembers(familyId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `removeMemberFromAllFamilies(memberId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `IncomeTypeModel` Test Suite

## Sample Data

```ts
const sampleIncomeType = {
    id: 1,
    name: 'Income Type 1'
};
```

---

## Create Methods

### `insertIncomeType(name)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleIncomeType` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleIncomeType` |
| Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleIncomeType` |
| Not Found | Returns `null` |

### `findByNameKeyword(keyword)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleIncomeType]` |
| Not Found | Returns `[]` |

### `getAll()`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleIncomeType]` |
| Not Found | Returns `[]` |

---

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByName(name)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Utility Methods

### `exists(name)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `true` |
| Not Found | Returns `false` |

### `existsById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `true` |
| Not Found | Returns `false` |

---

# `InterventionHistoryModel` Test Suite

## Sample Data

```ts
const sampleInterventionHistory = {
    id: 'uuid-history-id',
    intervention_id: 'uuid-intervention-id',
    improvement: '2025-05-01T00:00:00Z',
    status: 'Improved',
    remarks: 'Remarkable progress',
    date_checked: '2025-05-01'
};
```

---

## Create Methods

### `recordInterventionHistory(interventionId, improvement, status, remarks, dateChecked)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleInterventionHistory` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleInterventionHistory` |
| Not Found | Returns `null` |

### `findByInterventionId(interventionId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleInterventionHistory]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

### `findByStatus(status)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleInterventionHistory]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

---

## Update Methods

### `updateHistoryRecord(id, updates)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `InterventionModel` Test Suite

## Sample Data

```ts
const sampleIntervention = {
    id: 'uuid-intervention-id',
    service_category_id: 2,
    intervention: 'string',
    date_created: '2025-04-01T00:00:00Z',
    last_updated: '2025-04-01T00:00:00Z',
    status: 'Neutral',
    remarks: 'Remarks',
    child_id: 'uuid-child-id'
};
```

---

## Create Methods

### `insertIntervention(childId, intervention, remarks, serviceCategoryId, status)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleIntervention` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleIntervention` |
| Not Found | Returns `null` |

### `findByChild(childId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleIntervention` |
| Not Found | Returns `null` |

### `findByServiceCategoryId(serviceCategoryId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleIntervention]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

### `findByStatus(status)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleIntervention]` |
| Not Found | Returns `[]` |
| Error | Returns `null` |

---

## Update Methods

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `MajorTargetActivityModel` Test Suite

## Sample Data

```ts
const sampleMajorTargetActivity = {
    id: 1,
    service_objective_id: 1,
    name: 'Major Target Activity',
    type: 'Activity',
    target_no_of_participants: 10,
    date_and_time_created: '2025-01-01T00:00:00.000Z',
    date_and_time_last_updated: '2025-01-01T00:00:00.000Z',
    remarks: 'Additional remarks'
};
```

---

## Create Methods

### `insertMajorTargetActivity(name, type, serviceObjectiveId, targetParticipants)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleMajorTargetActivity` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleMajorTargetActivity` |
| Not Found | Returns `null` |

### `findByName(name)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleMajorTargetActivity` |
| Not Found | Returns `[]` |

### `findByType(type)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleMajorTargetActivity` |
| Not Found | Returns `[]` |

### `findByServiceObjectiveId(serviceObjectiveId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleMajorTargetActivity` |
| Not Found | Returns `[]` |

---

## Update Methods

### `updateName(id, name)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateTargetParticipants(id, targetParticipants)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `MembershipAnnualRenewalModel` Test Suite

## Sample Data

```ts
const sampleRenewal = {
    id: 1,
    annual_program_id: 101,
    family_id: 'uuid-family',
    total_amount_due: 200,
    remarks: 'Sample remarks',
    date_created: '2025-01-01T00:00:00Z',
    last_updated: '2025-01-01T00:00:00Z'
};
```

---

## Create Methods

### `insertRenewal(annualProgramId, familyId, totalAmountDue, remarks)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `sampleRenewal` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findById(id)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleRenewal` |
| Not Found | Returns `null` |

### `findByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleRenewal]` |
| Error | Returns `null` |

### `findByAnnualProgramId(annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[sampleRenewal]` |
| Error | Returns `null` |

### `findByFamilyAndProgram(familyId, annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `sampleRenewal` |
| Not Found | Returns `null` |

### `findByAmountRange(minAmount, maxAmount?)`

| Test Case | Description |
|-----------|-------------|
| Found within range | Returns `[sampleRenewal]` |
| No max amount | Returns `[sampleRenewal]` |
| Error | Returns `null` |

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
| No filter | Returns `[sampleRenewal]` |
| Error | Returns `null` |

---

## Update Methods

### `updateTotalAmountDue(id, totalAmountDue)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateRemarks(id, remarks)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateAnnualProgram(id, annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateRenewal(id, updates)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteById(id)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByAnnualProgramId(annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

# `MembershipPaymentModel` Test Suite

## Sample Data

```ts
const samplePayment = {
    annual_program_id: 1,
    family_id: 'uuid-family-id',
    amount_paid: 1000,
    date_paid: '2025-06-01T00:00:00.000Z',
    date_created: '2025-06-01T00:00:00.000Z',
    remarks: 'Paid in full'
};
```

---

## Create Methods

### `insertPayment(annualProgramId, familyId, amountPaid?, datePaid?, remarks?)`

| Test Case | Description |
|-----------|-------------|
| Creates new record | Returns `samplePayment` if insertion succeeds |
| Fails to insert | Returns `null` if insertion fails |

---

## Read Methods

### `findByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[samplePayment]` |
| Not Found | Returns `null` |

### `findByAnnualProgramId(annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[samplePayment]` |
| Not Found | Returns `null` |

### `findByFamilyAndProgram(familyId, annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[samplePayment]` |
| Not Found | Returns `null` |

### `findByAmountRange(minAmount, maxAmount)`

| Test Case | Description |
|-----------|-------------|
| Found within range | Returns `[samplePayment]` |
| Error | Returns `null` |

### `findByDateRange(startDate, endDate)`

| Test Case | Description |
|-----------|-------------|
| Found within range | Returns `[samplePayment]` |
| Error | Returns `null` |

### `findUnpaidRecords(annualProgramId?)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[samplePayment]` |
| Error | Returns `null` |

### `findPaidRecords(annualProgramId?)`

| Test Case | Description |
|-----------|-------------|
| Found | Returns `[samplePayment]` |
| Error | Returns `null` |

### `getAll(filter?)`

| Test Case | Description |
|-----------|-------------|
| With filter | Returns `[samplePayment]` |
| No records | Returns `null` |

---

## Update Methods

### `updateAmountPaid(annualProgramId, familyId, amountPaid)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateDatePaid(annualProgramId, familyId, datePaid)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updateRemarks(annualProgramId, familyId, remarks)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `recordPayment(annualProgramId, familyId, amountPaid, datePaid?)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `updatePayment(annualProgramId, familyId, updates)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---

## Delete Methods

### `deleteByFamilyAndProgram(annualProgramId, familyId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByFamilyId(familyId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

### `deleteByAnnualProgramId(annualProgramId)`

| Test Case | Description |
|-----------|-------------|
| Success | Returns `true` |
| Failure | Returns `false` |

---