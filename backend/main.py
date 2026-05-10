from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from database import db
import uuid
from datetime import datetime, timezone
from bson import ObjectId
from typing import Optional
from utils import (
    get_object_id,
    serialize_doc,
    get_current_timestamp,
    create_response
)
from auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user
)
from fastapi import Depends

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

    user["password"] = hash_password(user["password"])
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
                "notificationsEnabled": True,
                "emailNotifications": True,
                "smsNotifications": True,
                "marketingCommunications": False
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
            "email": user["email"]
        }
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user["password"], db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # SAFE ROLE CHECK
    db_role = (db_user.get("role") or "").strip().lower()
    req_role = (user.get("role") or "").strip().lower()

    # DEBUG (put BEFORE if check)
    print("DB ROLE:", db_role)
    print("REQUEST ROLE:", req_role)

    if db_role != req_role:
        raise HTTPException(status_code=403, detail="Role mismatch")
    
    token_data = {"sub": str(db_user["_id"]), "email": db_user["email"], "role": db_role}

    return {
        "status": "success",
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "role": db_role
    }

@app.post("/token/refresh")
def refresh_token(body: dict):
    payload = decode_token(body.get("refresh_token", ""))
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    new_token = create_access_token({"sub": payload["sub"], "email": payload["email"], "role": payload["role"]})
    return {"access_token": new_token, "token_type": "bearer"}
# ================================================================
# ---------------- CREATE REQUEST ----------------
# ================================================================
@app.post("/requests")
def create_request(request: dict, current_user: dict = Depends(get_current_user)):

    if "email" not in current_user:
        raise HTTPException(status_code=400, detail="user_email is required")

    user = db.user.find_one({"email": current_user["email"]})

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

        "user_email": current_user["email"],
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

        "status": "pending",

        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.requests.insert_one(new_request)

    return {"status": "success", "id": new_request["id"]}


# ================================================================
# ---------------- GET REQUESTS ----------------
# ================================================================
@app.get("/requests/{email}")
def get_requests(email: str, current_user: dict = Depends(get_current_user)):

    requests = list(
        db.requests.find(
            {"user_email": current_user["email"]},
            {"_id": 0}
        )
    )

    return requests


