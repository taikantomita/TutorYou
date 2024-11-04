import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from app import app, get_db, Base  # Import directly from app

# Set up a test database URL for testing
DATABASE_URL = "sqlite:///./test_users.db"

# Create a new engine and session for the test database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine)

# Override the get_db dependency to use the test database


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply the override for the database dependency
app.dependency_overrides[get_db] = override_get_db

# Create a TestClient to interact with the FastAPI app
client = TestClient(app)

# Initialize the database schema for testing


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)  # Create tables
    yield
    Base.metadata.drop_all(bind=engine)  # Drop tables after tests

# 1. Test Successful User Registration


def test_register_user():
    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "password": "testpassword"})
    assert response.status_code == 201
    assert response.json() == {"message": "User created successfully"}

# 2. Test Duplicate Username Registration


def test_register_duplicate_user():
    # First registration
    client.post(
        "/register",
        json={
            "username": "duplicateuser",
            "password": "password1"})

    # Attempt to register with the same username
    response = client.post(
        "/register",
        json={
            "username": "duplicateuser",
            "password": "password2"})
    assert response.status_code == 409
    assert response.json() == {"detail": "Username already taken"}

# 3. Test Registration with Blank Fields


@pytest.mark.parametrize("username, password", [
    ("", "password"),
    ("username", ""),
    ("", ""),
])
def test_register_blank_fields(username, password):
    response = client.post(
        "/register",
        json={
            "username": username,
            "password": password})
    # FastAPI automatically handles validation errors for blank fields
    assert response.status_code == 422

# 4. Test Successful Login


def test_login_user():
    # First register the user
    client.post(
        "/register",
        json={
            "username": "loginuser",
            "password": "loginpassword"})

    # Attempt to log in with correct credentials
    response = client.post(
        "/login",
        json={
            "username": "loginuser",
            "password": "loginpassword"})
    assert response.status_code == 200
    assert response.json() == {
        "message": "Login successful",
        "user": {"id": response.json()["user"]["id"], "username": "loginuser"}
    }

# 5. Test Login with Invalid Password


def test_login_invalid_password():
    response = client.post(
        "/login",
        json={
            "username": "loginuser",
            "password": "wrongpassword"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid credentials"}

# 6. Test Login with Non-Existent Username


def test_login_nonexistent_user():
    response = client.post(
        "/login",
        json={
            "username": "nonexistent",
            "password": "somepassword"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid credentials"}

# 7. Test Login with Blank Fields


@pytest.mark.parametrize("username, password", [
    ("", "password"),
    ("username", ""),
    ("", ""),
])
def test_login_blank_fields(username, password):
    response = client.post(
        "/login",
        json={
            "username": username,
            "password": password})
    # FastAPI automatically handles validation errors for blank fields
    assert response.status_code == 422
