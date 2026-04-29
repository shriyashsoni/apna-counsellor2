# Apna Counsellor 2026 Platform 🚀

The most comprehensive, AI-powered global admissions and counseling ecosystem.

## 🌟 Key Features
- **Global College Directory**: Over **100,000+ colleges** and universities indexed from AISHE, Indian Engineering databases, and International portals.
- **Agentic AI Counseling**: A multi-agent RAG system (Puter.js + Convex) that provides personalized guidance based on real-time data.
- **Mentorship Hub**: Connect with verified mentors for 1-on-1 sessions and live expert webinars.
- **Real-time Counseling Tracking**: Live timelines for JoSAA, NEET, MCC, and global systems like UCAS and Common App.
- **Premium UI/UX**: High-end "ØG.AI" inspired design with dark/light mode transitions and 3D assets.

## 🛠️ Technology Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons.
- **Backend**: Convex (Database & Cloud Functions).
- **AI Engine**: Puter.js (Cloud-based LLM & Reasoning).
- **Automation**: Python (Playwright, BeautifulSoup, Pandas) for data profiling and import.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js & npm
- Python 3.10+
- Convex Account

### 2. Installation
```bash
npm install
pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_CONVEX_URL=https://brazen-caterpillar-18.convex.cloud
CONVEX_DEPLOY_KEY=your_deploy_key
```

### 4. Running the Platform
```bash
# Start Convex Backend
npx convex dev

# Start Frontend
npm run dev
```

## 📂 Project Structure
- `src/agents/`: AI logic and AgentFactory.
- `src/pages/`: All primary platform modules (Colleges, Mentors, AI Hub).
- `convex/`: Schema, mutations, and seeding scripts.
- `backend_py/`: Data scrapers and bulk import automation.
- `datasets/`: 70k+ JSON/CSV raw data sources.

## 🐼 Mascot
Meet our **Apna Astronaut**, the 3D guardian of your educational journey!

---
© 2026 APNA COUNSELLOR. All rights reserved.
