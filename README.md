# 🧠 Real-Time AI-Powered Customer Support Dashboard

A full-stack internal tool designed to assist support teams in SaaS companies by providing real-time insights, sentiment analysis, AI-generated replies, and collaborative tools for resolving customer tickets and chats efficiently.

---

## 🔍 Features

- Live chat/ticket sentiment analysis with trend detection
- GPT/LLaMA-powered summarization and reply generation
- Realtime agent collaboration (comment tagging, annotations)
- Role-based access control with audit logging
- Scalable microservice architecture using Kafka and Redis
- Containerized deployment on AWS using Terraform and Kubernetes

---

## 🧱 Tech Stack

**Frontend**: React, TypeScript, Chakra UI  
**Backend**: Node.js, Express or NestJS  
**Realtime**: Socket.io (WebSockets)  
**AI Layer**: OpenAI / LLaMA, Python (FastAPI/Flask)  
**Data Pipeline**: Kafka or Redis Streams  
**Database**: PostgreSQL (metadata), Redis (cache)  
**Infrastructure**: Docker, Kubernetes, AWS (EKS + Lambda), Terraform  
**CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-customer-support-dashboard.git
cd ai-customer-support-dashboard
```

### 2. Install dependencies

Run the provided setup script to install all Node and Python packages:

```bash
./setup.sh
```

### 3. Setup environment variables

Create a `.env` file in `apps/frontend/`, `apps/backend-api/`, and `ai-service/` directories. Sample contents:

```
# backend/.env
PORT=5000
DATABASE_URL=postgres://user:pass@db:5432/supportdb
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_key
```

### 3. Run using Docker Compose

```bash
docker-compose up --build
```

### 4. Run locally (manual)

```bash
# Start backend
cd apps/backend-api && npm run start:dev

# Start frontend
cd apps/frontend && npm run dev

# Start AI service
cd ai-service && python summarizer.py
```

### 5. Kafka Setup (if using Kafka)

Install Kafka and run `producer.js` and `consumer.js` in `kafka-pipeline/`.

---

## 🧪 Testing

```bash
# Unit & integration tests
cd apps/backend-api && npm run test

# End-to-end tests
cd apps/frontend && npx cypress open
```

---

## 📘 API Endpoints (Backend)

### POST /api/tickets

Create a new customer ticket

```json
{
  "customer_id": "123",
  "message": "I'm having billing issues."
}
```

### GET /api/tickets/:id

Fetch ticket data by ID

### POST /api/analyze

Analyze message for sentiment and keywords

```json
{
  "text": "This is unacceptable!"
}
```

### POST /api/summarize

Summarize a chat transcript using AI

```json
{
  "chat_history": ["Hi", "I'm stuck on billing", "Resolved now"]
}
```

---

## 🛠️ Deployment

- Kubernetes manifests and Terraform scripts are under `terraform/`
- Pre-configured for AWS EKS and Lambda
- CI/CD workflows in `.github/workflows/`

---

## 👥 Contributing

Pull requests welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License
