# hermes-connect

A Chrome Extension (Manifest V3) that captures LinkedIn profile information and saves it directly to Airtable. No backend, no AI — pure data capture.

## Tech Stack

- Manifest V3
- React 18 + TypeScript (strict)
- Vite 5 + `@crxjs/vite-plugin`
- TailwindCSS 3
- Chrome Storage, Tabs, Scripting APIs
- Airtable REST API

## Prerequisites

- Node.js 18+
- Google Chrome

## Installation

```bash
npm install
node scripts/generate-icons.js   # creates placeholder icons in public/icons/
npm run build                    # outputs to dist/
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select the `dist/` folder
4. The extension icon appears in your toolbar

### Configure Airtable

1. Click the extension icon → **Options** (or right-click → Options)
2. Enter your:
   - **Personal Access Token** — create at [airtable.com/create/tokens](https://airtable.com/create/tokens) with `data.records:write` scope
   - **Base ID** — found in your Airtable URL: `airtable.com/appXXX/...`
   - **Table Name** — exact name of the table (e.g. `Contacts`)

## Airtable Table Schema

Create a table with these column names (exact, case-sensitive):

| Column | Type |
|---|---|
| `name` | Single line text |
| `headline` | Single line text |
| `role` | Single line text |
| `company` | Single line text |
| `location` | Single line text |
| `profileUrl` | URL |
| `connectionDegree` | Single line text |
| `isConnected` | Checkbox |
| `canConnect` | Checkbox |
| `canMessage` | Checkbox |
| `isPending` | Checkbox |
| `canFollow` | Checkbox |
| `mutualConnections` | Number |
| `mutualGroups` | Long text |
| `openToWork` | Checkbox |
| `premium` | Checkbox |
| `capturedAt` | Date |

## Usage

1. Navigate to a LinkedIn profile: `linkedin.com/in/username`
2. Click the **hermes-connect** icon
3. Profile data is extracted and displayed (Name, Role, Company)
4. Click **Capture Contact** to save to Airtable
5. Duplicate profiles are updated, never duplicated

## Development

```bash
npm run dev        # watch mode — rebuilds dist/ on file changes
npm run typecheck  # TypeScript type check
npm run lint       # ESLint
```

After each rebuild, click the refresh icon on the extension card in `chrome://extensions`.

## Architecture

```
Popup → chrome.tabs.sendMessage → Content Script → scrapeProfile() → LinkedIn DOM
Popup → AirtableRepository → Airtable REST API
Options → chrome.storage.sync (credentials)
```

The `ContactRepository` interface decouples the extension from Airtable. To switch backends, implement the interface and swap the class in `useCapture.ts`.
