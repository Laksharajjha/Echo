# ECHO

> *"Create a world. Give it people. See what happens."*

ECHO is a persistent simulated world engine where autonomous synthetic people live, make decisions, form relationships, pursue goals, and create emergent narratives — without scripted outcomes.

## Architecture

- **Backend**: Python 3 + FastAPI + SQLAlchemy (SQLite)
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **AI**: Anthropic Claude (structured output via tool_use)
- **Real-time**: WebSockets

## Quick Start

### Backend
```bash
cd server
pip install -r requirements.txt
python -m app.main
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Project Structure

```
echo/
├── server/          # Python backend (FastAPI)
│   ├── app/
│   │   ├── api/         # HTTP + WebSocket endpoints
│   │   ├── models/      # SQLAlchemy ORM models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── engine/      # Layer A: Deterministic simulation
│   │   ├── cognition/   # Layer B: LLM-powered cognition
│   │   ├── social/      # Relationship & social systems
│   │   ├── providers/   # LLM provider abstraction
│   │   └── db/          # Database utilities
│   └── tests/
│
├── client/          # React frontend
│   └── src/
│       ├── api/         # API client & WebSocket
│       ├── stores/      # Zustand state management
│       ├── components/  # UI components
│       ├── pages/       # Page components
│       └── hooks/       # Custom React hooks
│
└── docs/            # Documentation
```
