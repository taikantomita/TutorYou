# TutorYou

Team: CEN3031 Project Group 7

Team Members: Reggie Segovia, Taikan Tomita, Tyler Shook, Yash Patel

## Local Dev Env Setup

1. Clone repo

```
git clone https://github.com/taikantomita/TutorYou.git
```

2. Navigate to the Project Directory

```
cd TutorYou
```

#### Setup Backend On MacOS

```{bash}
# Navigate to the Backend Directory
cd backend

# Create and Activate a Virtual Environment
python3 -m venv venv
source venv/bin/activate

# Install Backend Dependencies
pip install -r requirements.txt

# Start the Backend Server
./venv/bin/python -m uvicorn src.app:app --reload
```

#### Setup Backend On Windows

```{bash}
# Navigate to the Backend Directory
cd backend

# Create and Activate a Virtual Environment
python -m venv venv
.\venv\Scripts\activate

# Install Backend Dependencies
pip install -r requirements.txt

# Start the Backend Server
.\venv\Scripts\python -m uvicorn src.app:app --reload
```

#### Setup Frontend

```{bash}
# Navigate to the Frontend Directory
cd ../frontend/tutoryou

# Install Frontend Dependencies
npm install

# Start the Frontend Server
npm run build && npm start
```

#### Access the Application

Frontend: Open http://localhost:3000 in your browser

Backend API Documentation: Access the interactive API docs at http://localhost:8000/docs

#### Linting

```{bash}
cd backend
autopep8 src --in-place --recursive --aggressive
autopep8 tests --in-place --recursive --aggressive
```

```{bash}
cd frontend/tutoryou
npm run prettier-write
npm run prettier-check
```

#### Running Tests

```{bash}
cd backend
pytest
```

```{bash}
cd frontend/tutoryou
npm run test
```

## Dev Notes

#### Protected Pages

Protected pages are only accessible to authenticated users. Specify paths to protected pages in https://github.com/taikantomita/TutorYou/blob/d70d4ff4606af25e3b9c304ed26b7138caddcb6a/frontend/tutoryou/src/middleware.ts#L25
