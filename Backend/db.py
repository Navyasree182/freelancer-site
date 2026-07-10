"""
db.py – MongoDB (PyMongo) helper for the Freelance Marketplace Platform.

Collections
───────────
freelancers  clients  projects  bids  contracts  counters

Setup – choose ONE of the following:
────────────────────────────────────
Option A  (MongoDB Atlas)
  Set your Atlas URI in MONGO_URI below, e.g.:
  mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

Option B  (Local MongoDB)
  Install MongoDB Community Edition and start it:
  https://www.mongodb.com/try/download/community
  Then leave MONGO_URI as 'mongodb://localhost:27017/'

Option C  (Environment variable)
  set MONGO_URI=mongodb+srv://...
"""
import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

# ── Connection string ─────────────────────────────────────────────────────────
# ✏️  REPLACE THIS with your MongoDB Atlas URI if you are not running MongoDB locally.
# ✏️  PASTE YOUR MONGODB COMPASS CONNECTION STRING BELOW (replace the placeholder):
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://navyasree38p_db_user:Navyasree%4012@cluster0.l5xfczs.mongodb.net/')

DB_NAME = 'freelance_marketplace'

# ── Client (created once at module load) ──────────────────────────────────────
# serverSelectionTimeoutMS=3000 means we fail fast instead of waiting 30 s.
_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
_db     = _client[DB_NAME]

# ── Public collection handles (imported by views.py) ──────────────────────────
freelancers_col = _db['freelancers']
clients_col     = _db['clients']
projects_col    = _db['projects']
bids_col        = _db['bids']
contracts_col   = _db['contracts']
counters_col    = _db['counters']


# ── Auto-increment helper ─────────────────────────────────────────────────────
def get_next_id(collection_name: str) -> int:
    """
    Return the next sequential integer ID for `collection_name`.
    Uses a MongoDB `counters` document with atomic $inc so IDs are
    thread-safe even under concurrent requests.
    """
    from pymongo import ReturnDocument
    result = counters_col.find_one_and_update(
        {'_id': collection_name},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return result['seq']


# ── Serialisation helper ──────────────────────────────────────────────────────
def to_dict(doc) -> dict:
    """
    Convert a PyMongo document to a plain JSON-serialisable dict.
    Removes the MongoDB internal `_id` field.
    """
    if doc is None:
        return {}
    d = dict(doc)
    d.pop('_id', None)
    return d
