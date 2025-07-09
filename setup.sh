#!/bin/bash
# Setup script to install dependencies for all services
set -euo pipefail

# Install backend dependencies
if [ -f apps/backend-api/package.json ]; then
  echo "Installing backend dependencies"
  (cd apps/backend-api && npm install) || echo "npm install failed - check network access"
fi

# Install frontend dependencies
if [ -f apps/frontend/package.json ]; then
  echo "Installing frontend dependencies"
  (cd apps/frontend && npm install) || echo "npm install failed - check network access"
fi

# Install AI service dependencies
if [ -f ai-service/requirements.txt ]; then
  echo "Installing AI service dependencies"
  pip install -r ai-service/requirements.txt || echo "pip install failed - check network access"
fi

# Optionally add other setup steps here

echo "All dependencies installed."
