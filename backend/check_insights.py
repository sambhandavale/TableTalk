import asyncio
from app.database import db

async def check():
    await db.connect()
    insights = await db.get_collection("insights")
    for i in insights:
        print(i.get("generated_date"), len(i.get("action_items", [])))
        for a in i.get("action_items", []):
            print("  -", a.get("title"))

if __name__ == "__main__":
    asyncio.run(check())
