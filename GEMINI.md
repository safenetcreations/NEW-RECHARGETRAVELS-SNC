# Project Overview

This is a premium travel booking platform for Sri Lanka, built with a modern web development stack. The platform allows users to book tours, hotels, and transportation, and provides a comprehensive guide to Sri Lanka.

**Key Technologies:**

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS, Shadcn/ui
*   **Backend:** Firebase (Auth, Firestore, Storage, Hosting)
*   **Maps:** Google Maps API
*   **Deployment:** Firebase Hosting, Google Cloud
*   **State Management:** React Context, TanStack Query

**Project Structure:**

The project is divided into two main parts: the main application and an admin panel. The main application is located in the `src` directory, while the admin panel is in the `admin` directory. Both parts are built with React and TypeScript.

# Building and Running

**Prerequisites:**

*   Node.js and npm installed
*   Firebase account and project set up
*   Google Cloud account and project set up

**Installation:**

```bash
# Install dependencies for both the main app and the admin panel
npm run install:all
```

**Development:**

```bash
# Run the main app and the admin panel concurrently
npm run dev:all
```

**Building for Production:**

```bash
# Build both the main app and the admin panel
npm run build:all
```

**Deployment:**

The project can be deployed to either Firebase Hosting or Google Cloud.

**Firebase Hosting:**

```bash
# Deploy both the main app and the admin panel to Firebase Hosting
npm run deploy:all
```

**Google Cloud:**

```bash
# Deploy the main app to Google Cloud
npm run deploy:gcloud
```

# Development Conventions

**Coding Style:**

The project uses ESLint to enforce a consistent coding style. You can run the linter with the following command:

```bash
npm run lint
```

**Testing:**

The project does not currently have a testing framework set up.

**Contribution Guidelines:**

There are no explicit contribution guidelines in the project. However, it is recommended to follow the existing coding style and to create a separate branch for each new feature or bug fix.
