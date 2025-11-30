from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
# Load environment variables from .env file in the backend directory
dotenv_path = BASE_DIR / 'backend/.env'
load_dotenv(dotenv_path=dotenv_path)

# Now other modules can import this file to ensure dotenv is loaded.
