# 🚀 Chatify — Real-time Chat App

A minimal full-stack real-time chat application built with Node, Express, Socket.io, and a React + Vite frontend styled with Tailwind CSS + daisyUI.

---

**Live demo:** https://chatify-realtime-kq98.onrender.com/

## 🧭 Project overview

- **Backend:** Node.js, Express, Socket.io, MongoDB (via axios endpoints in frontend)
- **Frontend:** React (Vite), Tailwind CSS, daisyUI, Zustand for state
- **Purpose:** Real-time private messaging with a mobile-first responsive UI

---

## 🛠️ Features

- Real-time messaging via Socket.io 🔁
- User authentication (JWT) 🔐
- Image attachments for messages 📎
- Responsive UI: mobile drawer sidebar, smaller avatars & images on phones, responsive containers ✅
- Light/dark themes via daisyUI 🌗

---

## 🧩 Repo structure (top-level)

- `backend/` – Express API, controllers, models, seeds
- `frontend/` – React app (Vite), components, pages, Tailwind config
- `PRODUCTION_CHECKLIST.md`, `render.yaml` – deployment helpers

---

## 🚀 Quick start (local)

Prerequisites: Node 18+, npm, MongoDB (or connection string)

1. Clone

```bash
git clone https://github.com/<your-org>/chatify-realtime.git
cd chat_app
```

2. Backend setup

```bash
cd backend
cp .env.example .env       # fill values below
npm install
npm run seed               # optional: seed data
npm run dev                # default port: 5000
```

3. Frontend setup

```bash
cd frontend
npm install
npm run dev                # Vite dev server (default 5173; if occupied it will pick another port)
```

Access the app at the port Vite prints (e.g. http://localhost:5173 or http://localhost:5174).

---

## ⚙️ Environment variables

Create `.env` files for backend with at least the following keys:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecret
CLOUDINARY_URL=cloudinary://...
```

(The frontend uses `vite` and does not require server env values for dev beyond API endpoints.)

---

## 📦 Important scripts

Frontend (from `frontend/`):

- `npm run dev` — start Vite dev server
- `npm run build` — build static assets
- `npm run preview` — preview build
- `npm run lint` — lint code

Backend (from `backend/`):

- `npm run dev` — start server with nodemon
- `npm run seed` — run seed scripts

---

## ♿ Accessibility & responsive work (recent changes)

Key responsive improvements made:

- Mobile sidebar drawer with a toggle in the top navbar (small screens) 🔀
- Avatars and logos use responsive `w-`/`h-` Tailwind classes so they're **smaller on mobile** and scale up on `sm/lg` breakpoints 🖼️📱
- Message images are responsive (`object-cover`, `max-w-full`, and breakpoint-limited widths) 🖼️
- Global container padding added in `tailwind.config.js` to improve spacing on larger screens 📐

Planned next steps: refine `xl/2xl` spacing and typography for very large screens.

---

## 🧪 Testing & QA tips

- Use browser devtools to test small (mobile) and very large screen sizes.
- If Vite reports "Port X is in use", either use the auto-picked port or free the port (kill the process).
- ESLint used for sanity checks: run `npm run lint` in `frontend`

---

## 🧾 Troubleshooting

- "Port XXXX is in use": Vite will try the next port; check terminal for the URL printed.
- Socket connection issues: ensure backend URL is configured correctly and CORS allowed.
- Assets not loading after build: verify `base` and static path settings for your hosting provider.

---

## 📣 Contributing

- Fork, create a branch, implement changes, open a PR describing the change.
- Keep UI changes responsive and add screenshots for visual changes in PRs.

---

## ❤️ Thanks

Thanks for using Chatify — enjoy building! If you'd like, I can add a short deployment guide (Render / Vercel / Netlify) and a changelog. ✨

---

## 📝 License

This project is licensed under the MIT License.
