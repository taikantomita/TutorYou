from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, constr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from fastapi.middleware.cors import CORSMiddleware
import bcrypt

app = FastAPI()
DATABASE_URL = "sqlite:///./users.db"

# Set up the database
engine = create_engine(DATABASE_URL, connect_args={
                       "check_same_thread": False})  # SQLite specific
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)


# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request validation


class UserCreate(BaseModel):
    username: constr(min_length=1)  # Enforce non-empty username
    password: constr(min_length=1)  # Enforce non-empty password

# Dependency to get the database session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CORS configuration for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register route


@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if the username already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="Username already taken")

    # Create the new user with a hashed password
    password_hash = bcrypt.hashpw(
        user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = User(username=user.username,
                   password_hash=password_hash.decode('utf-8'))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}

# Login route


@app.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not bcrypt.checkpw(user.password.encode(
            'utf-8'), db_user.password_hash.encode('utf-8')):
        # Use a generic error message to avoid giving clues to attackers
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials")

    return {"message": "Login successful", "user": {
        "id": db_user.id, "username": db_user.username}}
