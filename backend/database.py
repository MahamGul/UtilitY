from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# Select database (same as in your URI)
db = client["utility_db"]

print("MongoDB connected ✅")
