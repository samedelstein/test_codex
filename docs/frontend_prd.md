# Minor League Ballpark Food Tracker

## Part I – Core Product Requirements

*(Unchanged from previous version; included here for completeness)*

> **Skip to Part II – Front-End PRD** if you’re already familiar with the overall product spec.

### 1. Purpose & Vision

Capture, organize, and explore every ballpark meal experience so users can remember favorites, compare prices, and plan future trips.

### 2. Goals (MVP)

1. Log **100 %** of meals eaten at minor-league baseball parks.
2. Retrieve any meal in **<3 seconds** via search/filter.
3. Store and display photos in **full-resolution** within 1 week of launch.
4. **$0/month** hosting and tooling cost (leveraging free tiers or self-hosting).

### 3. High-Level Scope (MVP)

* CRUD Stadiums and Meals.
* Search & filter.
* Photo upload & gallery.
* Single-user auth.

*(Remaining Sections 4-16 unchanged; see earlier version.)*

---

# Part II – **Front-End Product Requirements Document**

*Focuses on client-side UX/UI for the React Native + Expo application (mobile & PWA).*  
*Last updated: **18 May 2025***

## FE-1. Design Principles

| Principle             | Description                                                                        | Success Metric                                            |
| --------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Fast**              | Key interactions <150 ms (local) and perception of <1 s for remote data.           | Lighthouse Performance ≥85.                               |
| **Offline-First**     | All CRUD actions queue locally and sync when online.                               | Log Meal capability works w/o network 100 % of time.      |
| **One-Hand Friendly** | Add Meal flow reachable via bottom-nav FAB; all primary actions within thumb zone. | >80 % taps <60 % of screen height in usability test.      |
| **Consistent**        | Single design system (Tailwind + Shadcn UI) across iOS, Android, Web.              | 0 visual regressions across platforms in regression runs. |
| **Accessible**        | WCAG 2.2 AA; dark-mode, text scaling, screen-reader labels.                        | Axe audits ≤5 minor issues.                               |

## FE-2. Information Architecture & Navigation

```
┌── Bottom Tab Nav ─────────────────────────────────────┐
│ 1️⃣ Stadiums  2️⃣ Dashboard  3️⃣ Add Meal (FAB)       │
│ 4️⃣ Search    5️⃣ Settings                           │
└───────────────────────────────────────────────────────┘
```

* **Stack Navigation** per tab (React Navigation v7).
* Deep links: `app://stadium/{id}`, `app://meal/{id}`.

## FE-3. Key Screens & Components

| ID     | Screen                         | Core Components                                                                    | Primary Actions          |
| ------ | ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------ |
| SCR-01 | Stadium List                   | `FlatList` of `StadiumCard` (name, team, city, avg rating)                         | Add Stadium (header `+`) |
| SCR-02 | Stadium Detail                 | Stadium hero banner, tabs: *Meals*, *Stats*                                        | Add Meal (FAB)           |
| SCR-03 | Add/Edit Stadium Modal         | Text inputs, league picker                                                         | Save, Cancel             |
| SCR-04 | Meal Detail                    | Photo carousel (`react-native-image-viewing`), food info, rating stars, notes      | Edit, Delete             |
| SCR-05 | Add/Edit Meal Wizard (3 steps) | Step 1: Select Stadium/date; Step 2: Food + price + rating; Step 3: Photos + notes | Draft autosave; Finish   |
| SCR-06 | Search/Filter                  | Search bar, filter chips (stadium, rating, price range, date), results list        | Apply, Clear             |
| SCR-07 | Dashboard                      | `TopRatedList`, `SpendByStadiumChart` (Victory Native), visit heat-map             | None                     |
| SCR-08 | Settings                       | Profile (email), storage used, offline cache size, export data btn                 | Clear cache, Export CSV  |

## FE-4. Component Library

Use **Shadcn/ui** for buttons, inputs, modals; wrap with Tailwind classes (via `nativewind`).
Custom components:

* `PriceTag` (USD formatting, color-coded by cost quartile).
* `StarRatingInput` (tap/drag; haptic feedback on iOS).

## FE-5. State Management & Data Sync

| Layer    | Tool                            | Notes                                                              |
| -------- | ------------------------------- | ------------------------------------------------------------------ |
| UI State | React Context + `zustand`       | Lightweight, avoids Redux boilerplate.                             |
| Cache    | SQLite via `expo-sqlite-orm`    | Meals & stadiums persisted locally.                                |
| Sync     | Supabase Realtime subscriptions | Merge conflict resolution: *last-write-wins* for single-user case. |

### Offline Queue

* Actions table: `id`, `type`, `payload`, `created_at`.
* Background task (Expo Task Manager) flushes when `navigator.onLine == true`.

## FE-6. Error & Empty States

| Scenario          | UI Behaviour                                        | Copy Example                                   |
| ----------------- | --------------------------------------------------- | ---------------------------------------------- |
| No Results Search | Illustrative icon + “No meals match these filters.” |                                                |
| Photo Upload Fail | Inline toast + retry badge on thumbnail             | “Upload lost in the lights. Tap to try again.” |
| Sync Conflict     | Toast + auto-merge indicator                        | “Latest changes saved (cloud version kept).”   |

## FE-7. Performance Budgets

| Metric             | Target                                  |
| ------------------ | --------------------------------------- |
| First Screen Paint | <2 s on Moto G4 over 3G                 |
| JS Bundle Size     | <500 KB gzip                            |
| Image Thumb        | Max 120 KB each (blurhash placeholders) |

## FE-8. Analytics & Metrics

* Track `screen_view`, `add_meal`, `rate_meal`, `search_used` events via PostHog open-source (self-hosted Docker, optional).
* Crash reporting: Sentry free plan.

## FE-9. Quality Assurance

| Phase         | Checklist                                                            |
| ------------- | -------------------------------------------------------------------- |
| Unit Tests    | Jest ≥80 % coverage for UI util funcs & stores.                      |
| E2E Tests     | Detox: Add Stadium, Add Meal, Search flow on iOS 14 & Android 11.    |
| Accessibility | Expo A11y plugin + manual VoiceOver/ TalkBack check once per sprint. |
| Beta          | TestFlight + Google Play Internal; target 10 friends/family testers. |

## FE-10. Build & Delivery

| Task     | Tool/Command                                |
| -------- | ------------------------------------------- |
| Dev      | `expo start`                                |
| QA build | `eas build --profile preview` (free 5/mo)   |
| Prod     | Local EAS build; upload to stores manually. |
| Web      | `expo export:web && gh-pages -d dist`       |

## FE-11. Open-Source & Licensing

* MIT for app code.
* Attribution required for icons from `lucide-react-native`.

## FE-12. Risks & Mitigations (Frontend-Specific)

| Risk                     | Impact                         | Mitigation                                          |
| ------------------------ | ------------------------------ | --------------------------------------------------- |
| Large offline DB size    | Device storage low             | Purge photos >3 MB from local cache (keep cloud).   |
| Expo free build limit    | Slows iteration                | Use local EAS builds; swap Apple Dev USB signing.   |
| Android file permissions | Photo picker fails on older OS | Use `expo-image-picker` w/ scoped storage fallback. |

---

### Front-End MVP Definition of Done

1. All SCR-01 → SCR-08 implemented per spec.
2. Lighthouse PWA score ≥80 across Performance, Accessibility, Best Practices.
3. Offline Add Meal works and syncs on reconnect (demo recorded).
4. All unit + e2e + a11y tests pass in CI.
5. Store builds reviewed by 2 beta testers on each platform.

> **Ship it** when DoD met and no P1 bugs remain.
