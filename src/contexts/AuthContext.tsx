import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          const now = new Date().toISOString();

          const baseData: Record<string, unknown> = {
            plan: "free",
            onboardingCompleted: false,
            createdAt: now,
            updatedAt: now,
          };

          const profileFields: Record<string, unknown> = {};
          if (currentUser.displayName != null) {
            profileFields.displayName = currentUser.displayName;
          }
          if (currentUser.email != null) {
            profileFields.email = currentUser.email;
          }
          if (currentUser.photoURL != null) {
            profileFields.photoURL = currentUser.photoURL;
          }

          if (!snap.exists()) {
            await setDoc(userRef, { ...profileFields, ...baseData });
          } else {
            await setDoc(
              userRef,
              {
                ...profileFields,
                updatedAt: now,
              },
              { merge: true }
            );
          }
        } catch (e) {
          console.error("Failed to sync user profile", e);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signUpWithEmail = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const { email, password, firstName, lastName } = data;
    const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined;
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(user, { displayName });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
