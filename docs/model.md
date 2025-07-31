# Architecture Design Documentation

## Overview

## Problem

To get the reasoning behind the codebase, its best to breakdown the problem the first developers are trying to solve.

### What is the problem to solve?

**Settling** **Stacks** and **Stockpiles** of Documents - a troublesome heap of problems for any office worker to go through. Its an office worker's job to approve and input the correct data into the archival system of the organization. There are **many** *reports* and *lists* to generate, *approvals* and *rejections* to go through and so much more to go through in order to get up to speed with an organization's current state. It can be tiresome and a headache to go through, wouldn't it nice if it was automated somehow?

### Why does it exist?

Kaisaka is an education-based organization that has to keep track of hundreds of children, adults, and caregivers. Thus, it is required to take account of each person - along with their detailed information - throughout the years that they are admitted within the confines of the organization. Racking out hundreds of required papers to keep track of. This is an exhaustive activity that is best done

### How to approach it?

#### How Big and Complicated is it?

There's a lot of moving parts, as children, caregiver, and members data interact with each other. Thus, its essential to be able to modify and edit a lot of these moving parts independently of each other.

#### How to Approach it?

To any future developers, this is originally developed by group college students in their CSSWENG class of De La Salle University of AY2024-2025 Term 3, so we had to approach it with what we've experienced so far in our studies. As such, we're limited to a limited extension of the Model-View-Controller (MVC) based system since that is what we are confident working on.

## Solution

This codebase implements a sophisticated **Repository Design Pattern** combined with several other design patterns to create a robust data access layer for a children's welfare management system. The implementation provides a clean abstraction between the business logic and data persistence layers.

## Core Design Patterns

### 1. Repository Pattern

The primary pattern that encapsulates data access logic and provides a more object-oriented view of the persistence layer.

### 2. Singleton Pattern

Each model implements the Singleton pattern to ensure single instance access:

```typescript
export class ChildrenModel extends TableManager<"children">('children') {
  public static instance: ChildrenModel = new ChildrenModel();
}
```

### 3. Generic Factory Pattern

The `TableManager` function acts as a factory that creates type-safe repository classes:

```typescript
export default function TableManager<T extends tableNames>(table: T)
```

### 4. Template Method Pattern

The base `TableManager` class defines the skeleton of database operations while allowing subclasses to implement specific behaviors.

### 5. RBAC (Role-Based Access Control) Pattern

The schema includes comprehensive tables for managing permissions, roles, and user access:

- `roles` table for role definitions
- `permissions` table for granular permissions
- `role_permissions` for role-permission mapping
- `user_roles` for user-role assignments

## Architecture Components

### Base Repository (`TableManager`)

The `TableManager` serves as the foundational repository class that all model classes inherit from. It provides:

#### Core CRUD Operations

- **Create**: `insertOne()`, `insertMany()`
- **Read**: `findOne()`, `findMany()`, `findById()`
- **Update**: `updateOne()`
- **Delete**: `deleteOne()`

#### Advanced Query Capabilities

