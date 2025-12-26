# PayNova - Modern Fintech Platform

A futuristic fintech dashboard featuring real-time market data, currency exchange, secure transfers, and AI-powered assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis
- Git

### Installation

1. **Set up Database**
```bash
cd database
./setup.sh
```

2. **Set up Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Set up Frontend**
```bash
cd frontend  # or root if files are in root
npm install
npm run dev
```

## 📁 Project Structure

```
Paynova/
├── backend/           # Node.js API
├── frontend/          # React app
├── database/          # SQL schemas
└── docs/              # Documentation
```

## 📚 Documentation

See [docs/](./docs/) for detailed documentation.

## 👨‍💻 Author

**maestrog-code**
- GitHub: [@maestrog-code](https://github.com/maestrog-code)

## 📄 License

MIT License
