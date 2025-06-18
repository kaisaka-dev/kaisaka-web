# Database

This is where our database managers would be.

3 tasks that we can easily separate else we make it very redundant for us

- better dev experience, so we use this pattern

## Database repository

- will interact with the supabase backend, all logic is handled by this repository (this file)

## Concrete repositories

- actual implementation of this (DB repository) abstract notion of a repository

## API logic / controller interface

- any communications with the client will be handled here
- ex: client needs to know certain barangays in the neighborhood
- ex: if they have invalid data, it'll send it in a message / 400 bad request type thing

## Example: Barangay pipeline

- deals with everything barangay information
- database logic / table manager: anything with supabase, it'll handle it
  - delicate, refrain from touching unless necessary
- business logic / barangay model: a class that can communicate with the table manager
  - barangay model is handled by the barangay api, it will handle all the requests related to the barangay object logic
  - if you want to find a certain name / city / etc.
- controller logic / barangay api: the code will just validate anything from the client

note to developers: roan already made it work, so if you want you can just replicate the existing barangay stuff (the thought pattern, so dont need to think too much)

- business logic: it creates crud operations (every single model should handle every single crud operation right here)
- if you're developing: prioritize the model first, then do API after

note to QA: based on the model, you can create unit tests / future unit tests ahead of time

note to designers: for the api, if you need to retrieve any sort of information, ex: login page, if you want to search children, go to children api and search for whatever necessary headers / body you need to pass.

note to @ImaginaryLogs: session api soon
