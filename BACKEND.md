# Backend storage (Firestore) – production

Sokrate uses **Firebase Firestore** in **production mode**. The app has a Firestore client and helpers in `src/lib/firestore.ts`.

## 1. Firestore is already enabled (production mode)

You created the database in production mode, so **no one can read or write until you deploy security rules**. Do that next.

## 2. Deploy security rules (required)

The project includes **`firestore.rules`** in the repo root. Use one of these:

**Option A – Firebase Console (quick)**  
1. Open [Firebase Console](https://console.firebase.google.com/) → your project → **Build → Firestore Database**.  
2. Go to the **Rules** tab.  
3. Copy the contents of **`firestore.rules`** from this repo and paste into the editor.  
4. Click **Publish**.

**Option B – Firebase CLI**  
1. Install CLI: `npm i -g firebase-tools` and `firebase login`.  
2. In the project root: `firebase init firestore` (pick existing project, use `firestore.rules` as the rules file).  
3. Deploy: `firebase deploy --only firestore:rules`.

Rules summary:
- **`users/{userId}`** – only the signed-in user with that `userId` can read/write their own document.  
- **`users/{userId}/*`** – same for any subcollection (e.g. history, quizzes).  
- **`feedback/{id}`** – any signed-in user can create; only the document’s `userId` (or an admin) can read/update/delete.

## 3. What the app already does

- **`src/lib/firebase.ts`** – initializes Firestore and exports `db`.
- **`src/lib/firestore.ts`** – helpers:
  - `getUserProfile(uid)` – read user profile from `users/{uid}`.
  - `setUserProfile(uid, data)` – create or update `users/{uid}` (merge).

Profile shape: `displayName`, `email`, `photoURL`, `theme`, `plan` (`"free"` | `"pro"`), `createdAt`, `updatedAt`. **Subscription:** Stripe is source of truth; `plan` is cached in Firestore so the app can gate features. Set to `"pro"` after successful checkout (see CheckoutPro) or via a Stripe webhook for reliability.

## 4. Collections in use

- **`users/{uid}`** – profile (getUserProfile, setUserProfile).
- **`users/{uid}/history`** – study history & recent activity. Each doc: `type` ("solver" | "synthesizer" | "quiz"), `title`, `summary` (optional), `createdAt` (ISO string). Helper functions: `addHistoryItem`, `getRecentActivity(uid, limit)`, `getStudyHistory(uid)`, `deleteHistoryItem(uid, itemId)`.
- **`feedback`** – top-level. Each doc: `userId`, `type` ("feedback" | "bug" | "feature"), `subject`, `message`, `createdAt`. Helpers: `createFeedback`, `getUserFeedback(uid)`, `deleteFeedbackItem(id)`.

**Firestore index:** The query for "your feedback" uses `where("userId", "==", uid)` and `orderBy("createdAt", "desc")`. If the first load fails with an index error, open the link in the error message to create the composite index in the Firebase Console.

## 5. Using it in the app

- **After login:** get the user’s UID from Firebase Auth (`user.uid`), then call `getUserProfile(user.uid)` or `setUserProfile(user.uid, { displayName: user.displayName, ... })` to create/update the profile.
- **Theme:** you can persist `theme` in the user document and apply it on load (e.g. in `Account` or a layout effect).
- **Recent activity:** Dashboard shows last 5 items from `users/{uid}/history`; History page shows all. Solver, Synthesizer, and Quizzes call `addHistoryItem` on success. Users can delete items from Dashboard or History.
- **Feedback:** Feedback page submits to `feedback` and lists the current user’s feedback with delete.

## 6. Plan gating (free vs pro)

- **Free:** Can access **Quizzes** (unlimited), **Account** (settings/theme). Sidebar shows only those + "Upgrade to Pro".
- **Pro:** Can access Dashboard, Solver, Synthesizer, Quizzes, History, Feedback, Account. Recent activity and study history are stored in Firestore and shown on Dashboard and History with delete support; feedback is stored and listed on the Feedback page.
- **Setting plan to pro:** After Stripe checkout success, the app calls `setUserProfile(uid, { plan: "pro" })` (see CheckoutPro). For production you can also use a Stripe webhook to set `plan: "pro"` when a subscription is created.

## 7. Sync profile on login (done)

AuthContext already syncs profile on login: creates a user doc with `plan: "free"` for new users; for existing users merges displayName, email, photoURL (never overwrites `plan`, so Pro stays Pro).

---

**Summary:** Enable Firestore in the Firebase project, set security rules, then use `getUserProfile` / `setUserProfile` and the same patterns for any new collections (history, quizzes, feedback, subscription cache).
