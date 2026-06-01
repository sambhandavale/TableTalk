import asyncio
from app.database import db

async def wipe():
    await db.connect()
    # Delete all documents in insights
    if db.db is not None:
        result = await db.db["insights"].delete_many({})
        print(f"Deleted {result.deleted_count} cached insights.")

if __name__ == "__main__":
    asyncio.run(wipe())
