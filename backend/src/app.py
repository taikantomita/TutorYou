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
    role = Column(String)  # Add role column
    security_question = Column(String)  # Add security question
    security_answer_hash = Column(String)  # Store hashed security answer


# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request validation


class UserCreate(BaseModel):
    username: constr(min_length=1)  # Enforce non-empty username
    password: constr(min_length=1)  # Enforce non-empty password
    role: constr(min_length=1)  # Enforce non-empty role
    security_question: constr(min_length=1)  # Add security question
    security_answer: constr(min_length=1)  # Add security answer


class UserLogin(BaseModel):
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
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken"
        )

    # Validate role
    if user.role not in ["Tutor", "Learner"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Role must be 'Tutor' or 'Learner'."
        )

    # Create the new user with a hashed password
    password_hash = bcrypt.hashpw(
        user.password.encode('utf-8'), bcrypt.gensalt())
    answer_hash = bcrypt.hashpw(
        user.security_answer.encode('utf-8'), bcrypt.gensalt())
    db_user = User(
        username=user.username,
        password_hash=password_hash.decode('utf-8'),
        role=user.role,
        security_question=user.security_question,
        security_answer_hash=answer_hash.decode('utf-8'),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}


class ResetPassword(BaseModel):
    username: constr(min_length=1)
    security_answer: constr(min_length=1)
    new_password: constr(min_length=1)


@app.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == request.username).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Verify the security answer
    if not bcrypt.checkpw(request.security_answer.encode('utf-8'),
                          db_user.security_answer_hash.encode('utf-8')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid security answer"
        )

    # Hash and update the new password
    new_password_hash = bcrypt.hashpw(request.new_password.encode('utf-8'),
                                      bcrypt.gensalt())
    db_user.password_hash = new_password_hash.decode('utf-8')
    db.commit()
    return {"message": "Password reset successfully"}


# Login route
@app.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not bcrypt.checkpw(user.password.encode(
            'utf-8'), db_user.password_hash.encode('utf-8')):
        # Use a generic error message to avoid giving clues to attackers
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "role": db_user.role,
        }
    }
