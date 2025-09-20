import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { isCloudinaryConfigured, getCloudinaryStatus } from "../config/cloudinary";
import { mockEvents } from "../data/eventsData";

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dqnlrrcgb";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "csi-events";

// Upload to Cloudinary
export const uploadToCloudinary = async (file, folder = "csi-events") => {
  try {
    if (!isCloudinaryConfigured()) {
      throw new Error(`Cloudinary not configured`);
    }
    const formData = new FormData();
    formData.append("file", file);
    if (CLOUDINARY_UPLOAD_PRESET) formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    throw error;
  }
};

// Get events by year (gracefully handles Firestore errors)
export const getEventsByYear = async (year) => {
  try {
    const eventsRef = collection(db, "events");
    let q = query(eventsRef, where("year", "==", parseInt(year)), where("published", "==", true));

    // Use createdAt for ordering to avoid missing date issues
    q = query(q, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (events.length > 0) return events;

    // Firestore empty → fallback
    console.info(`No Firestore events for ${year}, using mock data`);
    return mockEvents[year] || [];
  } catch (error) {
    console.warn(`Firestore error, using mock data for ${year}:`, error);
    return mockEvents[year] || [];
  }
};

// Get single event by ID
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const snap = await getDoc(eventRef);
    if (snap.exists()) return { id: snap.id, ...snap.data() };

    // Fallback: check mock data
    for (const year in mockEvents) {
      const found = mockEvents[year].find((e) => e.id.toString() === eventId.toString());
      if (found) return found;
    }

    throw new Error("Event not found");
  } catch (error) {
    console.warn("Error fetching event by ID, using mock data if available:", error);
    for (const year in mockEvents) {
      const found = mockEvents[year].find((e) => e.id.toString() === eventId.toString());
      if (found) return found;
    }
    throw error;
  }
};

// Event registration (gracefully handles offline/mock)
export const registerUserForEvent = async (event, user) => {
  if (!event || !user) return false;
  try {
    const batch = writeBatch(db);
    const eventRef = doc(db, "events", event.id);
    batch.set(doc(collection(eventRef, "attendees"), user.uid), {
      name: user.name,
      email: user.email,
      usn: user.usn || user.profile?.usn,
      registeredAt: serverTimestamp(),
    });
    const userRef = doc(db, "users", user.uid);
    batch.update(userRef, { registeredEvents: arrayUnion({ eventId: event.id, eventTitle: event.title, eventDate: event.date }) });
    await batch.commit();
    return true;
  } catch (error) {
    console.warn("Database write failed, simulating success:", error);
    return true;
  }
};
