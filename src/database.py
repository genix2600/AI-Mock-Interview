import os
from firebase_admin import initialize_app, firestore, credentials
from typing import Dict, Any, List 
from dotenv import load_dotenv

load_dotenv()

SERVICE_ACCOUNT_PATH = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
DB = None # Global Firestore client instance

def initialize_firebase():
    """Initializes the Firebase Admin SDK using the service account credentials."""
    global DB
    
    if DB is not None:
        return # Already initialized

    if not SERVICE_ACCOUNT_PATH or not os.path.exists(SERVICE_ACCOUNT_PATH):
        # Fail gracefully if the file isn't found
        print("WARNING: Firebase service account path not found or file does not exist. DB manager is disabled.")
        return

    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        
        initialize_app(cred)
        
        
        DB = firestore.client()
        print("Firebase Firestore initialized successfully.")
    except Exception as e:
        print(f"ERROR: Failed to initialize Firebase: {e}")
        DB = None

class SessionManager:
    """Manages CRUD operations for interview sessions in Firestore."""
    
    def __init__(self):
        
        if DB is None:
            raise ConnectionError("Firestore client not initialized. Check firebase_creds.json path and content.")
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


DB_MANAGER = SessionManager()