# Annpurna Gau Aashram

## Current State
Full-stack gaushala management app with:
- Backend: Motoko canister with Cow, Calf, Donation, HealthRecord, Announcement data models
- Frontend: React + TypeScript with pages for Dashboard, CowRegistry, HealthRecords, MilkManagement, Donations, Announcements, QRScanner
- Milk data stored in localStorage (per-device)
- Data queries use TanStack Query but no polling — data only refreshes on user actions or page load

## Requested Changes (Diff)

### Add
- **Auto-polling / real-time sync**: All `useQuery` hooks should refetch data every 30 seconds so 20+ users on same link see fresh data without manual refresh
- **Backup Page** (`/backup`): New page accessible from sidebar
  - **Export**: Download all canister data (cows, calves, health records, donations, announcements) as a single JSON file — user can email this to themselves as backup
  - **Import**: Upload a previously exported JSON file to restore/seed data back into the canister (calls backend add* functions for each record)
  - Hindi/English language support
  - Export also includes localStorage milk data as part of JSON

### Modify
- `useQueries.ts`: Add `refetchInterval: 30000` (30s) to all `useQuery` hooks (cows, donations, health records, announcements, calves)
- `App.tsx`: Add "backup" to Page type and render `<Backup />` page
- `Layout.tsx`: Add "Backup" nav item with Archive icon

### Remove
- Nothing removed

## Implementation Plan
1. Update `useQueries.ts` — add `refetchInterval: 30000` to all 5+ useQuery hooks
2. Create `src/frontend/src/pages/Backup.tsx` — export and import UI
   - Export button: fetch all data from canister + milk from localStorage, bundle into JSON, trigger download
   - Import section: file upload input, parse JSON, loop through records calling backend mutations
   - Show progress/success/error states
   - Hindi + English labels
3. Add `"backup"` to `Page` type in `App.tsx` and render `<Backup />` 
4. Add backup nav item to `Layout.tsx` navItems array with Archive icon and ocid marker
5. Validate (typecheck + build) and deploy
