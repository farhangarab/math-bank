# math-bank

Math Bank is a Flask + MySQL API with a Vite/React frontend.

## Local development

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Set local values in both `.env` files.
4. Start the app from the repo root:

```bash
npm run dev
```

## Free deployment path

Recommended free/low-cost stack:

- Frontend: Vercel Hobby
- Backend: Render free Web Service
- Database: Aiven free MySQL

### Backend on Render

Use these settings:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn run:app`

Set these environment variables in Render:

```bash
FLASK_DEBUG=False
SECRET_KEY=<long-random-secret>
DATABASE_URL=<mysql-sqlalchemy-url>
TEACHER_ACCESS_CODE=<private-teacher-code>
FRONTEND_URL=https://<your-vercel-app>.vercel.app
FRONTEND_ORIGINS=https://<your-vercel-app>.vercel.app
SESSION_COOKIE_SAMESITE=None
SESSION_COOKIE_SECURE=True
REMEMBER_COOKIE_SAMESITE=None
REMEMBER_COOKIE_SECURE=True
```

After the first backend deploy, run this once from Render's shell:

```bash
flask --app run init-db
```

### Frontend on Vercel

Use these settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```bash
VITE_API_BASE_URL=https://<your-render-backend>.onrender.com/api
```

Redeploy the frontend after the backend URL is known.
