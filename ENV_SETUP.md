# Environment Variables Setup

## Create .env.local file

Create a `.env.local` file in the `frontend` directory with the following content:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `NEXT_PUBLIC_API_URL` to match your backend server URL
   - Default backend runs on `http://localhost:3000`
   - For production, update to your production API URL

3. The `.env.local` file is already in `.gitignore` and won't be committed to version control

## Available Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)

## Notes

- All environment variables that need to be accessible in the browser must be prefixed with `NEXT_PUBLIC_`
- Environment variables are loaded at build time for Next.js
- Restart the dev server after changing environment variables
