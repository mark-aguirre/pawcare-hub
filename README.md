# PawCare Hub - Veterinary Practice Management System

A modern, responsive veterinary practice management system built with Next.js and shadcn/ui.

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Features

- **Dashboard**: Overview of clinic operations with key metrics
- **Pet Management**: Comprehensive pet profiles and medical history
- **Owner Management**: Client information and contact details
- **Appointment Scheduling**: Calendar-based appointment system
- **Medical Records**: Digital health records and treatment history
- **Inventory Management**: Track supplies and medications
- **Billing System**: Invoice generation and payment tracking
- **Reports**: Analytics and business insights

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with modern hooks
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── [routes]/       # Route pages
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── layout/        # Layout components
│   └── [features]/    # Feature-specific components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── data/              # Mock data and constants
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
