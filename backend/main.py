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
            "isActive": True,

            "settings": {
                "emailNotifications": True,
                "smsNotifications": True,
                "showProfile": True
            },

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

    db_user = db.user.find_one(
        {
            "email": user["email"],
            "password": user["password"]
        },
        {"_id": 0}
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user["role"] != user["role"]:
        raise HTTPException(status_code=403, detail="Role mismatch")

    return {
        "status": "success",
        "user": db_user
    }


# ---------------- CREATE REQUEST (UPDATED CORE FEATURE) ----------------
@app.post("/requests")
def create_request(request: dict):

    # ---------------- VALIDATION ----------------
    if "user_email" not in request:
        raise HTTPException(status_code=400, detail="user_email is required")

    user = db.user.find_one({"email": request["user_email"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("role") != "customer":
        raise HTTPException(status_code=403, detail="Only customers can create requests")

    profile = db.customer_profile.find_one({"email": user["email"]})

    if not profile:
        profile = {
            "id": str(uuid.uuid4()),
            "userId": str(user["_id"]),
            "email": user["email"],
            "accountStatus": "Active",
            "memberSince": datetime.now().strftime("%Y-%m")
        }
        db.customer_profile.insert_one(profile)

    required_fields = ["category", "description", "budget", "date", "time"]

    for field in required_fields:
        if field not in request or request[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    allowed_categories = ["plumber", "electrician", "mechanic", "carpenter", "general repair"]

    if request["category"] not in allowed_categories:
        raise HTTPException(status_code=400, detail="Invalid category")

    if "latitude" not in request or "longitude" not in request:
        raise HTTPException(status_code=400, detail="Location is required")

    # ---------------- NEW: LOCATION NAME SUPPORT ----------------
    location_name = request.get("location_name", "")

    # ---------------- CREATE REQUEST ----------------
    new_request = {
        "id": str(uuid.uuid4()),

        "user_email": user["email"],
        "user_name": user.get("fullName") or user.get("name"),
        "customer_id": str(user["_id"]),

        "category": request["category"],
        "description": request["description"],

        "image_url": request.get("image_url", ""),

        "location": {
            "type": "Point",
            "coordinates": [
                request["longitude"],
                request["latitude"]
            ]
        },

        # ✅ NEW FIELD STORED PROPERLY
        "location_name": location_name,

        "location_link": request.get(
            "location_link",
            f"https://www.google.com/maps?q={request['latitude']},{request['longitude']}"
        ),

        "budget": int(request["budget"]),
        "date": request["date"],
        "time": request["time"],
        "note": request.get("note", ""),

        "status": "open",

        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.requests.insert_one(new_request)

    return {"status": "success", "id": new_request["id"]}


# ---------------- GET REQUESTS ----------------
@app.get("/requests/{email}")
def get_requests(email: str):

    requests = list(
        db.requests.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

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

    profile = db.provider.find_one(
        {"email": email},
        {"_id": 0}
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


# ---------------- UPDATE PROVIDER PROFILE ----------------
@app.put("/provider/profile/update/{email}")
def update_provider_profile(email: str, data: dict):

    result = db.provider.update_one(
        {"email": email},
        {
            "$set": {
                "fullName": data.get("fullName"),
                "phone": data.get("phone"),
                "serviceArea": data.get("serviceArea"),
                "serviceType": data.get("serviceType"),
                "experience": data.get("experience"),
                "skills": data.get("skills", []),
                "address": data.get("address")
            }
        }
    )

    db.user.update_one(
        {"email": email},
        {
            "$set": {
                "fullName": data.get("fullName"),
                "phone": data.get("phone"),
                "location": data.get("serviceArea")
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {
        "status": "success",
        "message": "Profile updated"
    }


# ---------------- CHANGE PASSWORD ----------------
@app.put("/provider/change-password/{email}")
def change_password(email: str, data: dict):

    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    user = db.user.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["password"] != old_password:
        raise HTTPException(status_code=400, detail="Old password incorrect")

    db.user.update_one(
        {"email": email},
        {
            "$set": {
                "password": new_password
            }
        }
    )

    return {
        "status": "success",
        "message": "Password updated"
    }


# ---------------- UPDATE SETTINGS ----------------
@app.put("/provider/settings/{email}")
def update_provider_settings(email: str, data: dict):

    result = db.provider.update_one(
        {"email": email},
        {
            "$set": {
                "settings": data.get("settings")
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {"status": "success"}


# ---------------- DEACTIVATE ACCOUNT ----------------
@app.put("/provider/deactivate/{email}")
def deactivate_account(email: str):

    result = db.provider.update_one(
        {"email": email},
        {
            "$set": {
                "isAvailable": False,
                "isActive": False
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {
        "status": "success",
        "message": "Account deactivated"
    }


# ---------------- DELETE ACCOUNT ----------------
@app.delete("/provider/delete/{email}")
def delete_provider_account(email: str):

    db.provider.delete_one({"email": email})
    db.user.delete_one({"email": email})

    return {
        "status": "success",
        "message": "Account deleted permanently"
    }


# ---------------- GET CUSTOMER PROFILE ----------------
@app.get("/customer-profile/{email}")
def get_customer_profile(email: str):

    user = db.user.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(user["_id"])

    profile = db.customer_profile.find_one(
        {"userId": user_id},
        {"_id": 0}
    )

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