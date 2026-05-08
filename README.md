# 🛸 ISS & News AI Dashboard

A production-ready React + Vite dashboard featuring **live ISS tracking**, a **news dashboard**, interactive **charts**, and an **AI chatbot** powered by Mistral-7B — all in a stunning dark/light mode UI.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🛸 ISS Live Tracker | Real-time ISS position via map, updated every 15 seconds |
| 🗺️ Leaflet Map | Interactive map with trajectory polyline & custom ISS marker |
| 📰 News Dashboard | Filterable, searchable news grid with 15-min localStorage cache |
| 🤖 AI Chatbot | Floating Mistral-7B chatbot limited to dashboard data only |
| 📊 Charts | Speed area chart + news doughnut chart (Recharts) |
| 🌙 Dark / Light Mode | Persisted in localStorage |
| 📱 Fully Responsive | Mobile · Tablet · Desktop |

---

## 🛠️ Setup Instructions

### 1. Clone / navigate to the project

```bash
cd foai_app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
VITE_NEWS_API_KEY=your_newsapi_org_key
VITE_AI_TOKEN=your_huggingface_token
```

- **NewsAPI key** → https://newsapi.org/register  
- **HuggingFace token** → https://huggingface.co/settings/tokens

> **Note:** The app works without keys — it uses demo space news and simulates AI responses based on live dashboard data.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## ☁️ Vercel Deployment

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B — Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set **Framework Preset** to `Vite`
5. Add environment variables in **Settings → Environment Variables**:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
6. Click **Deploy**

---

## 📁 Project Structure

```
foai_app/
├── public/
│   └── iss-icon.svg
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── ChatBot.jsx          # Floating AI chatbot
│   │   ├── charts/
│   │   │   ├── SpeedChart.jsx       # ISS speed area chart
│   │   │   └── NewsDistributionChart.jsx
│   │   ├── common/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ErrorCard.jsx
│   │   │   └── Spinner.jsx
│   │   ├── iss/
│   │   │   ├── ISSMap.jsx           # Leaflet map
│   │   │   ├── ISSStats.jsx         # Stat tiles
│   │   │   └── AstronautPanel.jsx
│   │   ├── layout/
│   │   │   └── Layout.jsx
│   │   └── news/
│   │       ├── NewsCard.jsx
│   │       └── NewsFilters.jsx
│   ├── context/
│   │   ├── ThemeContext.jsx
│   │   ├── ISSContext.jsx           # Haversine speed, 15s polling
│   │   ├── NewsContext.jsx          # 15-min localStorage cache
│   │   └── ChatContext.jsx          # Mistral-7B integration
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── useMediaQuery.js
│   ├── pages/
│   │   ├── ISSPage.jsx
│   │   ├── NewsPage.jsx
│   │   └── ChartsPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🔑 API Reference

| API | Endpoint | Purpose |
|---|---|---|
| Where The ISS At | `https://api.wheretheiss.at/v1/satellites/25544` | ISS position & velocity |
| Open Notify (via proxy) | `https://api.open-notify.org/astros.json` | People in space |
| NewsAPI | `https://newsapi.org/v2/everything` | News articles |
| HuggingFace Inference | `mistralai/Mistral-7B-Instruct-v0.2` | AI chatbot |

---

## 📜 License

MIT
