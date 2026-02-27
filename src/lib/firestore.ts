import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
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
  /** Set by webhook when user subscribes; used to set plan back to "free" when they cancel. */
  stripeCustomerId?: string;
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

// --- Study history & recent activity (same collection: users/{uid}/history) ---
export type HistoryItemType = "solver" | "synthesizer" | "quiz";

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  title: string;
  summary?: string;
  createdAt: string; // ISO
}

const HISTORY_SUBCOLLECTION = "history";

export async function addHistoryItem(
  uid: string,
  data: { type: HistoryItemType; title: string; summary?: string }
): Promise<string> {
  const ref = collection(db, USERS_COLLECTION, uid, HISTORY_SUBCOLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getRecentActivity(uid: string, maxItems: number = 5): Promise<HistoryItem[]> {
  const ref = collection(db, USERS_COLLECTION, uid, HISTORY_SUBCOLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"), limit(maxItems));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      type: (x.type as HistoryItemType) ?? "solver",
      title: x.title ?? "",
      summary: x.summary,
      createdAt: x.createdAt ?? "",
    };
  });
}

export async function getStudyHistory(uid: string): Promise<HistoryItem[]> {
  const ref = collection(db, USERS_COLLECTION, uid, HISTORY_SUBCOLLECTION);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      type: (x.type as HistoryItemType) ?? "solver",
      title: x.title ?? "",
      summary: x.summary,
      createdAt: x.createdAt ?? "",
    };
  });
}

export async function deleteHistoryItem(uid: string, itemId: string): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid, HISTORY_SUBCOLLECTION, itemId);
  await deleteDoc(ref);
}

// --- Feedback (top-level collection) ---
export type FeedbackType = "feedback" | "bug" | "feature";

export interface FeedbackItem {
  id: string;
  userId: string;
  type: FeedbackType;
  subject: string;
  message: string;
  createdAt: string;
}

const FEEDBACK_COLLECTION = "feedback";

export async function createFeedback(
  uid: string,
  data: { type: FeedbackType; subject: string; message: string }
): Promise<string> {
  const ref = collection(db, FEEDBACK_COLLECTION);
  const docRef = await addDoc(ref, {
    userId: uid,
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getUserFeedback(uid: string): Promise<FeedbackItem[]> {
  const ref = collection(db, FEEDBACK_COLLECTION);
  const q = query(ref, where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      userId: x.userId ?? "",
      type: (x.type as FeedbackType) ?? "feedback",
      subject: x.subject ?? "",
      message: x.message ?? "",
      createdAt: x.createdAt ?? "",
    };
  });
}

export async function deleteFeedbackItem(feedbackId: string): Promise<void> {
  const ref = doc(db, FEEDBACK_COLLECTION, feedbackId);
  await deleteDoc(ref);
}

// --- Notes (users/{uid}/notes) ---
export type NoteSourceType = "blank" | "document" | "youtube";

export interface NoteRecord {
  id: string;
  sourceType: NoteSourceType;
  title: string;
  content: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const NOTES_SUBCOLLECTION = "notes";

export async function createNote(
  uid: string,
  data: { sourceType: NoteSourceType; title?: string; content?: string; sourceUrl?: string }
): Promise<string> {
  const ref = collection(db, USERS_COLLECTION, uid, NOTES_SUBCOLLECTION);
  const now = new Date().toISOString();
  const docRef = await addDoc(ref, {
    sourceType: data.sourceType,
    title: data.title ?? "Untitled note",
    content: data.content ?? "",
    sourceUrl: data.sourceUrl ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getNote(uid: string, noteId: string): Promise<NoteRecord | null> {
  const ref = doc(db, USERS_COLLECTION, uid, NOTES_SUBCOLLECTION, noteId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const x = snap.data();
  return {
    id: snap.id,
    sourceType: (x.sourceType as NoteSourceType) ?? "blank",
    title: x.title ?? "",
    content: x.content ?? "",
    sourceUrl: x.sourceUrl,
    createdAt: x.createdAt ?? "",
    updatedAt: x.updatedAt ?? "",
  };
}

export async function updateNote(
  uid: string,
  noteId: string,
  data: { title?: string; content?: string }
): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid, NOTES_SUBCOLLECTION, noteId);
  await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function getUserNotes(uid: string): Promise<NoteRecord[]> {
  const ref = collection(db, USERS_COLLECTION, uid, NOTES_SUBCOLLECTION);
  const q = query(ref, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      sourceType: (x.sourceType as NoteSourceType) ?? "blank",
      title: x.title ?? "",
      content: x.content ?? "",
      sourceUrl: x.sourceUrl,
      createdAt: x.createdAt ?? "",
      updatedAt: x.updatedAt ?? "",
    };
  });
}

export async function deleteNote(uid: string, noteId: string): Promise<void> {
  const ref = doc(db, USERS_COLLECTION, uid, NOTES_SUBCOLLECTION, noteId);
  await deleteDoc(ref);
}

// --- Shared notes (top-level: recipient can read by email) ---
export interface SharedNoteRecord {
  id: string;
  fromUserId: string;
  fromUserEmail: string;
  fromUserName?: string;
  noteId: string;
  noteTitle: string;
  toEmail: string;
  createdAt: string;
  /** Stored so recipient can view without access to owner's notes */
  noteContent?: string;
}

const SHARED_NOTES_COLLECTION = "sharedNotes";

export async function shareNoteToEmail(
  fromUserId: string,
  data: {
    fromUserEmail: string;
    fromUserName?: string;
    noteId: string;
    noteTitle: string;
    toEmail: string;
    noteContent?: string;
  }
): Promise<string> {
  const ref = collection(db, SHARED_NOTES_COLLECTION);
  const docRef = await addDoc(ref, {
    fromUserId,
    fromUserEmail: data.fromUserEmail,
    fromUserName: data.fromUserName ?? null,
    noteId: data.noteId,
    noteTitle: data.noteTitle,
    toEmail: data.toEmail.toLowerCase().trim(),
    noteContent: data.noteContent ?? null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getSharedWithMe(userEmail: string): Promise<SharedNoteRecord[]> {
  const ref = collection(db, SHARED_NOTES_COLLECTION);
  const q = query(
    ref,
    where("toEmail", "==", userEmail.toLowerCase().trim()),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      fromUserId: x.fromUserId ?? "",
      fromUserEmail: x.fromUserEmail ?? "",
      fromUserName: x.fromUserName,
      noteId: x.noteId ?? "",
      noteTitle: x.noteTitle ?? "",
      toEmail: x.toEmail ?? "",
      createdAt: x.createdAt ?? "",
      noteContent: x.noteContent,
    };
  });
}

export async function getSharedNote(shareId: string): Promise<SharedNoteRecord | null> {
  const ref = doc(db, SHARED_NOTES_COLLECTION, shareId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const x = snap.data();
  return {
    id: snap.id,
    fromUserId: x.fromUserId ?? "",
    fromUserEmail: x.fromUserEmail ?? "",
    fromUserName: x.fromUserName,
    noteId: x.noteId ?? "",
    noteTitle: x.noteTitle ?? "",
    toEmail: x.toEmail ?? "",
    createdAt: x.createdAt ?? "",
    noteContent: x.noteContent,
  };
}
