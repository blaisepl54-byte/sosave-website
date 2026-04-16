# SoSave Website

SoSave is a WhatsApp-powered savings platform that helps users across Africa build wealth automatically.

## Project Structure

```
sosave-website/
├── frontend/          # Static site (hosted on Netlify)
│   ├── index.html
│   ├── css/styles.css
│   └── js/main.js
├── backend/           # API server (hosted on Railway)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── netlify.toml       # Netlify config + API proxy to Railway
└── README.md
```

## Frontend

Static HTML/CSS/JS site deployed on Netlify. No build step required.

- **Publish directory:** `frontend/`
- **API proxy:** `/api/*` requests are proxied to the Railway backend via `netlify.toml`

## Backend

Express.js API with MongoDB (Mongoose), deployed on Railway.

### Setup

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB connection string in .env
npm install
npm run dev
```

### API Endpoints

| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| GET    | `/api/health`        | Health check                 |
| POST   | `/api/waitlist`      | Join the waitlist            |
| GET    | `/api/waitlist/count`| Get waitlist signup counts   |

### Waitlist POST Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+234...",
  "country": "NG",
  "type": "saver"
}
```

## Deployment

- **Frontend:** Netlify — auto-deploys from `main` branch
- **Backend:** Railway — deploys from `backend/` directory
- **Database:** MongoDB Atlas

## Contact

blaisepl54@gmail.com
