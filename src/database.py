import os
import json
from firebase_admin import initialize_app, firestore, credentials
from typing import Dict, Any, List 
from dotenv import load_dotenv

load_dotenv() 

FIREBASE_CREDENTIALS_JSON = os.getenv('FIREBASE_CREDENTIALS_JSON')
SERVICE_ACCOUNT_PATH = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH') # Local fallback
DB = None 
GLOBAL_DB_MANAGER = None

def initialize_firebase():
    """Initializes the Firebase Admin SDK using the appropriate method (Env Var or File)."""
    global DB
    
    if DB is not None:
        return

    cred = None
    
    if FIREBASE_CREDENTIALS_JSON:
        try:
            cred_dict = json.loads(FIREBASE_CREDENTIALS_JSON)
            cred = credentials.Certificate(cred_dict)
            print("Firebase Firestore initialized successfully via environment variable.")
        except Exception as e:
            print(f"ERROR: Failed to load Firebase credentials from JSON environment variable: {e}")
            return
            
    elif SERVICE_ACCOUNT_PATH and os.path.exists(SERVICE_ACCOUNT_PATH):
        try:
            cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
            print("Firebase Firestore initialized successfully via local file path.")
        except Exception as e:
            print(f"ERROR: Failed to load Firebase credentials from local file: {e}")
            return

    if cred:
        try:
            initialize_app(cred)
            DB = firestore.client()
        except Exception as e:
            print(f"ERROR: Failed to initialize Firebase App: {e}")
            DB = None
    else:
        print("WARNING: Firebase credentials not found. DB manager is disabled. Check FIREBASE_CREDENTIALS_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.")
        DB = None


class SessionManager:
    """Manages CRUD operations for interview sessions in Firestore."""
    
    def __init__(self):
        if DB is None:
            raise ConnectionError("Firestore client not initialized. Check credentials.")
        self.db = DB
        self.collection = 'interview_sessions' 

    
    def get_session_ref(self, session_id: str):
        return self.db.collection(self.collection).document(session_id)

    def start_session(self, session_id: str, role: str, user_id: str = "guest"):
        session_ref = self.get_session_ref(session_id)
        session_ref.set({
            'user_id': user_id,
            'role': role,
            'status': 'active',
            'created_at': firestore.SERVER_TIMESTAMP,
            'history': []
        })

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        session_ref = self.get_session_ref(session_id)
        doc = session_ref.get()
        if doc.exists:
            return doc.to_dict().get('history', [])
        return []

    def append_qa_pair(self, session_id: str, question: str, answer: str):
        session_ref = self.get_session_ref(session_id)
        new_qa = {'Q': question, 'A': answer}
        session_ref.update({
            'history': firestore.ArrayUnion([new_qa])
        })
    
    def save_final_report(self, session_id: str, report: Dict[str, Any]):
        session_ref = self.get_session_ref(session_id)
        session_ref.update({
            'status': 'completed',
            'final_report': report,
            'completed_at': firestore.SERVER_TIMESTAMP
        })


def get_db_manager() -> 'SessionManager':
    """Returns the single, initialized SessionManager instance."""
    global GLOBAL_DB_MANAGER
    if GLOBAL_DB_MANAGER is None:
        initialize_firebase() 
        GLOBAL_DB_MANAGER = SessionManager()
    return GLOBAL_DB_MANAGER