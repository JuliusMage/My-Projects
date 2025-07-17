# PatentScope Navigator

PatentScope Navigator is a web-based application that helps users explore patents, analyze trends, and make innovation decisions, with a focus on WIPO’s PCT system.

## Project Purpose and Background

This tool is designed for Technology and Innovation Support Centers (TISCs), researchers, and inventors to navigate the patent landscape effectively.

## Setup & Run Instructions

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```sh
    cd PatentScope-Navigator
    ```
3.  Run the application using Docker Compose:
    ```sh
    docker-compose up --build
    ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** FastAPI (Python)
- **Database:** Mock JSON data
- **Deployment:** Docker + Docker Compose
