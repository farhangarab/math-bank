# MathBank

MathBank is a web-based math assignment platform for teachers and students.

Teachers can create classes, make assignments, add math questions, and view
student submissions. Students can join a class, complete assignments, save
progress, submit answers, and see their results.

## Features

- Student and teacher registration/login
- Role-based pages for teachers and students
- Class creation with class codes
- Student class joining
- Assignment creation
- Math question editor
- Math preview with KaTeX
- Automatic grading with SymPy
- Student submission and score review
- Teacher submission review

## Tech Stack

### Front End

- React
- TypeScript
- Vite
- Tailwind CSS
- KaTeX / react-katex

### Back End

- Python
- Flask
- Flask-Login
- Flask-Bcrypt
- Flask-SQLAlchemy
- MySQL
- SymPy

## Project Structure

```text
math-bank/
  backend/      Flask API and database models
  frontend/     React user interface
  package.json  Root scripts for running the app
```

## Setup

### 1. Install root dependencies

```bash
npm install
```

### 2. Install front-end dependencies

```bash
cd frontend
npm install
```

### 3. Install back-end dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Create the database

Create a MySQL database named:

```text
mathbank
```

The default database connection is:

```text
mysql+pymysql://root:password@localhost:3306/mathbank
```

You can change this by creating a `.env` file inside the `backend` folder.

Example:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/mathbank
SECRET_KEY=your-secret-key
TEACHER_ACCESS_CODE=ABC123
FRONTEND_URL=http://localhost:5173
FLASK_DEBUG=True
```

## Run the Project

From the project root, run:

```bash
npm run dev
```

This starts both the front end and the back end.

Default local URLs:

```text
Front end: http://localhost:5173
Back end:  http://localhost:5000
```

## Teacher Access Code

The default teacher access code is:

```text
ABC123
```

This can be changed in the back-end `.env` file.

## Notes

- Make sure MySQL is running before starting the back end.
- Make sure the Python virtual environment is created inside the `backend`
  folder.
- If the database username or password is different, update `DATABASE_URL`.

## Author

Farhang Arab Zada

COMP 296 Capstone Project
