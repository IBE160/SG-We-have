import requests
import sys

def check_backend():
    url = "http://localhost:8000/"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print(f"✅ Backend is reachable at {url}")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to {url}. Is the backend running?")
        return False

if __name__ == "__main__":
    check_backend()
