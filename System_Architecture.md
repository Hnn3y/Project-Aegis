┌────────────────────────┐
                          │  CesiumJS 3D Globe     │
                          │ (Orbit & Debris View)  │
                          └───────────▲────────────┘
                                      │
┌────────────────────────┐  ┌─────────┴────────────┐  ┌────────────────────────┐
│  Telemetry Simulator / │─►│ React + TypeScript   │─►│ Node.js / Express API  │
│  Live Ingestion Stream │  │ (Zustand State Engine)│  │ (REST / WebSocket)     │
└────────────────────────┘  └──────────────────────┘  └───────────┬────────────┘
                                                                  │
                                            ┌─────────────────────┴─────────────────────┐
                                            ▼                                           ▼
                             ┌────────────────────────────┐              ┌────────────────────────────┐
                             │ PostgreSQL + Prisma ORM    │              │ Gemini AI Intelligence     │
                             │ (Digital Twin & Analytics) │              │ (Engine & Report Generator)│
                             └────────────────────────────┘              └────────────────────────────┘


src
│
├── app
│
├── routes
│
├── layouts
│
│   ├── DashboardLayout
│   ├── AuthLayout
│   └── LandingLayout
│
├── pages
│
│   ├── Landing
│   ├── Dashboard
│   ├── MissionControl
│   ├── DigitalTwin
│   ├── AI
│   ├── Planner
│   ├── Debris
│   ├── Reports
│   ├── Maintenance
│   ├── Settings
│   └── NotFound
│
├── components
│
│   ├── earth
│   ├── charts
│   ├── cards
│   ├── sidebar
│   ├── navbar
│   ├── satellite
│   ├── timeline
│   ├── ai
│   ├── forms
│   ├── reports
│   ├── notifications
│   └── common
│
├── features
│
│   ├── mission
│   ├── digitalTwin
│   ├── planner
│   ├── ai
│   ├── debris
│   ├── maintenance
│   ├── reports
│   └── auth
│
├── services
│
├── api
│
├── hooks
│
├── store
│
├── types
│
├── utils
│
├── constants
│
├── assets
│
└── styles