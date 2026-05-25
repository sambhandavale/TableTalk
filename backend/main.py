import uvicorn
import os
import sys

# Ensure the backend directory is in the path for absolute imports
BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
if BACKEND_ROOT not in sys.path:
    sys.path.append(BACKEND_ROOT)

# Ensure workspace root is in path so 'ai_workflow' package can load
WORKSPACE_ROOT = os.path.dirname(BACKEND_ROOT)
if WORKSPACE_ROOT not in sys.path:
    sys.path.append(WORKSPACE_ROOT)

def main():
    print("Starting TableTalk Backend Development Server...")
    # Run the Uvicorn FastAPI server on port 8000 with auto-reload
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
