# Bunkyo App

Bunkyo App is a Next.js application designed to automate the process of uploading and analyzing invoices (notes fiscais) using AI. It leverages Google Cloud Vision for OCR and Google Gemini (Generative AI) for structured data extraction. The processed data is stored in Google Sheets, and the original files are uploaded to Google Drive.

## Project Overview

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **UI Library:** [Material UI (MUI) v7](https://mui.com/) with Emotion.
-   **AI/ML:**
    -   **Google Cloud Vision API:** Used for `DOCUMENT_TEXT_DETECTION` to extract raw text from images and PDFs.
    -   **Google Generative AI (Gemini 2.5 Flash):** Used to parse raw text into a structured JSON format (Total Price, Tax IDs, Vendor Name, etc.).
-   **Storage/Integration:**
    -   **Google Drive API:** For storing uploaded invoice files.
    -   **Google Sheets API:** For logging invoice data.
-   **Authentication:** Custom session management (likely using `jose` and Google Auth).
-   **Validation:** [Zod](https://zod.dev/) for schema validation.

## Architecture

-   **`app/actions/`**: Contains Next.js Server Actions (e.g., `invoice.ts`) that bridge the client UI and server-side logic.
-   **`app/api/`**: RESTful API endpoints for invoice analysis and file uploads.
-   **`app/components/`**: Reusable React components (MUI-based).
-   **`app/lib/server/`**: Server-only utility functions for interacting with Google APIs (Auth, Drive, Gemini, Sheets, Vision).
-   **`app/lib/client/`**: Client-side utilities and definitions (API wrappers, TypeScript types).
-   **`app/ui/`**: Context providers (Alerts, MUI Theme).

## Building and Running

### Prerequisites
-   Node.js (v20+ recommended)
-   `pnpm` (workspace detected)
-   Google Cloud Service Account with Vision, Drive, and Sheets API enabled.
-   Google AI Studio API Key (for Gemini).

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Development Conventions

-   **Server Actions:** Prefer using Server Actions for form submissions and data mutations.
-   **Strict Typing:** Use TypeScript for all new code. Definitions should be placed in `app/lib/client/definitions.ts` or `app/lib/server/` as appropriate.
-   **MUI Styling:** Use MUI components and `styled` from `@emotion/styled`. Avoid raw CSS when possible, though `style.css` files are present in some component directories.
-   **Error Handling:** Use the `AlertContextProvider` to show user-facing notifications. Server Actions should return a consistent `state` object with `errors` and `message`.
-   **API Consistency:** Server-side Google API logic is centralized in `app/lib/server/`.

## Environment Variables
The project expects several environment variables (refer to `.env` if available, or the following based on code usage):
-   `gooogleGeminiApiKey`: API Key for Google Generative AI.
-   `googleFolderId`: Root folder ID in Google Drive.
-   `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`: For service account authentication.
