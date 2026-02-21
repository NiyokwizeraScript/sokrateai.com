import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * User profile and preferences stored in Firestore.
 * Collection: users, document id = Firebase Auth UID.
 * Plan is cached here; Stripe is source of truth for payment (update via webhook or after checkout).
 */
export type Plan = "free" | "pro";

export interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  theme?: "light" | "dark" | "system";
  /** Cached from Stripe; default "free". Set to "pro" after successful checkout or via webhook. */
  plan?: Plan;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
}

const USERS_COLLECTION = "users";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function setUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const existing = await getDoc(ref);
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    ...data,
    updatedAt: now,
  };
  if (!existing.exists()) {
    payload.createdAt = now;
  }
  await setDoc(ref, payload, { merge: true });
}
