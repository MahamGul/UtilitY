from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend connected to MongoDB 🚀"}

@app.post("/add-user")
def add_user(user: dict):
    db.users.insert_one(user)
    return {"status": "User added successfully"}

@app.get("/users")
def list_users():
    users = list(db.users.find({}, {"_id": 0}))  # exclude _id
    return users

# ✅ This block lets you run python main.py directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)