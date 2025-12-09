import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const firebaseAdminApp = () => {
  if (getApps().length) {
    return getApp();
  }
  
  if (!serviceAccountJson) {
    console.error("FATAL: FIREBASE_SERVICE_ACCOUNT_JSON is missing from environment variables.");
    return null; 
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    const credential = cert(serviceAccount);
    
    return initializeApp({
      credential,
    });
  } catch (error) {
    console.error("FATAL: Failed to parse Firebase service account JSON.", error);
    return null;
  }
};

export const getAdminApp = () => firebaseAdminApp();

export const getDb = () => {
    const app = getAdminApp();
    return app ? getFirestore(app) : null;
};