- **Filtering**: Comprehensive filter system with operators (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`, `isNot`)
- **Sorting**: Configurable ordering with `order` parameter
- **Pagination**: Built-in support with `limit` and `offset`
- **Joins**: Complex relationship queries with `findWithJoin()` and `findOneWithJoin()`
- **Counting**: Aggregation support with `count()` and `findWithJoinAndCount()`

#### Type Safety Features

```typescript
export type tableRow<T extends tableNames> 
= Database['public']['Tables'][T]['Row'] & Record<string, unknown>

export type tableInsert<T extends tableNames>
= Database['public']['Tables'][T]['Insert']

export type tableUpdate<T extends tableNames>
= Database['public']['Tables'][T]['Update']
```

### Query Configuration System

The `QueryConfigurationBuilder` interface provides a flexible, type-safe way to construct complex database queries:

```typescript
export interface QueryConfigurationBuilder{
  where?: Partial<tableRow<tableNames>>;
  eq?: Record<string, string | number | boolean>;
  neq?: Record<string, string | number | boolean>;
  gt?: Record<string, Date | string | number>;
  gte?: Record<string, Date | string | number>;
  lt?: Record<string, Date | string | number>;
  lte?: Record<string, Date | string | number>;
  like?: Record<string, string>;
  ilike?: Record<string, string>;
  in?: Record<string, (string | number)[]>;
  is?: Record<string, boolean | null>;
  isNot?: Record<string, boolean | null>;
  order?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
}
```

## Model Implementation Example: ChildrenModel

The `ChildrenModel` demonstrates how domain-specific repositories extend the base `TableManager`:

### Business Logic Methods

```typescript
async insertChild(
  has_philhealth: boolean,
  has_barangay_cert: boolean, 
  has_birth_cert: boolean, 
  has_medical_cert: boolean, 
  is_active: boolean, 
  member_id: string, 
  pwd_id: string | null, 
  disability_id: number | null,
  disability_nature: string | null,
  remarks: string | null,
  has_national_id: boolean,
  has_vote: boolean 
): Promise<ChildrenRow | null>
```

### Specialized Query Methods

- `findActiveChildren()`: Business logic for active status filtering
- `findByDisabilityId()`: Domain-specific filtering by disability
- `findThroughJoin_Caregivers()`: Complex join operations for relationships

### Document Status Management

- `updateBarangayCert()`, `updateBirthCert()`, `updateMedCert()`: Granular document status updates
- `getPendingDocuments()`: Business intelligence queries

## API Integration Pattern

The repository pattern integrates seamlessly with SvelteKit API routes:

```typescript
export const GET: RequestHandler = async ({ params, url}) => {
    const id = params.id;
    const joinParams = parseJoinParams(url)
    
    if (!joinParams.hasParams)
        child = await ChildrenModel.instance.findById(id)
    else {
        switch (joinParams.select) {
            case 'caregivers': 
                child = await ChildrenModel.instance.findThroughJoin_Caregivers(id)
                break;
            case 'pending-documents':
                child = await ChildrenModel.instance.getPendingDocuments(id)
                break;
            case 'full-profile':
                child = await ChildrenModel.instance.getJoin(
                    '*, members(*), education_status(*), disability_category(*)',
                    { id: id }
                );
                break;
        }
    }
};
```

## Benefits of This Implementation

### 1. **Type Safety**

- Full TypeScript integration with Supabase-generated types
- Compile-time validation of database operations
- IntelliSense support for all database fields

### 2. **Code Reusability**

- Base repository eliminates code duplication
- Consistent interface across all models
- Shared query building and filtering logic

### 3. **Maintainability**

- Clear separation of concerns
- Centralized database logic
- Easy to modify and extend

### 4. **Testability**

- Repository interface can be easily mocked
- Business logic separated from data access
- Each model can be unit tested independently

### 5. **Performance Optimization**

- Built-in query optimization with selective joins
- Efficient pagination and filtering
- Count operations without data transfer

### 6. **Scalability**

- Easy to add new tables/models
- Consistent patterns across the application
- Supports complex relationships and queries

## Usage Patterns

### Basic CRUD Operations

```typescript
// Create
const newChild = await ChildrenModel.instance.insertChild(params...);

// Read
const child = await ChildrenModel.instance.findById(id);
const activeChildren = await ChildrenModel.instance.findActiveChildren();

// Update
await ChildrenModel.instance.updateActiveStatus(id, false);

// Delete
await ChildrenModel.instance.deleteById(id);
```

### Complex Queries with Joins

```typescript
// Get child with full profile
const fullProfile = await ChildrenModel.instance.getJoin(
  '*, members(*), education_status(*), disability_category(*)',
  { id: childId }
);

// Get children list with member information
const childrenList = await ChildrenModel.instance.getChildrenList();
```

### Filtered Queries

```typescript
// Find children with specific criteria
const filteredChildren = await ChildrenModel.instance.findMany(
  { is_active: true },
  {
    eq: { disability_id: 1 },
    order: [{ column: 'created_at', ascending: false }],
    limit: 10
  }
);
```

## Model List and Responsibilities

The system includes comprehensive models for all database entities:

- **activityModel.ts**: Program activity management
- **addressesModel.ts**: Geographic address handling
- **annualProgramModel.ts**: Yearly program administration
- **attendanceLogModel.ts**: Activity participation tracking
- **barangaysModel.ts**: Administrative subdivision management
- **caregiverGroupsModel.ts**: Caregiver community organization
- **caregiversModel.ts**: Adult responsible person management
- **childrenModel.ts**: Child welfare recipient management
- **citiesModel.ts**: City-level geographic data
- **communityGroupTypeModel.ts**: Community group classification
- **disabilityCategoryModel.ts**: Disability type standardization
- **educationStatusModel.ts**: Educational progress tracking
- **employmentStatusModel.ts**: Employment status management
- **familiesModel.ts**: Family unit organization
- **FamilyMembersModel.ts**: Family relationship management
- **incomeTypeModel.ts**: Income classification and tracking
- **interventionHistoryModel.ts**: Historical intervention tracking
- **interventionModel.ts**: Active intervention management
- **majorTargetActivityModel.ts**: Planned program activities
- **MemberShipAnnualRenewalModel.ts**: Membership renewal processing
- **MembershipPaymentModel.ts**: Fee collection management
- **membersModel.ts**: Central person registry
- **pwdIdsModel.ts**: PWD identification management
- **relationshipCCModel.ts**: Child-caregiver relationship mapping
- **serviceCategoryModel.ts**: Service type classification
- **serviceObjectiveModel.ts**: Program objective management
- **socialParticipationModel.ts**: Community involvement tracking
- **socialProtectionStatusModel.ts**: Government assistance status

## Best Practices Implemented

1. **Single Responsibility**: Each model handles one entity type
2. **DRY Principle**: Common functionality centralized in TableManager
3. **Open/Closed Principle**: Easy to extend without modifying base classes
4. **Interface Segregation**: Specific methods for specific needs
5. **Dependency Inversion**: Models depend on abstractions, not concretions

## Conclusion

This Repository Pattern implementation provides a robust, scalable, and maintainable foundation for a complex children's welfare management system. The combination of TypeScript type safety, comprehensive query capabilities, and clean architectural patterns makes it an excellent example of modern software design principles in practice.
