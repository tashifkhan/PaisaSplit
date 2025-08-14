# PaisaSplit

**The Smart Way to Split Expenses**

A modern, full-stack expense tracking and bill splitting application built with React Native, Expo, and FastAPI.

[![Live Demo](https://img.shields.io/badge/Live_Demo-paisa--split.tashif.codes-blue?style=for-the-badge)](https://paisa-split.tashif.codes)
[![Download App](https://img.shields.io/badge/Download-tashif.codes/download/PaisaSplit-green?style=for-the-badge)](https://tashif.codes/download/PaisaSplit)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)](https://paisa-split.tashif.codes)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

## Features

### **Smart Expense Management**

- **Real-time expense tracking** with multiple currency support
- **OCR receipt scanning** for automatic expense entry
- **Group expense splitting** with automatic balance calculation
- **Detailed spending reports** with visual analytics

### **Group Collaboration**

- Create and manage expense groups
- Add/remove group members seamlessly
- Real-time balance updates across all participants
- Group activity feed and notifications

### **Analytics & Insights**

- Monthly and yearly spending reports
- Category-wise expense breakdown
- Visual charts and trends
- Export capabilities for accounting

### **Security & Privacy**

- Secure user authentication
- Data encryption and privacy protection
- Offline-first architecture with sync
- GDPR compliant data handling

### **Multi-Platform Support**

- **Native Mobile Apps** (iOS & Android)
- **Progressive Web App (PWA)** for all devices
- **Cross-platform synchronization**
- **Offline functionality**

## Quick Start

### Try It Now

**Web/PWA:** [paisa-split.tashif.codes](https://paisa-split.tashif.codes)

**Download Apps:** [tashif.codes/download/PaisaSplit](https://tashif.codes/download/PaisaSplit)

### Local Development

#### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- MongoDB (local or cloud)
- Expo CLI

#### 1. Clone the Repository

```bash
git clone https://github.com/tashifkhan/PaisaSplit.git
cd PaisaSplit
```

#### 2. Setup Frontend (React Native/Expo)

```bash
cd app
npm install

# Start development server
npm run dev

# For web development
npm run build:web
```

#### 3. Setup Backend (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start the server
python run.py
```

#### 4. Environment Configuration

Create `.env` file in the backend directory:

```env
MONGODB_URL=mongodb://localhost:27017/paisasplit
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_HOSTS=["http://localhost:3000", "http://localhost:8081"]
```

## Architecture

### Frontend (React Native + Expo)

```
app/
├── (auth)/              # Authentication screens
├── (tabs)/              # Main app navigation
│   ├── (balance-page)/  # Balance management
│   ├── (groups-page)/   # Group management
│   ├── (activity-page)/ # Activity feed
│   └── (profile-page)/  # User profile & settings
├── components/          # Reusable UI components
├── constants/           # App constants & configuration
├── data/               # JSON data for demo/development
├── services/           # API services & data layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Backend (FastAPI + MongoDB)

```
backend/
├── app/
│   ├── core/           # Core configuration & database
│   ├── models/         # Pydantic models & schemas
│   ├── routers/        # API route handlers
│   ├── services/       # Business logic layer
│   └── main.py         # FastAPI application
├── requirements.txt    # Python dependencies
└── run.py             # Application runner
```

## Tech Stack

### Frontend

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router
- **State Management:** React Context + JSON data services
- **UI Components:** Custom components with React Native
- **Charts:** React Native Chart Kit
- **Camera/OCR:** Expo Camera + Tesseract.js

### Backend

- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT with python-jose
- **API Documentation:** Auto-generated with Swagger/OpenAPI
- **Validation:** Pydantic v2

### Infrastructure

- **Database:** MongoDB Atlas/Local
- **Web Hosting:** Vercel/Netlify (PWA)
- **API Hosting:** Railway/Heroku
- **Mobile Distribution:** App Store & Google Play

## API Documentation

Once the backend is running, visit:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

- `GET /api/v1/balances` - Get user balances
- `POST /api/v1/transactions` - Create new transaction
- `GET /api/v1/groups` - Get user groups
- `GET /api/v1/activities` - Get activity feed

## Testing

### Frontend Testing

```bash
cd app
npm test
```

### Backend Testing

```bash
cd backend
pytest
```

## Deployment

### Frontend (PWA)

```bash
cd app
npm run build:web
# Deploy to Vercel, Netlify, or similar
```

### Backend (API)

```bash
cd backend
# Deploy to Railway, Heroku, or similar
# Ensure MongoDB connection is configured
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Tashif Ahmad Khan**

- Website: [tashif.codes](https://tashif.codes)
- GitHub: [@tashifkhan](https://github.com/tashifkhan)
- LinkedIn: [Tashif Ahmad Khan](https://www.linkedin.com/in/tashif-ahmad-khan-982304244/)

## Support

- **Issues:** [GitHub Issues](https://github.com/tashifkhan/PaisaSplit/issues)
- **Email:** support@tashif.codes
