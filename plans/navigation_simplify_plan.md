## Goal Description
Your decisions: no tabs, a single Home screen with a "Scan" button, results on a separate details screen, no manual ISBN entry, and web ignored. This supersedes the navigation parts of [barcode_scanner_plan.md](barcode_scanner_plan.md). **Nothing has been changed yet. Approve to start.**

## Proposed Changes

### Phase 1: simplify navigation (this is the work you asked for now)
Replace the `NativeTabs` layout with a `Stack`. This also removes the cause of the earlier `settings` routing problem.

```mermaid
flowchart LR
  Home["index (Home + Scan button)"] -->|later| Scan["scan (camera)"]
  Scan -->|"router.replace('/book/ISBN')"| Details["book/[isbn] (details)"]
```

#### [MODIFY] src/app/_layout.tsx
Remove `AppTabs` and render a `Stack` instead. Keep the theme provider and splash overlay.
```tsx
import { Stack } from "expo-router";
// ...
<ThemeProvider value={...}>
  <AnimatedSplashOverlay />
  <Stack screenOptions={{ headerShown: false }} />
</ThemeProvider>
```

#### [MODIFY] src/app/index.tsx
Strip the Expo starter content (hint rows, dev menu hint, web badge). Keep a title and one button.
```tsx
<Link href="/scan" asChild>
  <Button title="Scan book" />
</Link>
```
`asChild` is required here. That was the bug in your original `settings` link.

#### [DELETE] src/app/explore.tsx, src/app/settings.tsx
These are the "other pages" you don't want.

#### [DELETE] src/components/app-tabs.tsx, src/components/app-tabs.web.tsx
Nothing uses them once the tabs are gone. I'll check that no other file imports them first. The starter components that only existed for the home screen (`hint-row`, `web-badge`, and so on) can stay for now. Say so if you want them cleaned up too.

#### [NEW] src/app/scan.tsx (placeholder)
A simple screen saying "Camera coming soon". The route exists so the Home button works now.

---

### Phase 2 (later, when you're ready)
- `expo-camera` scanner in `scan.tsx`, as in the barcode plan.
- `src/services/isbn.ts` and `src/services/books.ts` (Open Library `fetchBookByIsbn`).
- TanStack Query provider in `_layout.tsx`.
- `src/app/book/[isbn].tsx` details screen. It reads the ISBN with `useLocalSearchParams` and calls `useBookByIsbn`.

**Scan flow:** a valid scan runs `router.replace(`/book/${isbn}`)`. `replace` means Back from the details screen returns to Home, not to a frozen camera. The camera also unmounts, which frees the device.

> [!NOTE]
> Because the details screen does the fetching, the scanner doesn't need to wait for the network. It only validates the barcode and navigates.

## Verification Plan
### Automated Tests
- `npx tsc --noEmit`
- `npx expo lint`

### Manual Verification
- Run `npx expo start` on a device or emulator.
- Home shows no tab bar.
- Tapping "Scan book" opens the placeholder, and Back returns to Home.
