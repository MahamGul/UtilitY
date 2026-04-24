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


# ================================================================
# ---------------- SIGNUP ----------------
# ================================================================
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


# ================================================================
# ---------------- LOGIN ----------------
# ================================================================
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

    return {"status": "success", "user": db_user}


# ================================================================
# ---------------- CREATE REQUEST (FIXED STATUS HERE) ----------------
# ================================================================
@app.post("/requests")
def create_request(request: dict):

    if "user_email" not in request:
        raise HTTPException(status_code=400, detail="user_email is required")

    user = db.user.find_one({"email": request["user_email"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("role") != "customer":
        raise HTTPException(status_code=403, detail="Only customers can create requests")

    required_fields = ["category", "description", "budget", "date", "time"]

    for field in required_fields:
        if field not in request or request[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    allowed_categories = ["plumber", "electrician", "mechanic", "carpenter", "general repair"]

    if request["category"] not in allowed_categories:
        raise HTTPException(status_code=400, detail="Invalid category")

    if "latitude" not in request or "longitude" not in request:
        raise HTTPException(status_code=400, detail="Location is required")

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

        "location_name": request.get("location_name", ""),

        "location_link": request.get(
            "location_link",
            f"https://www.google.com/maps?q={request['latitude']},{request['longitude']}"
        ),

        "budget": int(request["budget"]),
        "date": request["date"],
        "time": request["time"],
        "note": request.get("note", ""),

        # 🔥 FIXED HERE
        "status": "pending",

        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.requests.insert_one(new_request)

    return {"status": "success", "id": new_request["id"]}


# ================================================================
# ---------------- GET REQUESTS ----------------
# ================================================================
@app.get("/requests/{email}")
def get_requests(email: str):

    requests = list(
        db.requests.find(
            {"user_email": email},
            {"_id": 0}
        )
    )

    return requests


# ================================================================
# ---------------- AVAILABLE REQUESTS (FIXED STATUS SUPPORT) -----
# ================================================================
@app.get("/available-requests/{provider_email}")
def get_available_requests(provider_email: str, category: str = None):

    already_bid = db.bids.distinct("request_id", {"provider_email": provider_email})

    # 🔥 FIX: support both old + new systems
    query = {
        "status": {"$in": ["pending", "open"]},
        "id": {"$nin": already_bid}
    }

    if category:
        query["category"] = category

    raw = list(db.requests.find(query, {"_id": 0}))

    result = []
    for req in raw:
        req["totalBids"] = db.bids.count_documents({"request_id": req["id"]})
        result.append(req)

    result.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    return result


# ================================================================
# ---------------- BIDS (UNCHANGED LOGIC) ------------------------
# ================================================================
@app.post("/bids")
def submit_bid(data: dict):

    required = ["request_id", "provider_email", "bid_amount", "availability", "completion_time"]
    for field in required:
        if field not in data or data[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    request = db.requests.find_one({"id": data["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.get("status") != "pending":
        raise HTTPException(status_code=400, detail="This request is no longer open for bids")

    provider = db.provider.find_one({"email": data["provider_email"]})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    existing = db.bids.find_one({
        "request_id": data["request_id"],
        "provider_email": data["provider_email"]
    })

    if existing:
        raise HTTPException(status_code=400, detail="Already bid")

    new_bid = {
        "id": str(uuid.uuid4()),
        "request_id": data["request_id"],
        "provider_email": data["provider_email"],
        "provider_name": provider.get("fullName", ""),
        "bid_amount": int(data["bid_amount"]),
        "availability": data["availability"],
        "completion_time": data["completion_time"],
        "message": data.get("message", ""),
        "status": "pending",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.bids.insert_one(new_bid)

    return {"status": "success", "bid_id": new_bid["id"]}


# ================================================================
# (ALL OTHER ENDPOINTS UNCHANGED - kept as-is for safety)
# ================================================================

# --- rest of your endpoints remain EXACTLY SAME ---