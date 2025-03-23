from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base, get_db
from app.db.models import User
from VoiceAgent.main import app

# in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create test client
client = TestClient(app)

@pytest.fixture(scope="function")
def test_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a test user
    db = TestingSessionLocal()
    test_user = User(
        name="Test User", 
        phone_number="+1 (555) 123-4567",
        dob="1980-01-01",
        insurance_type="Medicare"
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    db.close()
    
    yield
    
    # Drop tables
    Base.metadata.drop_all(bind=engine)

def test_get_name_found(test_db):
    response = client.post(
        "/api/users/get-name",
        json={"args": {"phoneNumber": "+1 (555) 123-4567"}}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["customer_name"] == "Test User"
    assert data["flag"] == "true"

def test_get_name_not_found(test_db):
    response = client.post(
        "/api/users/get-name",
        json={"args": {"phoneNumber": "+1 (555) 999-9999"}}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["customer_name"] == "Dead Man"
    assert data["flag"] == "false"

def test_set_details(test_db):
    response = client.post(
        "/api/users/set-details",
        json={
            "args": {
                "name": "John Doe", 
                "phoneNumber": "+1 (555) 222-3333",
                "dob": "1990-05-15",
                "insuranceType": "Blue Cross"
            }
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["flag"] == "true"
    
    # Verify user was created
    get_response = client.post(
        "/api/users/get-name",
        json={"args": {"phoneNumber": "+1 (555) 222-3333"}}
    )
    get_data = get_response.json()
    assert get_data["customer_name"] == "John Doe"
    assert get_data["flag"] == "true"

def test_create_user(test_db):
    response = client.post(
        "/api/users/",
        json={
            "name": "New User", 
            "phone_number": "+1 (555) 444-5555",
            "dob": "1985-03-22",
            "insurance_type": "Aetna"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New User"
    assert data["phone_number"] == "+1 (555) 444-5555"
    assert data["dob"] == "1985-03-22"
    assert data["insurance_type"] == "Aetna"

def test_get_user_by_id(test_db):
    response = client.get("/api/users/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["phone_number"] == "+1 (555) 123-4567"

def test_get_user_by_phone(test_db):
    response = client.get("/api/users/phone/%2B1%20%28555%29%20123-4567")  # URL-encoded phone number
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["phone_number"] == "+1 (555) 123-4567"

def test_update_user(test_db):
    response = client.patch(
        "/api/users/1",
        json={"name": "Updated User", "insurance_type": "Cigna"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated User"
    assert data["insurance_type"] == "Cigna"
    assert data["phone_number"] == "+1 (555) 123-4567"  # Unchanged