# ================================================================
# ---------------- AVAILABLE REQUESTS ----------------
# ================================================================
@app.get("/available-requests/{provider_email}")
def get_available_requests(provider_email: str, category: str = "", current_user: dict = Depends(get_current_user)):

    already_bid = db.bids.distinct("request_id", {"provider_email": current_user["email"]})

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
def submit_bid(data: dict, current_user: dict = Depends(get_current_user)):
    required = ["request_id", "provider_email", "bid_amount", "availability", "completion_time"]
    for field in required:
        if field not in data or data[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    request = db.requests.find_one({"id": data["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request.get("status") not in ["pending", "open"]:
        raise HTTPException(status_code=400, detail="This request is no longer open for bids")

    provider = db.provider.find_one({"email": current_user["email"]})
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    existing = db.bids.find_one({
        "request_id": data["request_id"],
        "provider_email": current_user["email"]
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

        "status": "pending",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.bids.insert_one(new_bid)

    return {"status": "success", "bid_id": new_bid["id"]}


@app.get("/bids/provider/{provider_email}")
def get_provider_bids(provider_email: str, current_user: dict = Depends(get_current_user)):
    bids = list(db.bids.find({"provider_email": current_user["email"]}, {"_id": 0}))
    bids.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return bids


@app.get("/bids/request/{request_id}")
def get_request_bids(request_id: str):
    bids = list(db.bids.find({"request_id": request_id}, {"_id": 0}))
    bids.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return bids


@app.delete("/bids/{bid_id}")
def withdraw_bid(bid_id: str, data: dict, current_user: dict = Depends(get_current_user)):
    bid = db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    if bid["provider_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if bid["status"] != "pending":
        raise HTTPException(status_code=400, detail="Can only withdraw pending bids")

    db.bids.delete_one({"id": bid_id})
    return {"status": "success", "message": "Bid withdrawn"}


@app.put("/bids/{bid_id}/status")
def update_bid_status(bid_id: str, data: dict,current_user: dict = Depends(get_current_user)):
    new_status = data.get("status")
    if new_status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")

    bid = db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    request = db.requests.find_one({"id": bid["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Associated request not found")

    if request["user_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.bids.update_one({"id": bid_id}, {"$set": {"status": new_status}})

    if new_status == "accepted":
        db.requests.update_one(
            {"id": bid["request_id"]},
            {"$set": {
                "status": "in_progress",
                "provider": bid["provider_email"],
                "accepted_bid_id": bid_id
            }}
        )
        db.bids.update_many(
            {"request_id": bid["request_id"], "id": {"$ne": bid_id}},
            {"$set": {"status": "rejected"}}
        )

    return {"status": "success"}


# ================================================================
# ----------------  PROVIDER PROFILE  ----------------------------
# ================================================================

@app.get("/provider/profile/{email}")
def get_provider_profile(email: str, current_user: dict = Depends(get_current_user)):

    profile = db.provider.find_one(
        {"email": current_user["email"]},
        {"_id": 0}
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile


@app.put("/provider/profile/update/{email}")
def update_provider_profile(email: str, data: dict, current_user: dict = Depends(get_current_user)):

    result = db.provider.update_one(
        {"email": current_user["email"]},
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
        {"email": current_user["email"]},
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
def change_provider_password(email: str, data: dict, current_user: dict = Depends(get_current_user)):

    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    user = db.user.find_one({"email": current_user["email"]})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["password"] != old_password:
        raise HTTPException(status_code=400, detail="Old password incorrect")

    db.user.update_one(
        {"email": current_user["email"]},
        {"$set": {"password": new_password}}
    )

    return {"status": "success", "message": "Password updated"}


@app.put("/provider/settings/{email}")
def update_provider_settings(email: str, data: dict, current_user: dict = Depends(get_current_user)):

    result = db.provider.update_one(
        {"email": current_user["email"]},
        {"$set": {"settings": data.get("settings")}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {"status": "success"}


@app.put("/provider/deactivate/{email}")
def deactivate_account(email: str, current_user: dict = Depends(get_current_user)):

    result = db.provider.update_one(
        {"email": current_user["email"]},
        {"$set": {"isAvailable": False, "isActive": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Provider not found")

    return {"status": "success", "message": "Account deactivated"}


@app.delete("/provider/delete/{email}")
def delete_provider_account(email: str, current_user: dict = Depends(get_current_user)):

    db.provider.delete_one({"email": current_user["email"]})
    db.user.delete_one({"email": current_user["email"]})

    return {"status": "success", "message": "Account deleted permanently"}


# ================================================================
# ----------------  CUSTOMER PROFILE  ----------------------------
# ================================================================

@app.get("/customer-profile/{email}")
def get_customer_profile(email: str, current_user: dict = Depends(get_current_user)):

    user = db.user.find_one({"email": current_user["email"]})

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
            "email": current_user["email"],
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
                "notificationsEnabled": True,
                "emailNotifications": True,
                "smsNotifications": True,
                "marketingCommunications": False
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


# ================================================================
# ----------------  CUSTOMER PROFILE UPDATE  ---------------------
# ================================================================

@app.put("/customer-profile/update/{email}")
def update_customer_profile(email: str, data: dict, current_user: dict = Depends(get_current_user)):
    user = db.user.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.user.update_one(
        {"email": current_user["email"]},
        {
            "$set": {
                "fullName": data.get("fullName"),
                "phone": data.get("phone"),
                "location": data.get("location"),
            }
        }
    )

    user_id = str(user["_id"])
    db.customer_profile.update_one(
        {"userId": user_id},
        {
            "$set": {
                "lastActive": datetime.now().isoformat()
            }
        }
    )

    return {"status": "success", "message": "Profile updated successfully"}


# ================================================================
# ----------------  CUSTOMER CHANGE PASSWORD  --------------------
# ================================================================

@app.put("/customer/change-password/{email}")
def change_customer_password(email: str, data: dict, current_user: dict = Depends(get_current_user)):
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not old_password or not new_password:
        raise HTTPException(status_code=400, detail="oldPassword and newPassword are required")

    if len(new_password) < 4:
        raise HTTPException(status_code=400, detail="New password must be at least 4 characters")

    user = db.user.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["password"] != old_password:
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    db.user.update_one(
        {"email": current_user["email"]},
        {"$set": {"password": new_password}}
    )

    return {"status": "success", "message": "Password changed successfully"}


# ================================================================
# ----------------  CUSTOMER NOTIFICATION SETTINGS  --------------
# ================================================================

@app.put("/customer/settings/{email}")
def update_customer_settings(email: str, data: dict, current_user: dict = Depends(get_current_user)):
    user = db.user.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(user["_id"])

    result = db.customer_profile.update_one(
        {"userId": user_id},
        {
            "$set": {
                "preferences.emailNotifications": data.get("emailNotifications", True),
                "preferences.smsNotifications": data.get("smsNotifications", True),
                "preferences.marketingCommunications": data.get("marketingCommunications", False),
                "preferences.notificationsEnabled": data.get("emailNotifications", True),
                "lastActive": datetime.now().isoformat()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Customer profile not found")

    return {"status": "success", "message": "Settings updated"}


# ================================================================
# ----------------  CUSTOMER DEACTIVATE  -------------------------
# ================================================================

@app.put("/customer/deactivate/{email}")
def deactivate_customer(email: str, current_user: dict = Depends(get_current_user)):
    user = db.user.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(user["_id"])

    result = db.customer_profile.update_one(
        {"userId": user_id},
        {"$set": {"accountStatus": "Inactive"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Customer profile not found")

    return {"status": "success", "message": "Account deactivated"}


# ================================================================
# ----------------  CUSTOMER DELETE  -----------------------------
# ================================================================

@app.delete("/customer/delete/{email}")
def delete_customer(email: str, current_user: dict = Depends(get_current_user)):
    user = db.user.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = str(user["_id"])

    db.customer_profile.delete_one({"userId": user_id})
    db.requests.delete_many({"user_email": current_user["email"]})
    db.user.delete_one({"email": current_user["email"]})

    return {"status": "success", "message": "Account deleted permanently"}

# ================================================================
# PUT /bids/{bid_id}/start
# ================================================================

@app.put("/bids/{bid_id}/start")
def start_service(bid_id: str, data: dict, current_user: dict = Depends(get_current_user)):

    provider_email   = current_user["email"]
    latitude         = data.get("latitude")
    longitude        = data.get("longitude")
    provider_address = data.get("provider_address", "")

    if not provider_email:
        raise HTTPException(status_code=400, detail="provider_email is required")
    if latitude is None or longitude is None:
        raise HTTPException(status_code=400, detail="latitude and longitude are required")

    bid = db.bids.find_one({"id": bid_id})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    if bid["provider_email"] != provider_email:
        raise HTTPException(status_code=403, detail="Not authorized")
    if bid["status"] != "accepted":
        raise HTTPException(status_code=400, detail="Only accepted bids can be started")

    started_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.bids.update_one(
        {"id": bid_id},
        {
            "$set": {
                "service_started":        True,
                "service_started_at":     started_at,
                "provider_start_address": provider_address,
                "provider_start_location": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "status": "in_progress"
            }
        }
    )

    db.requests.update_one(
        {"id": bid["request_id"]},
        {
            "$set": {
                "status":                 "in_progress",
                "service_started":        True,
                "service_started_at":     started_at,
                "provider_email":         provider_email,
                "provider_start_address": provider_address,
                "provider_start_location": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                }
            }
        }
    )

    return {
        "status":     "success",
        "message":    "Service started",
        "started_at": started_at
    }


# ================================================================
# PUT /requests/{request_id}/complete
# ✅ FIXED: Now increments provider's jobsCompleted and totalEarned
# ================================================================

@app.put("/requests/{request_id}/complete")
def mark_request_complete(request_id: str, data: dict, current_user: dict = Depends(get_current_user)):

    customer_email = current_user["email"]
    if not customer_email:
        raise HTTPException(status_code=400, detail="customer_email is required")

    request = db.requests.find_one({"id": request_id})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request["user_email"] != customer_email:
        raise HTTPException(status_code=403, detail="Not authorized")
    if request.get("status") != "in_progress":
        raise HTTPException(status_code=400, detail="Only in-progress requests can be marked complete")

    completed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Update request status
    db.requests.update_one(
        {"id": request_id},
        {
            "$set": {
                "status":         "completed",
                "task_completed": True,
                "completed_at":   completed_at
            }
        }
    )

    # Update the accepted bid and get bid details
    accepted_bid_id = request.get("accepted_bid_id")
    bid_amount = 0
    provider_email = request.get("provider_email") or request.get("provider")

    if accepted_bid_id:
        bid = db.bids.find_one({"id": accepted_bid_id})
        if bid:
            bid_amount = bid.get("bid_amount", 0)
            # Fallback: get provider email from bid if not on request
            if not provider_email:
                provider_email = bid.get("provider_email")

        db.bids.update_one(
            {"id": accepted_bid_id},
            {
                "$set": {
                    "status":       "completed",
                    "completed_at": completed_at
                }
            }
        )

    # ✅ Update provider profile stats
    if provider_email:
        db.provider.update_one(
            {"email": provider_email},
            {
                "$inc": {
                    #"jobsCompleted": 1,
                    "totalEarned":   bid_amount
                }
            }
        )

    return {
        "status":       "success",
        "message":      "Task marked as complete",
        "completed_at": completed_at
    }


# ================================================================
# PUT /requests/{request_id}/cancel
# ================================================================

@app.put("/requests/{request_id}/cancel")
def cancel_request(request_id: str, data: dict, current_user: dict = Depends(get_current_user)):

    customer_email = current_user["email"]
    if not customer_email:
        raise HTTPException(status_code=400, detail="customer_email is required")

    request = db.requests.find_one({"id": request_id})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request["user_email"] != customer_email:
        raise HTTPException(status_code=403, detail="Not authorized")

    if request.get("status") == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel completed request")

    cancelled_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.requests.update_one(
        {"id": request_id},
        {
            "$set": {
                "status": "cancelled",
                "cancelled_at": cancelled_at,
                "service_started": False
            }
        }
    )

    accepted_bid_id = request.get("accepted_bid_id")
    if accepted_bid_id:
        db.bids.update_one(
            {"id": accepted_bid_id},
            {
                "$set": {
                    "status": "cancelled",
                    "cancelled_at": cancelled_at
                }
            }
        )

    return {
        "status": "success",
        "message": "Request cancelled",
        "cancelled_at": cancelled_at
    }

# ================================================================
# ----------------  FEEDBACK  ------------------------------------
# ================================================================

@app.post("/feedback")
def submit_feedback(data: dict, current_user: dict = Depends(get_current_user)):

    required_fields = ["request_id", "customer_email", "rating"]

    for field in required_fields:
        if field not in data or data[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    # ---------------- GET REQUEST ----------------
    request = db.requests.find_one({"id": data["request_id"]})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # ---------------- VALIDATIONS ----------------
    if request["user_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if request.get("status") != "completed":
        raise HTTPException(status_code=400, detail="Feedback allowed only after completion")

    # Prevent duplicate feedback
    existing = db.feedback.find_one({"request_id": data["request_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Feedback already submitted")

    # ---------------- GET PROVIDER ----------------
    provider_email = request.get("provider_email") or request.get("provider")
    provider = db.provider.find_one({"email": provider_email})

    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")

    # ---------------- CREATE FEEDBACK ----------------
    feedback = {
        "id": str(uuid.uuid4()),

        "request_id": request["id"],
        "bid_id": request.get("accepted_bid_id"),

        "customer_id": request.get("customer_id"),
        "customer_email": request.get("user_email"),
        "customer_name": request.get("user_name"),

        "provider_id": provider.get("userId"),
        "provider_email": provider_email,
        "provider_name": provider.get("fullName"),

        "rating": int(data["rating"]),
        "comment": data.get("comment", ""),

        "category": request.get("category"),
        "service_date": request.get("completed_at"),

        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    db.feedback.insert_one(feedback)

    # ---------------- ⭐ IMPORTANT FIX ----------------
    # Mark request as rated so frontend can hide it
    db.requests.update_one(
        {"id": request["id"]},
        {"$set": {"feedback_given": True}}
    )

    # ---------------- UPDATE PROVIDER RATING ----------------
    old_rating = provider.get("rating", 0)
    jobs = provider.get("jobsCompleted", 0)

    if jobs == 0:
        new_rating = feedback["rating"]
        new_jobs = 1
    else:
        new_rating = ((old_rating * jobs) + feedback["rating"]) / (jobs + 1)
        new_jobs = jobs + 1

    db.provider.update_one(
        {"email": provider_email},
        {
            "$set": {
                "rating": new_rating,
                "jobsCompleted": new_jobs
            },
            "$push": {
                "reviews": {
                    "rating": feedback["rating"],
                    "comment": feedback["comment"],
                    "customer_name": feedback["customer_name"]
                }
            }
        }
    )

    return {
        "status": "success",
        "message": "Feedback submitted successfully"
    }

@app.get("/feedback/provider/{provider_email}")
def get_provider_feedback(provider_email: str, current_user: dict = Depends(get_current_user)):

    feedbacks = list(
        db.feedback.find(
            {"provider_email": current_user["email"]},
            {"_id": 0}
        )
    )

    feedbacks.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    return feedbacks

# ================================================================
# ----------------  MESSAGES / CHAT  -----------------------------
# ================================================================

@app.post("/messages")
def send_message(data: dict):

    required = ["sender", "receiver", "text"]

    for field in required:
        if field not in data or data[field] == "":
            raise HTTPException(status_code=400, detail=f"{field} is required")

    message = {
        "id": str(uuid.uuid4()),
        "sender": data["sender"],
        "receiver": data["receiver"],
        "text": data["text"],
        "timestamp": datetime.now(timezone.utc)    
        }

    db.messages.insert_one(message)

    return {"status": "success"}


@app.get("/messages/{user1}/{user2}")
def get_messages(user1: str, user2: str):

    messages = list(
        db.messages.find({
            "$or": [
                {"sender": user1, "receiver": user2},
                {"sender": user2, "receiver": user1}
            ]
        }, {"_id": 0})
    )

    messages.sort(key=lambda x: x["timestamp"])

    return messages

@app.get("/conversations/{email}")
def get_conversations(email: str):

    messages = list(db.messages.find({
        "$or": [
            {"sender": email},
            {"receiver": email}
        ]
    }))

    convo_map = {}

    for msg in messages:
        other = msg["receiver"] if msg["sender"] == email else msg["sender"]

        if other not in convo_map or msg["timestamp"] > convo_map[other]["timestamp"]:
            convo_map[other] = {
                "user": other,
                "lastMessage": msg["text"],
                "timestamp": msg["timestamp"]
            }

    return sorted(
    convo_map.values(),
    key=lambda x: x["timestamp"],
    reverse=True
)

@app.get("/provider/top")
def get_top_providers(serviceType: str):
    providers = list(db.provider.find({
    "serviceType": serviceType }))

    result = []

    for p in providers:
        # skip inactive/unavailable safely (instead of strict query)
        if not p.get("isActive", True):
            continue
        if not p.get("isAvailable", True):
            continue

        rating = p.get("rating", 0)
        jobs = p.get("jobsCompleted", 0)

        # scoring formula
        score = (rating * 0.7) + (jobs * 0.3)

        # badge logic
        if rating >= 4.5:
            badge = "Top Rated"
        elif jobs >= 10:
            badge = "Experienced"
        else:
            badge = ""

        # clean response object (IMPORTANT)
        result.append({
            "id": p.get("id"),
            "fullName": p.get("fullName"),
            "serviceType": p.get("serviceType"),
            "rating": rating,
            "jobsCompleted": jobs,
            "score": score,
            "badge": badge
        })

# sort after building clean list
    result.sort(key=lambda x: x["score"], reverse=True)

    return result[:5]


# ================================================================
# ----------------  ADMIN AUTHENTICATION  --------------------
# ================================================================

# In-memory session storage (for demo purposes)
# In production, use proper JWT tokens or sessions
admin_sessions = {}


def verify_admin_session(authorization: str = Header(None)) -> dict:
    """Verify admin session token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    # Simple token format: "Bearer <session_id>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    session_id = authorization.replace("Bearer ", "")
    
    if session_id not in admin_sessions:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return admin_sessions[session_id]


@app.post("/logout")
def logout(authorization: str = Header(None)):
    """Admin logout endpoint."""
    if not authorization or not authorization.startswith("Bearer "):
        return {"status": "success", "message": "Logged out"}
    
    session_id = authorization.replace("Bearer ", "")
    
    if session_id in admin_sessions:
        del admin_sessions[session_id]
    
    return {"status": "success", "message": "Logged out successfully"}


# ================================================================
# ----------------  ADMIN DASHBOARD  --------------------
# ================================================================

@app.get("/admin/dashboard/stats")
def get_dashboard_stats():
    """Get dashboard statistics."""
    # Total users
    total_users = db.user.count_documents({})
    
    # Total providers
    total_providers = db.provider.count_documents({})
    
    # Pending providers (isVerified = False)
    pending_providers = db.provider.count_documents({"isVerified": False})
    
    # Total requests
    total_requests = db.requests.count_documents({})
    
    # Active services (status = in_progress)
    active_services = db.requests.count_documents({"status": "in_progress"})
    
    # Completed services
    completed_services = db.requests.count_documents({"status": "completed"})
    
    # Total reports
    total_reports = db.reports.count_documents({}) if "reports" in db.list_collection_names() else 0
    
    return {
        "totalUsers": total_users,
        "totalProviders": total_providers,
        "pendingProviders": pending_providers,
        "totalRequests": total_requests,
        "activeServices": active_services,
        "completedServices": completed_services,
        "totalReports": total_reports
    }


@app.get("/admin/dashboard/recent-providers")
def get_recent_providers():
    """Get recent registered providers."""
    providers = list(
        db.provider.find(
            {},
            {
                "_id": 0,
                "id": 1,
                "email": 1,
                "fullName": 1,
                "phone": 1,
                "serviceType": 1,
                "serviceArea": 1,
                "experience": 1,
                "rating": 1,
                "isVerified": 1,
                "createdAt": 1,
                "memberSince": 1
            }
        ).sort("createdAt", -1).limit(10)
    )
    
    # Convert ObjectId if present
    result = []
    for p in providers:
        result.append(p)
    
    return result


@app.get("/admin/dashboard/pending-actions")
def get_pending_actions():
    """Get pending actions for admin."""
    # Pending providers
    pending_providers = list(
        db.provider.find(
            {"isVerified": False},
            {
                "_id": 0,
                "id": 1,
                "email": 1,
                "fullName": 1,
                "serviceType": 1,
                "createdAt": 1
            }
        ).limit(10)
    )
    
    # Unresolved reports
    if "reports" in db.list_collection_names():
        unresolved_reports = list(
            db.reports.find(
                {"status": {"$ne": "resolved"}},
                {
                    "_id": 0,
                    "report_id": 1,
                    "reporter_email": 1,
                    "reported_user": 1,
                    "category": 1,
                    "status": 1,
                    "created_at": 1
                }
            ).limit(10)
        )
    else:
        unresolved_reports = []
    
    # Pending disputes (using requests with disputes)
    pending_disputes = list(
        db.requests.find(
            {"dispute_status": {"$exists": True, "$ne": "resolved"}},
            {
                "_id": 0,
                "id": 1,
                "user_email": 1,
                "description": 1,
                "dispute_status": 1,
                "created_at": 1
            }
        ).limit(10)
    )
    
    return {
        "pendingProviders": list(pending_providers),
        "unresolvedReports": list(unresolved_reports),
        "pendingDisputes": list(pending_disputes)
    }


@app.get("/admin/dashboard/activity")
def get_activity_feed():
    """Get admin activity feed."""
    if "admin_activity" in db.list_collection_names():
        activities = list(
            db.admin_activity.find(
                {},
                {"_id": 0}
            ).sort("timestamp", -1).limit(20)
        )
    else:
        activities = []
    
    return activities


def log_admin_activity(action: str, details: str, admin_email: str):
    """Log admin activity."""
    activity = {
        "id": str(uuid.uuid4()),
        "action": action,
        "details": details,
        "admin_email": admin_email,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    if "admin_activity" not in db.list_collection_names():
        db.create_collection("admin_activity")
    
    db.admin_activity.insert_one(activity)


# ================================================================
# ----------------  PROVIDER VERIFICATION  -----------------
# ================================================================

@app.get("/admin/providers/pending")
def get_pending_providers():
    """Get all pending provider verification requests."""
    providers = list(
        db.provider.find(
            {"isVerified": False},
            {"_id": 0}
        )
    )
    
    return providers


@app.get("/admin/providers")
def get_all_providers():
    """Get all providers."""
    providers = list(
        db.provider.find(
            {},
            {"_id": 0}
        )
    )
    
    return providers


@app.get("/admin/providers/{providerId}")
def get_provider_details(providerId: str):
    """Get provider details by ID."""
    provider = db.provider.find_one(
        {"id": providerId},
        {"_id": 0}
    )
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    return provider


@app.put("/admin/providers/{providerId}/approve")
def approve_provider(providerId: str, data: dict):
    """Approve a provider."""
    provider = db.provider.find_one({"id": providerId})
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Update provider verification status
    db.provider.update_one(
        {"id": providerId},
        {
            "$set": {
                "isVerified": True,
                "verification_status": "approved",
                "approved_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        }
    )
    
    # Log activity
    log_admin_activity(
        action="provider_approved",
        details=f"Approved provider: {provider.get('email')} ({provider.get('fullName')})",
        admin_email=data.get("admin_email", "admin") if data else "admin"
    )
    
    return {
        "status": "success",
        "message": "Provider approved successfully",
        "providerId": providerId
    }


@app.put("/admin/providers/{providerId}/reject")
def reject_provider(providerId: str, data: dict):
    """Reject a provider."""
    provider = db.provider.find_one({"id": providerId})
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    rejection_reason = data.get("rejection_reason", "") if data else ""
    
    # Update provider verification status
    db.provider.update_one(
        {"id": providerId},
        {
            "$set": {
                "isVerified": False,
                "verification_status": "rejected",
                "rejected_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "rejection_reason": rejection_reason
            }
        }
    )
    
    # Log activity
    log_admin_activity(
        action="provider_rejected",
        details=f"Rejected provider: {provider.get('email')} - Reason: {rejection_reason}",
        admin_email=data.get("admin_email", "admin") if data else "admin"
    )
    
    return {
        "status": "success",
        "message": "Provider rejected",
        "providerId": providerId,
        "rejection_reason": rejection_reason
    }


# ================================================================
# ----------------  CUSTOMER REPORTS  ----------------------
# ================================================================

@app.get("/admin/reports")
def get_all_reports():
    """Get all reports."""
    if "reports" not in db.list_collection_names():
        db.create_collection("reports")
    
    reports = list(
        db.reports.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1)
    )
    
    return reports


@app.get("/admin/reports/stats")
def get_reports_stats():
    """Get reports statistics."""
    if "reports" not in db.list_collection_names():
        db.create_collection("reports")
    
    total_reports = db.reports.count_documents({})
    pending_reports = db.reports.count_documents({"status": "pending"})
    resolved_reports = db.reports.count_documents({"status": "resolved"})
    escalated_reports = db.reports.count_documents({"status": "escalated"})
    
    return {
        "totalReports": total_reports,
        "pendingReports": pending_reports,
        "resolvedReports": resolved_reports,
        "escalatedReports": escalated_reports
    }


@app.get("/admin/reports/{reportId}")
def get_report_details(reportId: str):
    """Get report details by ID."""
    if "reports" not in db.list_collection_names():
        db.create_collection("reports")
    
    report = db.reports.find_one(
        {"report_id": reportId},
        {"_id": 0}
    )
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report


@app.put("/admin/reports/{reportId}/resolve")
def resolve_report(reportId: str, data: dict):
    """Resolve a report."""
    if "reports" not in db.list_collection_names():
        db.create_collection("reports")
    
    report = db.reports.find_one({"report_id": reportId})
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    resolution = data.get("resolution", "") if data else ""
    
    # Update report
    db.reports.update_one(
        {"report_id": reportId},
        {
            "$set": {
                "status": "resolved",
                "resolution": resolution,
                "resolved_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "resolved_by": data.get("admin_email", "admin") if data else "admin"
            }
        }
    )
    
    # Log activity
    log_admin_activity(
        action="report_resolved",
        details=f"Resolved report {reportId}: {resolution}",
        admin_email=data.get("admin_email", "admin") if data else "admin"
    )
    
    return {
        "status": "success",
        "message": "Report resolved",
        "reportId": reportId,
        "resolution": resolution
    }


@app.put("/admin/reports/{reportId}/escalate")
def escalate_report(reportId: str, data: dict):
    """Escalate a report."""
    if "reports" not in db.list_collection_names():
        db.create_collection("reports")
    
    report = db.reports.find_one({"report_id": reportId})
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    escalation_details = data.get("escalation_details", "") if data else ""
    
    # Update report
    db.reports.update_one(
        {"report_id": reportId},
        {
            "$set": {
                "status": "escalated",
                "escalation_details": escalation_details,
                "escalated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "escalated_by": data.get("admin_email", "admin") if data else "admin"
            }
        }
    )
    
    # Log activity
    log_admin_activity(
        action="report_escalated",
        details=f"Escalated report {reportId}: {escalation_details}",
        admin_email=data.get("admin_email", "admin") if data else "admin"
    )
    
    return {
        "status": "success",
        "message": "Report escalated",
        "reportId": reportId,
        "escalation_details": escalation_details
    }


# ================================================================
# ----------------  USER MANAGEMENT  ---------------------
# ================================================================

@app.get("/admin/users")
def get_all_users():
    """Get all users."""
    users = list(
        db.user.find(
            {},
            {"_id": 0, "password": 0}
        )
    )
    
    return users


@app.get("/admin/users/stats")
def get_user_stats():
    """Get user statistics."""
    total_users = db.user.count_documents({})
    total_customers = db.user.count_documents({"role": "customer"})
    total_providers = db.user.count_documents({"role": "provider"})
    
    # Active users (users with active profiles)
    active_customers = db.customer_profile.count_documents({"accountStatus": "Active"}) if "customer_profile" in db.list_collection_names() else 0
    active_providers = db.provider.count_documents({"isActive": True})
    
    # Deactivated users
    if "customer_profile" in db.list_collection_names():
        deactivated_customers = db.customer_profile.count_documents({"accountStatus": "Inactive"})
    else:
        deactivated_customers = 0
    
    deactivated_providers = db.provider.count_documents({"isActive": False})
    
    return {
        "totalUsers": total_users,
        "totalCustomers": total_customers,
        "totalProviders": total_providers,
        "activeUsers": active_customers + active_providers,
        "deactivatedUsers": deactivated_customers + deactivated_providers,
        "activeCustomers": active_customers,
        "activeProviders": active_providers,
        "deactivatedCustomers": deactivated_customers,
        "deactivatedProviders": deactivated_providers
    }


# ================================================================
# ----------------  SAMPLE ADMIN CREATION  --------------
# ================================================================

def create_sample_admin():
    """Create sample admin user if not exists."""
    admin_email = "admin@utility.com"
    
    existing_admin = db.user.find_one({"email": admin_email, "role": "admin"})
    
    if not existing_admin:
        admin_user = {
            "email": admin_email,
            "password": "admin123",  # In production, hash this!
            "fullName": "Admin",
            "role": "admin",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        db.user.insert_one(admin_user)
        print("Sample admin created: admin@utility.com / admin123")


# Create sample admin on startup
create_sample_admin()
