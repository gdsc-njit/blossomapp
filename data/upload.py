import csv
import firebase_admin
from firebase_admin import credentials, firestore

# firebase init
cred = credentials.Certificate("branch-brook-park-app-firebase-adminsdk-fbsvc-6a73e4842b.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# send data from csv
with open("fixed.csv", newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for idx, row in enumerate(reader, start=1):
        doc_id = str(idx)
        data = {
            "x": row["X"],
            "y": row["Y"],
            "name": row["Name"],
            "description": row["Description"],
            "date": row["Date"],
            "zone": row["Zone"],
            "diameter": row["Diameter"],
            "length": row["Length"],
            "image": row["Image"]
        }
        db.collection("trees").document(doc_id).set(data)

print("Upload complete!")
