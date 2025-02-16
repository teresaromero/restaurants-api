#!/bin/bash

set -e

export DATABASE_URL="file:./test.db"

echo "Creating test database..."
yarn prisma:push

echo "Running integration tests..."
yarn test:integration

echo "Integration tests completed successfully."