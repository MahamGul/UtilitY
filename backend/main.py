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
# ----------------  BIDS  ----------------------------------------
# ================================================================

@app.post("/bids")
def submit_bid(data: dict):
    """
    Provider submits a bid on a request.
    Required fields: request_id, provider_email, bid_amount, availability, completion_time
    Optional: message
    """

    required = ["request_id", "provider_email", "bid_amount", "availability", "completion_time"]
    for field in required:
        if field not in data or data[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # Check request exists and is still open
    request = db.requests.find_one({"id": data["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request.get("status") not in ["pending", "open"]:
        raise HTTPException(status_code=400, detail="This request is no longer open for bids")

    # Check provider exists
    provider = db.provider.find_one({"email": data["provider_email"]})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    # Prevent duplicate bids
    existing = db.bids.find_one({
        "request_id": data["request_id"],
        "provider_email": data["provider_email"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a bid for this request")

    new_bid = {
        "id": str(uuid.uuid4()),
        "request_id": data["request_id"],

        "provider_email": data["provider_email"],
        "provider_name": provider.get("fullName", ""),
        "provider_service_type": provider.get("serviceType", ""),
        "provider_rating": provider.get("rating", 0),

        "bid_amount": int(data["bid_amount"]),
        "availability": data["availability"],
        "completion_time": data["completion_time"],
        "message": data.get("message", ""),

        # Snapshot of request info for easy display in bids history
        "request_snapshot": {
            "title": request.get("description", ""),
            "category": request.get("category", ""),
            "customer_name": request.get("user_name", ""),
            "customer_email": request.get("user_email", ""),
            "budget": request.get("budget", 0),
            "location_name": request.get("location_name", ""),
            "date": request.get("date", ""),
            "time": request.get("time", ""),
        },

        "status": "pending",  # pending | accepted | rejected | withdrawn
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.bids.insert_one(new_bid)

    return {"status": "success", "bid_id": new_bid["id"]}


@app.get("/bids/provider/{provider_email}")
def get_provider_bids(provider_email: str):
    """
    Returns all bids submitted by a provider (for Bids History page).
    """
    bids = list(db.bids.find({"provider_email": provider_email}, {"_id": 0}))
    bids.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return bids


@app.get("/bids/request/{request_id}")
def get_request_bids(request_id: str):
    """
    Returns all bids on a specific request (for customers to review).
    """
    bids = list(db.bids.find({"request_id": request_id}, {"_id": 0}))
    bids.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return bids


@app.delete("/bids/{bid_id}")
def withdraw_bid(bid_id: str, data: dict):
    """
    Provider withdraws their bid (only if still pending).
    Requires: provider_email in body for ownership check.
    """
    bid = db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    if bid["provider_email"] != data.get("provider_email"):
        raise HTTPException(status_code=403, detail="Not authorized")

    if bid["status"] != "pending":
        raise HTTPException(status_code=400, detail="Can only withdraw pending bids")

    db.bids.delete_one({"id": bid_id})
    return {"status": "success", "message": "Bid withdrawn"}


@app.put("/bids/{bid_id}/status")
def update_bid_status(bid_id: str, data: dict):
    """
    Customer accepts or rejects a bid.
    Requires: status ("accepted" | "rejected"), customer_email
    When a bid is accepted, the request status is set to "in_progress"
    and all other bids on that request are rejected.
    """
    new_status = data.get("status")
    if new_status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")

    bid = db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    # Verify the caller is the customer who posted the request
    request = db.requests.find_one({"id": bid["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Associated request not found")

    if request["user_email"] != data.get("customer_email"):
        raise HTTPException(status_code=403, detail="Not authorized")

    db.bids.update_one({"id": bid_id}, {"$set": {"status": new_status}})

    if new_status == "accepted":
        # Lock the request
        db.requests.update_one(
            {"id": bid["request_id"]},
            {"$set": {
                "status": "in_progress",
                "provider": bid["provider_email"],
                "accepted_bid_id": bid_id
            }}
        )
        # Reject all other pending bids on this request
        db.bids.update_many(
            {"request_id": bid["request_id"], "id": {"$ne": bid_id}},
            {"$set": {"status": "rejected"}}
        )

    return {"status": "success"}


# ================================================================
# ----------------  PROVIDER PROFILE  ----------------------------
# ================================================================

@app.get("/provider/profile/{email}")
def get_provider_profile(email: str):

    profile = db.provider.find_one(
        {"email": email},
        {"_id": 0}
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


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

    return {"status": "success", "message": "Profile updated"}


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
        {"$set": {"password": new_password}}
    )

    return {"status": "success", "message": "Password updated"}


@app.put("/provider/settings/{email}")
def update_provider_settings(email: str, data: dict):

    result = db.provider.update_one(
        {"email": email},
        {"$set": {"settings": data.get("settings")}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {"status": "success"}


@app.put("/provider/deactivate/{email}")
def deactivate_account(email: str):

    result = db.provider.update_one(
        {"email": email},
        {"$set": {"isAvailable": False, "isActive": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {"status": "success", "message": "Account deactivated"}


@app.delete("/provider/delete/{email}")
def delete_provider_account(email: str):

    db.provider.delete_one({"email": email})
    db.user.delete_one({"email": email})

    return {"status": "success", "message": "Account deleted permanently"}


# ================================================================
# ----------------  CUSTOMER PROFILE  ----------------------------
# ================================================================

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
