import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_EMAIL } from '@/lib/firebase';

export interface LectureProgress {
  lectureId: string;
  batchId: string;
  subjectId: string;
  progress: number;
  watchedSeconds: number;
  totalSeconds: number;
  completedAt?: Date;
  lastWatchedAt: Date;
}

export interface KeyInfo {
  token: string;
  generatedAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

export interface KeyGenerationLog {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  token: string;
  generatedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'success' | 'failed';
  completedAt?: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  enrolledBatches: string[];
  lectureProgress: LectureProgress[];
  lastActive: Date;
  createdAt: Date;
  keyInfo?: KeyInfo;
}

export interface AppSettings {
  keyGenerationEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  appSettings: AppSettings;
  userKeyInfo: KeyInfo | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  enrollInBatch: (batchId: string) => Promise<void>;
  isEnrolled: (batchId: string) => boolean;
  updateLectureProgress: (progress: Omit<LectureProgress, 'lastWatchedAt'>) => Promise<void>;
  getLectureProgress: (lectureId: string) => LectureProgress | undefined;
  getBatchProgress: (batchId: string) => number;
  // Key generation functions
  storePendingKey: (token: string) => Promise<void>;
  generateKey: (token: string) => Promise<boolean>;
  checkKeyValidity: () => boolean;
  // Admin functions
  toggleKeyGeneration: (enabled: boolean) => Promise<void>;
  getKeyGenerationLogs: () => Promise<KeyGenerationLog[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({ keyGenerationEnabled: true });
  const [userKeyInfo, setUserKeyInfo] = useState<KeyInfo | null>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const loadAppSettings = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'app');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        setAppSettings(settingsSnap.data() as AppSettings);
      } else {
        // Create default settings
        await setDoc(settingsRef, { keyGenerationEnabled: true });
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const createOrUpdateUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const newProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
        enrolledBatches: [],
        lectureProgress: [],
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
        keyInfo: null,
      };
      await setDoc(userRef, newProfile);
      setUserProfile({ 
        ...newProfile, 
        photoURL: newProfile.photoURL || undefined,
        lastActive: new Date(), 
        createdAt: new Date() 
      } as UserProfile);
      setUserKeyInfo(null);
    } else {
      await updateDoc(userRef, { lastActive: serverTimestamp() });
      const data = userSnap.data();
      
      // Parse key info
      let keyInfo: KeyInfo | null = null;
      if (data.keyInfo) {
        keyInfo = {
          token: data.keyInfo.token,
          generatedAt: data.keyInfo.generatedAt?.toDate() || new Date(),
          expiresAt: data.keyInfo.expiresAt?.toDate() || new Date(),
          isValid: data.keyInfo.isValid || false,
        };
        
        // Check if key has expired
        if (keyInfo.expiresAt < new Date()) {
          keyInfo.isValid = false;
        }
        
        setUserKeyInfo(keyInfo.isValid ? keyInfo : null);
      }
      
      setUserProfile({
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL || undefined,
        enrolledBatches: data.enrolledBatches || [],
        lectureProgress: (data.lectureProgress || []).map((p: any) => ({
          ...p,
          lastWatchedAt: p.lastWatchedAt?.toDate() || new Date(),
          completedAt: p.completedAt?.toDate(),
        })),
        lastActive: data.lastActive?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        keyInfo: keyInfo || undefined,
      } as UserProfile);
    }
  };

  useEffect(() => {
    loadAppSettings();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await createOrUpdateUserProfile(user);
      } else {
        setUserProfile(null);
        setUserKeyInfo(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Update lastActive periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { lastActive: serverTimestamp() });
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const enrollInBatch = async (batchId: string) => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    const newEnrolled = [...new Set([...userProfile.enrolledBatches, batchId])];
    await updateDoc(userRef, { enrolledBatches: newEnrolled });
    setUserProfile({ ...userProfile, enrolledBatches: newEnrolled });
  };

  const isEnrolled = (batchId: string) => {
    return userProfile?.enrolledBatches.includes(batchId) || false;
  };

  const updateLectureProgress = async (progress: Omit<LectureProgress, 'lastWatchedAt'>) => {
    if (!user || !userProfile) return;
    
    const userRef = doc(db, 'users', user.uid);
    const existingIndex = userProfile.lectureProgress.findIndex(
      p => p.lectureId === progress.lectureId
    );
    
    const newProgress: LectureProgress = {
      ...progress,
      lastWatchedAt: new Date(),
    };

    let updatedProgress: LectureProgress[];
    if (existingIndex >= 0) {
      updatedProgress = [...userProfile.lectureProgress];
      updatedProgress[existingIndex] = newProgress;
    } else {
      updatedProgress = [...userProfile.lectureProgress, newProgress];
    }

    await updateDoc(userRef, { lectureProgress: updatedProgress });
    setUserProfile({ ...userProfile, lectureProgress: updatedProgress });
  };

  const getLectureProgress = (lectureId: string) => {
    return userProfile?.lectureProgress.find(p => p.lectureId === lectureId);
  };

  const getBatchProgress = (batchId: string) => {
    if (!userProfile) return 0;
    const batchLectures = userProfile.lectureProgress.filter(p => p.batchId === batchId);
    if (batchLectures.length === 0) return 0;
    const totalProgress = batchLectures.reduce((acc, p) => acc + p.progress, 0);
    return Math.round(totalProgress / batchLectures.length);
  };

  // Key Generation Functions
  const storePendingKey = async (token: string) => {
    if (!user || !userProfile) return;
    
    const keyLog: Omit<KeyGenerationLog, 'id'> = {
      userId: user.uid,
      userEmail: user.email || '',
      userName: userProfile.displayName,
      token,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'pending',
    };
    
    await addDoc(collection(db, 'keyLogs'), {
      ...keyLog,
      generatedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  };

  const generateKey = async (token: string): Promise<boolean> => {
    if (!user || !userProfile) return false;
    
    try {
      // Verify the token exists in pending keys
      const keyLogsRef = collection(db, 'keyLogs');
      const q = query(
        keyLogsRef, 
        where('userId', '==', user.uid),
        where('token', '==', token),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // No pending key found - user didn't complete steps
        return false;
      }
      
      const keyLogDoc = snapshot.docs[0];
      const keyLogId = keyLogDoc.id;
      
      // Update key log to success
      await updateDoc(doc(db, 'keyLogs', keyLogId), {
        status: 'success',
        completedAt: serverTimestamp(),
      });
      
      // Update user profile with key info
      const keyInfo: KeyInfo = {
        token,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isValid: true,
      };
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { keyInfo });
      
      setUserKeyInfo(keyInfo);
      setUserProfile({ ...userProfile, keyInfo });
      
      return true;
    } catch (error) {
      console.error('Error generating key:', error);
      return false;
    }
  };

  const checkKeyValidity = (): boolean => {
    if (!userKeyInfo) return false;
    if (!userKeyInfo.isValid) return false;
    if (userKeyInfo.expiresAt < new Date()) {
      setUserKeyInfo(null);
      return false;
    }
    return true;
  };

  // Admin Functions
  const toggleKeyGeneration = async (enabled: boolean) => {
    if (!isAdmin) return;
    
    const settingsRef = doc(db, 'settings', 'app');
    await setDoc(settingsRef, { keyGenerationEnabled: enabled }, { merge: true });
    setAppSettings({ ...appSettings, keyGenerationEnabled: enabled });
  };

  const getKeyGenerationLogs = async (): Promise<KeyGenerationLog[]> => {
    if (!isAdmin) return [];
    
    try {
      const keyLogsRef = collection(db, 'keyLogs');
      const q = query(keyLogsRef, orderBy('generatedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          userName: data.userName,
          token: data.token,
          generatedAt: data.generatedAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate() || new Date(),
          status: data.status,
          completedAt: data.completedAt?.toDate(),
        } as KeyGenerationLog;
      });
    } catch (error) {
      console.error('Error fetching key logs:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      isAdmin,
      appSettings,
      userKeyInfo,
      login,
      signup,
      loginWithGoogle,
      logout,
      enrollInBatch,
      isEnrolled,
      updateLectureProgress,
      getLectureProgress,
      getBatchProgress,
      storePendingKey,
      generateKey,
      checkKeyValidity,
      toggleKeyGeneration,
      getKeyGenerationLogs,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
