
# Testing

There are multiple ways we can test our products

For front-end developers and designers, simply use storybook as it creates a platform for you to tests GUI.

To execute story book execute the following command to boot it up, then you can go to `http://localhost:6006/`.

```bash
npm run storybook
```

Here is what it looks like:

![Storybook](media/storybook-usage.gif)

For back-end developers, simply use vitest.

```bash
npm run test
```

# Supabase Local Instance
This is useful for creating test data without involving the main database.

## Requirements
1. [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/)
2. [Supabase CLI](https://supabase.com/docs/guides/local-development)

## Docker Settings
On Settings (top-right) > General, make sure the following are checked:
1. ``Expose daemon on txp://localhost:2375 without TLS``
2. ``Use the WSL 2 based engine``
3. ``Add the *.docker.internal names to the host's /etc/hosts files (Requires password)``

## Running Locally
1. Go to the ``qa/local`` branch
2. Install Supabase CLI with ``npm install supabase --save-dev``
3. Run ``npx supabase login`` to connect your supabase account
4. Run ``npx supabase link --project-ref <project link id>`` (Check url when accessing the supabase project remotely, the random string of characters is all you copy + paste)
5. You will be requested to input the database password, input will be hidden so you can't see what you type. Just copy + paste the password and click enter.
6. Run ``npx supabase start``. Final output should be a list of URLs and keys
7. Go to http://127.0.0.1:54323/ for Supabase Studio and view your local instance of Supabase

## Getting the Schema
1. If there are any changes to the schema, run ``npx supabase db pull``
This will create a new ``.sql`` file under the ``supabase/migrations/`` folder, which contains the script for creating the schema, complete with any functions, triggers, enums, indexes, etc.
2. Run ``npx supabase db reset`` to make the local instance initialize with any new changes

## Getting the Data
- ``supabase/seed.sql`` is used for inserting any data into the database locally. This is not included in the qa/local branch since it contains passwords (albeit encrypted so it shouldn't matter much but just to be safe)
- To get all data from the remote version, run ``npx supabase db dump --data-only -f supabase/seed.sql -- linked``
- Run ``npx supabase db reset`` to make the local instance initialize with any new changes
