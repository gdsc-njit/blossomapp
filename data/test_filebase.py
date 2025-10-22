import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("branch-brook-park-app-firebase-adminsdk-fbsvc-6a73e4842b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

trees_ref = db.collection("trees")
docs = trees_ref.stream()

for doc in docs:
    print(doc.id, doc.to_dict())
