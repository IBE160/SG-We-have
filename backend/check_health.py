import requests
import sys

try:
    print("Testing connection to http://127.0.0.1:8000/ ...")
    r = requests.get("http://127.0.0.1:8000/")
    print(f"Root Status: {r.status_code}")
    print(f"Root Content: {r.json()}")
except Exception as e:
    print(f"Root Connection Failed: {e}")
    sys.exit(1)

try:
    print("\nTesting connection to http://127.0.0.1:8000/docs ...")
    r = requests.get("http://127.0.0.1:8000/docs")
    print(f"Docs Status: {r.status_code}")
    print("Docs reachable.")
except Exception as e:
    print(f"Docs Connection Failed: {e}")