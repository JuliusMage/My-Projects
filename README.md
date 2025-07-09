# Real-Time AI-Powered Customer Support Dashboard

An internal dashboard that aggregates, analyzes, and auto-summarizes live customer chat/ticket streams using AI to assist support teams.

## Monorepo Structure

This project is a monorepo managed using [pnpm workspaces](https://pnpm.io/workspaces).

-   `services/`: Contains all microservices and the frontend application.
    -   `backend-api/`: NestJS backend for core logic, APIs, and WebSocket communication.
    -   `frontend-app/`: React + TypeScript frontend application.
    -   `ai-service/`: Service for AI/ML tasks (sentiment analysis, summarization, reply suggestions).
    -   `data-processor/`: (Optional) Service for processing event streams from Kafka/Redis.
-   `packages/`: Shared libraries and utilities.
    -   `shared-types/`: TypeScript types and interfaces shared across services.
    -   `ui-components/`: Shared React UI components.
-   `terraform/`: Infrastructure-as-Code using Terraform for AWS.
-   `.github/`: GitHub Actions workflows for CI/CD.
-   `scripts/`: Utility scripts (e.g., database seeding).

## Prerequisites

-   Node.js (v18 or higher)
-   pnpm (v8 or higher)
-   Docker & Docker Compose
-   AWS CLI (configured, for deployment)
-   Terraform CLI (for deployment)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd real-time-ai-support-dashboard # Or your repo name
    ```

2.  **Install dependencies:**
    This command installs dependencies for all packages and services in the monorepo.
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy `.env.example` to `.env` at the root. Individual services might also have their own `.env.example` files (e.g., `services/backend-api/.env.example`) that you should copy to their respective `.env` files and configure.
    ```bash
    cp .env.example .env
    # Example for a service:
    # cp services/backend-api/.env.example services/backend-api/.env
    ```

4.  **Build shared packages (and potentially all packages initially):**
    Some services depend on shared packages from the `packages/` directory. It's good practice to build everything once after installing dependencies.
    ```bash
    pnpm -r build
    ```
    If you only want to build specific shared packages:
    ```bash
    pnpm --filter @shared-types build
    pnpm --filter @ui-components build
    ```

## Development

### Running Services Locally (Individually)

You can run each service independently. This is useful for focused development on a single part of the application.

-   **Backend API:**
    ```bash
    pnpm --filter backend-api run start:dev
    # or: cd services/backend-api && pnpm run start:dev
    ```
    The backend will typically run on `http://localhost:3000`.

-   **Frontend App:**
    ```bash
    pnpm --filter frontend-app run dev
    # or: cd services/frontend-app && pnpm run dev
    ```
    The frontend development server will typically run on `http://localhost:3001`.

-   **AI Service:**
    ```bash
    pnpm --filter ai-service run dev
    # or: cd services/ai-service && pnpm run dev
    ```
    The AI service will typically run on `http://localhost:3002` (or as configured).


### Running Services with Docker Compose (Integrated Local Development)

This is the recommended way to run all services together (backend, database, cache, etc.) for an environment that closely mirrors production. The `docker-compose.yml` file at the root of the project defines these services.

1.  **Ensure Docker Desktop (or Docker Engine) is running.**

2.  **Copy and Configure Environment Files:**
    The `docker-compose.yml` configuration and the services running inside Docker rely on environment variables.
    *   **Root `.env` file:** This is used by Docker Compose itself for variable substitution in the `docker-compose.yml` file (e.g., setting external ports, image tags, default credentials for DB/Redis if not overridden). Copy the example and customize it:
        ```bash
        cp .env.example .env
        # Review and edit .env, especially DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, etc.
        ```
    *   **Service-specific `.env` files (e.g., `services/backend-api/.env`):** The NestJS application (and other services) will load their own `.env` files at runtime if they exist at the expected location within the container (e.g., `services/backend-api/.env`).
        However, for Docker Compose development, it's common to define all necessary runtime environment variables for a service directly in the `environment:` section of `docker-compose.yml` (as done in the provided `docker-compose.yml`). These values are often sourced from the root `.env` file. This centralizes configuration for Dockerized development.
        If you still prefer service-level `.env` files within the container, ensure your Dockerfile copies them or mounts them, and that they don't conflict with variables set in `docker-compose.yml`. The current setup primarily uses variables injected by Docker Compose.

3.  **Build and Start Containers:**
    This command will build the Docker images for your services (if they haven't been built yet or if their `Dockerfile` or source code has changed) and then start all services in detached mode (`-d`).
    ```bash
    docker-compose up --build -d
    ```
    *   To rebuild a specific service (e.g., if you only changed `backend-api` code):
        ```bash
        docker-compose up --build -d backend-api
        ```
    *   To force a rebuild without using Docker's cache for a service:
        ```bash
        docker-compose build --no-cache backend-api && docker-compose up -d backend-api
        ```

4.  **Viewing Service Logs:**
    To see the combined logs from all running services:
    ```bash
    docker-compose logs -f
    ```
    To follow logs for a specific service (e.g., `backend-api`):
    ```bash
    docker-compose logs -f backend-api
    ```

5.  **Accessing Services:**
    Once the containers are up and running:
    *   **Backend API:** Typically available at `http://localhost:3000` (or the `API_PORT` configured in your root `.env` file). Check the `/api/v1/health` endpoint.
    *   **PostgreSQL Database:** Accessible from your host machine on `localhost:5432` (or `DB_PORT`) using the credentials ( `DB_USER`, `DB_PASSWORD`, `DB_NAME`) from your root `.env` file.
    *   **Redis Cache:** Accessible from your host machine on `localhost:6379` (or `REDIS_PORT`), using `REDIS_PASSWORD` if set.

6.  **Stopping Services:**
    *   To stop all running services and remove the containers, networks, and (by default for named volumes) volumes:
        ```bash
        docker-compose down
        ```
    *   To stop services but keep data in volumes (e.g., database data):
        ```bash
        docker-compose stop
        ```
    *   To remove volumes explicitly (e.g., to start fresh with the database):
        ```bash
        docker-compose down -v
        ```

## Linting and Formatting

-   **Lint all packages/services:**
    ```bash
    pnpm -r lint
    ```
-   **Format all code (using Prettier, configured at the root):**
    ```bash
    pnpm exec prettier --write .
    ```

## Testing

-   **Run tests for all packages/services:**
    ```bash
    pnpm -r test
    ```
-   **Run tests for a specific package/service:**
    ```bash
    pnpm --filter backend-api test
    ```

## Deployment (High-Level Overview)

Deployment will be managed by Terraform for infrastructure and GitHub Actions for CI/CD of applications.

1.  **Infrastructure:** Terraform scripts in the `terraform/` directory will provision AWS resources (EKS, RDS, ElastiCache, S3, IAM roles, etc.).
2.  **Application Deployment:** GitHub Actions workflows will:
    *   Build Docker images for each service.
    *   Push images to Amazon ECR (Elastic Container Registry).
    *   Deploy applications to the EKS cluster using Kubernetes manifests (or Helm charts).

Detailed deployment instructions will be added as the project progresses.

## Environment Variables

Refer to the `.env.example` file in the root directory. Additionally, each service directory (e.g., `services/backend-api/`) may contain its own `.env.example` specific to that service's needs. These should be copied to `.env` files and populated with appropriate values for local development and production.

---

This README provides a foundational guide and will be expanded with more details as development continues.
```
