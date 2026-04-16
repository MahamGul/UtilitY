from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import db
import uuid
from datetime import datetime

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "Backend connected 🚀"}

# ---------------- SIGNUP ----------------
@app.post("/add-user")
def add_user(user: dict):

    if db.user.find_one({"email": user["email"]}):
        raise HTTPException(status_code=400, detail="User already exists")

    db.user.insert_one(user)

    return {"status": "success"}

# ---------------- LOGIN ----------------
@app.post("/login")
def login(user: dict):

    db_user = db.user.find_one({
        "email": user["email"],
        "password": user["password"]
    }, {"_id": 0})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user["role"] != user["role"]:
        raise HTTPException(status_code=403, detail="Role mismatch")

    return {
        "status": "success",
        "user": db_user
    }

# ---------------- CREATE REQUEST ----------------
@app.post("/requests")
def create_request(request: dict):

    new_request = {
        "id": str(uuid.uuid4()),
        "user_email": request["user_email"],
        "user_name": request.get("user_name"),
        "serviceType": request["serviceType"],
        "description": request["description"],
        "budget": request["budget"],
        "status": "Pending",
        "provider": request.get("provider"),
        "rating": None,
        "reviewText": None,
        "datePosted": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.requests.insert_one(new_request)

    return {"status": "success", "id": new_request["id"]}

# ---------------- GET REQUESTS ----------------
@app.get("/requests/{email}")
def get_requests(email: str):

    requests = list(db.requests.find(
        {"user_email": email},
        {"_id": 0}
    ))

    return requests

# ---------------- RATE REQUEST ----------------
@app.put("/requests/rate/{request_id}")
def rate_request(request_id: str, data: dict):

    result = db.requests.update_one(
        {"id": request_id},
        {
            "$set": {
                "rating": data["rating"],
                "reviewText": data["reviewText"],
                "ratedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")

    return {"status": "success"}