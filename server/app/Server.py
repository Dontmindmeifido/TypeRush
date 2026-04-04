import sqlite3
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

conn = sqlite3.connect("../typerush_raw.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        right_words INTEGER,
        wrong_words INTEGER,
        total_time INTEGER,
        username VARCHAR
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR,
        password VARCHAR
    )
""")

conn.commit()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/scores/statistics")
def save_score(payload: dict):
    local_cursor = conn.cursor()

    local_cursor.execute(f"""
        SELECT * FROM scores WHERE username = ?
    """, (payload["username"],))
    
    return {"status": "Success", "message": local_cursor.fetchall()}

@app.post("/api/scores")
def save_score(payload: dict):
    cursor.execute("""
        INSERT INTO scores(right_words, wrong_words, total_time, username)
        VALUES (?, ?, ?, ?)
    """, (payload["right_words"], payload["wrong_words"], payload["total_time"], payload["username"]))
    conn.commit()
    
    return {"status": "Success", "message": "Saved Scores to DB!"}

@app.post("/api/users/login")
def save_score(payload: dict):
    username = payload["username"]
    target = payload["password"]

    cursor.execute("""
        SELECT * FROM users
    """)
    
    for elem in cursor.fetchall():
        if elem[1] == username:
            if elem[2] == target:
                return {"status": "Success", "message": "logged in"}
    
    return {"status": "Failure", "message": "failure"}

@app.post("/api/users/register")
def save_score(payload: dict):
    cursor.execute("""
        INSERT INTO users(username, password)
        VALUES (?, ?)
    """, (payload["username"], payload["password"]))
    conn.commit()
    
    return {"status": "Success", "message": "Saved user to DB!"}


if __name__ == "__main__":
    uvicorn.run("Server:app", host="127.0.0.1", port=8000, reload=True)