
# Kaisaka Web

[![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff)](#) [![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)](#) [![Jira](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=fff)](#) [![SvelteKit](https://img.shields.io/badge/SvelteKit-%23f1413d.svg?logo=svelte&logoColor=white)](#) [![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

Kaisaka Web is a social welfare management platform for organizations supporting children with disabilities and their families. It provides tools for registration, record management, activity tracking, reporting, and analytics, built with SvelteKit, Supabase, and PostgreSQL.

---

## Features

- **Authentication**: Secure login and registration for staff and caregivers.
- **Children Management**: Register, view, and manage child records, including certificates and disability info.
- **Caregivers Management**: Register and manage caregiver profiles, occupations, and income.
- **Family Management**: Link children and caregivers, view family structures, and manage relationships.
- **Membership Payments**: Track membership payments and annual renewals.
- **Interventions & History**: Plan, record, and review interventions for children and families.
- **Attendance Tracking**: Log attendance for events and activities.
- **Service Objectives & Activities**: Organize, categorize, and track program objectives and activities.
- **Reporting**: Generate, view, and export annual/quarterly reports with auto-generated statistics.
- **Dashboard**: Visual summaries of key metrics, including intervention coverage and activity progress.
- **Logging**: Audit trails and error tracking for reliability.
- **Testing**: Integrated unit and UI tests for quality assurance.

---

## Architecture

- **Client Layer**: SvelteKit frontend with DaisyUI for responsive, accessible UI.
- **API Layer**: SvelteKit API routes for business logic, validation, and data exchange.
- **Domain Layer**: Models and repositories encapsulate business logic and data access.
- **Infrastructure Layer**: Supabase/PostgreSQL for data storage, Supabase Auth for authentication, Logger for audit and error tracking, Report Generator for exports.
- **Deployment Layer**: Hosted on Vercel for fast, scalable delivery.

See [docs/media/Kaisaka Technical Map.png](docs/media/Kaisaka%20Technical%20Map.png) for a visual overview.

---

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/your-org/kaisaka-web.git
cd kaisaka-web
```
2. Install dependencies
```bash
npm install
```

3. Configure environment

Copy .env.example to .env and fill in Supabase and other secrets.

4. Run locally
```bash
npm run dev
```
5. Run tests
```bash
npm run test
```

## Documentation

- Home
- API Routes
- Database Models
- Testing
- Reports
- Contributing

## Contributing

See CONTRIBUTING.md for coding standards, design patterns, and workflow.


