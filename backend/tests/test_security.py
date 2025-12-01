import os
from fastapi.testclient import TestClient
from app.main import app
from jose import jwt
import pytest

client = TestClient(app)

def test_protected_route_no_token():
    response = client.get("/api/protected")
    # HTTPBearer raises 403 when credentials are missing and auto_error=True
    # But depending on version it might be 401
    assert response.status_code in [401, 403]

def test_protected_route_invalid_token(monkeypatch):
    # Ensure secret is present so it attempts decode
    monkeypatch.setenv("SUPABASE_JWT_SECRET", "testsecret")
    response = client.get("/api/protected", headers={"Authorization": "Bearer invalidtoken"})
    assert response.status_code == 401

def test_protected_route_valid_token(monkeypatch):
    secret = "testsecret"
    monkeypatch.setenv("SUPABASE_JWT_SECRET", secret)
    
    # Create a valid token
    payload = {"sub": "123", "aud": "authenticated", "email": "test@example.com"}
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    response = client.get("/api/protected", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "You are authenticated"
    assert data["user"]["email"] == "test@example.com"
