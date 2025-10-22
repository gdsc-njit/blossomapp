import csv
import io
import requests
import firebase_admin
from firebase_admin import credentials, storage

SERVICE_KEY = "branch-brook-park-app-firebase-adminsdk-fbsvc-6a73e4842b.json"
INPUT_CSV = "final.csv"
OUTPUT_CSV = "fixed.csv"
BUCKET_NAME = "branch-brook-park-app.firebasestorage.app"

cred = credentials.Certificate(SERVICE_KEY)
firebase_admin.initialize_app(cred, {"storageBucket": BUCKET_NAME})
bucket = storage.bucket()

def upload_image_from_url(url, name_hint)
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code != 200:
            print(f"failed: {url}")
            return ""
        blob = bucket.blob(f"trees/{name_hint}.jpg")
        blob.upload_from_file(io.BytesIO(r.content), content_type="image/jpeg")
        blob.make_public()
        return blob.public_url
    except Exception as e:
        print(f"err {url}: {e}")
        return ""

with open(INPUT_CSV, newline="", encoding="utf-8") as infile, \
     open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as outfile:
    
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    for idx, row in enumerate(reader, start=1):
        zone = row["Zone"].replace("Zone", "").strip()
        name_hint = f"tree_{idx}"
        new_url = upload_image_from_url(row["Image"], name_hint)
        row["Zone"] = zone
        if new_url:
            row["Image"] = new_url
        writer.writerow(row)
        print(f"Row {idx}: uploaded {name_hint}")

print(f"\n wrote to: {OUTPUT_CSV}")
