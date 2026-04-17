from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import db
import uuid
from datetime import datetime
from bson import ObjectId

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
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

    user["createdAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    result = db.user.insert_one(user)
    user_id = str(result.inserted_id)

    # ---------------- PROVIDER PROFILE ----------------
    if user.get("role") == "provider":

        provider_profile = {
            "id": str(uuid.uuid4()),
            "userId": user_id,
            "email": user["email"],
            "fullName": user.get("fullName") or user.get("name"),
            "phone": user.get("phone"),
            "serviceArea": user.get("city") or user.get("location"),

            "serviceType": "",
            "experience": 0,
            "skills": [],
            "address": "",

            "rating": 0,
            "jobsCompleted": 0,
            "totalEarned": 0,
            "successRate": 0,
            "reviews": [],

            "isVerified": False,
            "isAvailable": True,

            "memberSince": datetime.now().strftime("%B %Y"),
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        db.provider.insert_one(provider_profile)

    # ---------------- CUSTOMER PROFILE ----------------
    if user.get("role") == "customer":

        customer_profile = {
            "id": str(uuid.uuid4()),
            "userId": user_id,
            "email": user["email"],

            "accountStatus": "Active",
            "memberSince": datetime.now().strftime("%Y-%m"),

            "activitySummary": {
                "totalRequests": 0,
                "completed": 0,
                "cancelled": 0,
                "totalSpent": 0,
                "avgRatingGiven": 0
            },

            "preferences": {
                "preferredServices": [],
                "notificationsEnabled": True
            },

            "lastActive": datetime.now().isoformat()
        }

        db.customer_profile.insert_one(customer_profile)

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


# ---------------- GET PROVIDER PROFILE ----------------
@app.get("/provider/profile/{email}")
def get_provider_profile(email: str):

    profile = db.provider.find_one({"email": email}, {"_id": 0})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


# ---------------- GET CUSTOMER PROFILE ----------------
@app.get("/customer-profile/{email}")
def get_customer_profile(email: str):

    # 1. Get user
    user = db.user.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(user["_id"])

    # 2. Get profile using userId (correct relation)
    profile = db.customer_profile.find_one(
        {"userId": user_id},
        {"_id": 0}
    )

    # 3. Auto-create profile if missing (prevents frontend crash)
    if not profile:

        profile = {
            "id": str(uuid.uuid4()),
            "userId": user_id,
            "email": email,

            "accountStatus": "Active",
            "memberSince": datetime.now().strftime("%Y-%m"),

            "activitySummary": {
                "totalRequests": 0,
                "completed": 0,
                "cancelled": 0,
                "totalSpent": 0,
                "avgRatingGiven": 0
            },

            "preferences": {
                "preferredServices": [],
                "notificationsEnabled": True
            },

            "lastActive": datetime.now().isoformat()
        }

        db.customer_profile.insert_one(profile)

    return {
        "user": {
            "fullName": user.get("fullName"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "location": user.get("location"),
            "role": user.get("role")
        },
        "profile": profile
    }