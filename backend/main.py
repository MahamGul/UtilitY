from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db

app = FastAPI()

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

@app.get("/")
def root():
    return {"message": "Backend connected to MongoDB 🚀"}

# Add a user to the 'user' collection
@app.post("/add-user")
def add_user(user: dict):
    db.user.insert_one(user)  # ✅ collection name is 'user'
    return {"status": "User added successfully"}

# Get all users from the 'user' collection from the database
@app.get("/users")
def list_users():
    users = list(db.user.find({}, {"_id": 0}))  # ✅ collection name is 'user'
    return users

# Run backend directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)