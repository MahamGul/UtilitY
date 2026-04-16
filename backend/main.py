from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import db

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
    return {"message": "Backend connected to MongoDB 🚀"}

# ---------------- SIGNUP ----------------
@app.post("/add-user")
def add_user(user: dict):

    # check duplicate email
    existing_user = db.user.find_one({"email": user["email"]})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    db.user.insert_one(user)

    return {
        "status": "success",
        "message": "User created successfully"
    }

# ---------------- LOGIN ----------------
@app.post("/login")
def login(user: dict):

    db_user = db.user.find_one(
        {
            "email": user["email"],
            "password": user["password"],
            "role": user["role"]
        },
        {"_id": 0}
    )

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email, password or role")

    return {
        "status": "success",
        "message": "Login successful",
        "user": db_user
    }

# ---------------- GET ALL USERS (DEBUG ONLY) ----------------
@app.get("/users")
def list_users():
    users = list(db.user.find({}, {"_id": 0}))
    return users

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)