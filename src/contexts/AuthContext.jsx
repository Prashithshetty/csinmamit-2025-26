import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";
import {
  isCoreMember as isCoreMemberSecure,
  getRoleByEmail as getRoleByEmailSecure,
  isNMAMITEmail,
  hasPermission,
} from "../utils/secureCoreMembersUtils";
import { CORE_MEMBERS } from "../constants/coreMembers";
import toast from "react-hot-toast";
import usersData from "../data/usersData.js"; // Ensure this path is correct

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false); // Helper function to check if user is a core member with fallback

  const isCoreMember = (email) => {
    if (!email) return false; // First try secure method (env variables)
    const secureCheck = isCoreMemberSecure(email);
    if (secureCheck) {
      return true;
    } // Fallback to constants file
    const constantsCheck = CORE_MEMBERS.hasOwnProperty(email.toLowerCase());
    return constantsCheck;
  }; // Helper function to get role by email with fallback

  const getRoleByEmail = (email) => {
    if (!email) return null; // First try secure method (env variables)
    const secureRole = getRoleByEmailSecure(email);
    if (secureRole) {
      return secureRole;
    } // Fallback to constants file
    return CORE_MEMBERS[email.toLowerCase()] || null;
  }; // Sign in with Google

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user; // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef); // Check if user is a core member
      const coreRoleData = getRoleByEmail(user.email);
      const isCore = isCoreMember(user.email);
      let finalUserData = null;
      if (!userSnap.exists()) {
        // console.log('📝 Creating new user document...')
        // Determine the role based on email
        let userRole = "member";
        let roleDetails = null;
        if (isCore && coreRoleData) {
          userRole = "coreMember";
          roleDetails = {
            position: coreRoleData.role,
            permissions: coreRoleData.permissions,
            level: coreRoleData.level,
            isNMAMIT: isNMAMITEmail(user.email),
          }; // console.log('✨ Setting up core member:', roleDetails)
          toast.success(`Welcome ${coreRoleData.role} - ${user.displayName}!`, {
            duration: 4000,
            icon: "🎉",
          });
        } else if (isNMAMITEmail(user.email)) {
          // NMAMIT email but not a core member
          toast.success(`Welcome NMAMIT student - ${user.displayName}!`);
        } else {
          toast.success("Welcome to CSI NMAMIT!");
        } // Create new user document
        const newUserData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: userRole,
          ...(roleDetails && { roleDetails }),
          isCoreMember: isCore,
          joinedAt: serverTimestamp(),
          membership: {
            status: isCore ? "active" : "inactive",
            type: isCore ? "core" : null,
            expiresAt: null,
          },
          profile: {
            phone: "",
            college: "NMAMIT",
            branch: "",
            year: "",
            bio: "",
          },
        };
        await setDoc(userRef, newUserData);
        finalUserData = newUserData;
      } else {
        // console.log('👤 Existing user found, checking role...')
        // Existing user - check if role needs update
        const existingData = userSnap.data(); // Update role if user is a core member but doesn't have the role set
        if (isCore && coreRoleData && existingData.role !== "coreMember") {
          // console.log('🔄 Updating user role to core member...')
          const updatedData = {
            role: "coreMember",
            roleDetails: {
              position: coreRoleData.role,
              permissions: coreRoleData.permissions,
              level: coreRoleData.level,
              isNMAMIT: isNMAMITEmail(user.email),
            },
            isCoreMember: true,
            membership: {
              ...existingData.membership,
              status: "active",
              type: "core",
            },
          };
          await setDoc(userRef, updatedData, { merge: true });
          finalUserData = { ...existingData, ...updatedData };
          toast.success(`Role updated: ${coreRoleData.role}`, {
            duration: 4000,
            icon: "✨",
          });
        } else {
          finalUserData = existingData;
          if (isCore) {
            toast.success(`Welcome back, ${coreRoleData.role}!`, {
              duration: 3000,
              icon: "👋",
            });
          } else {
            toast.success(`Welcome back, ${user.displayName}!`);
          }
        }
      } // Immediately update the user state with complete data
      const completeUserData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        ...finalUserData,
        isCoreMember: isCore,
      }; // console.log('✅ Final user data:', completeUserData) // console.log('🎯 Is core member?', completeUserData.role === 'coreMember') // Set user state immediately to ensure navbar gets updated data
      setUser(completeUserData);
      return user;
    } catch (error) {
      // console.error('❌ Error signing in:', error)
      toast.error("Failed to sign in. Please try again.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }; // Sign out

  const logout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      // console.error('Error signing out:', error)
      toast.error("Failed to sign out");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }; // Update user profile

  const updateUserProfile = async (updates) => {
    if (!user) return;
    try {
      // Update Firebase Auth profile if name or photo changed
      if (updates.name || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name || user.displayName,
          photoURL: updates.photoURL || user.photoURL,
        });
      } // Update Firestore document
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updates, { merge: true }); // Update local state
      setUser((prev) => ({ ...prev, ...updates }));
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      // console.error('Error updating profile:', error)
      toast.error("Failed to update profile");
      return false;
    }
  }; // Check if profile is complete

  const checkProfileCompletion = async (userData = null) => {
    try {
      let data = userData; // If no data provided, fetch from current user
      if (!data && user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          data = userSnap.data();
        }
      }
      if (!data) {
        setIsProfileIncomplete(false);
        return false;
      } // Check required fields for profile completion
      const requiredFields = ["name", "phone", "branch", "year", "usn"];
      const isIncomplete = requiredFields.some((field) => {
        const value = data[field] || data.profile?.[field];
        return !value || value === "";
      });
      setIsProfileIncomplete(isIncomplete);
      return !isIncomplete;
    } catch (error) {
      // console.error('Error checking profile completion:', error)
      setIsProfileIncomplete(false);
      return false;
    }
  }; // Get user data from Firestore

  const getUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      // console.error('Error fetching user data:', error)
      throw error;
    }
  }; // Check user permissions

  const checkPermission = (permission) => {
    if (!user || !user.roleDetails) return false;
    return hasPermission(user.roleDetails?.position, permission);
  }; // Get user's role display name

  const getUserRoleDisplay = () => {
    if (!user) return null; // First check if user has selected a role in their profile
    if (user.profile?.role) {
      return user.profile.role;
    } // Then check roleDetails
    if (user.role === "coreMember" && user.roleDetails?.position) {
      return user.roleDetails.position;
    }
    if (user.role === "admin") return "Administrator";
    return "Member";
  }; // Check if user is a core member

  const isUserCoreMember = () => {
    return user?.role === "coreMember";
  }; // Listen to auth state changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData = null;
        try {
          // Try to get user data from firestore
          userData = await getUserData(firebaseUser.uid);
        } catch (dbError) {
          // Fallback to mock data if firestore fails
          console.warn(
            "Firestore is unavailable. Falling back to mock data.",
            dbError
          );
          const mockUser = usersData.find(
            (u) => u.email === firebaseUser.email
          );
          if (mockUser) {
            userData = { ...mockUser }; // Use a copy
            toast.success("Using mock data for profile.", { icon: "🧑‍💻" });
          }
        } // Check if user is an admin - if so, don't set as regular user
        if (userData?.role === "admin") {
          // Don't set regular user context for admin users
          setUser(null);
          setIsProfileIncomplete(false);
          setLoading(false);
          return;
        } // Check if user is a core member and assign role
        const coreRoleData = getRoleByEmail(firebaseUser.email);
        let roleDetails = null;
        let userRole = userData?.role || "member";
        if (coreRoleData) {
          // Set core member details
          roleDetails = {
            position: coreRoleData.role,
            permissions: coreRoleData.permissions || [],
            level: coreRoleData.level || "member",
          };
          userRole = "coreMember"; // Update Firestore with core member role if not already set
          try {
            if (
              userData?.role !== "coreMember" ||
              userData?.roleDetails?.position !== coreRoleData.role
            ) {
              const userRef = doc(db, "users", firebaseUser.uid);
              await setDoc(
                userRef,
                {
                  role: "coreMember",
                  roleDetails,
                  isCoreMember: true,
                },
                { merge: true }
              );
            }
          } catch (updateError) {
            console.warn(
              "Could not update core member role in Firestore.",
              updateError
            );
          }
        }
        const fullUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData,
          role: userRole,
          roleDetails: roleDetails || userData?.roleDetails,
          isCoreMember: !!coreRoleData,
        };
        setUser(fullUserData); // Check if profile is complete // await checkProfileCompletion(fullUserData)
      } else {
        setUser(null);
        setIsProfileIncomplete(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    authLoading,
    isProfileIncomplete,
    signInWithGoogle,
    logout,
    updateUserProfile,
    getUserData,
    checkProfileCompletion,
    checkPermission,
    getUserRoleDisplay,
    isUserCoreMember,
  };

  return (
    <AuthContext.Provider value={value}>
            {children}   {" "}
    </AuthContext.Provider>
  );
};
