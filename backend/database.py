from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Mongo URI
MONGO_URI = os.getenv("MONGO_URI")

# ✅ Debug check (VERY IMPORTANT)
if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not found in .env file")

if not MONGO_URI.startswith("mongodb://") and not MONGO_URI.startswith("mongodb+srv://"):
    raise ValueError("❌ Invalid MONGO_URI format. Must start with 'mongodb://' or 'mongodb+srv://'")

# Connect to MongoDB
try:
    client = MongoClient(MONGO_URI)
    db = client["utility_db"]

    # Test connection
    client.admin.command("ping")

    print("MongoDB connected ✅")

except Exception as e:
    print("❌ MongoDB connection failed:", e)
    raise