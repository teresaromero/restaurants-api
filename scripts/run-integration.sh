#!/bin/bash

set -e

DATABASE_FILE="./prisma/test.db"
export DATABASE_URL="file:test.db"

if [ -f "$DATABASE_FILE" ]; then
  echo "Removing existing test database..."
  rm "$DATABASE_FILE"
fi

echo "Setting up test database..."
yarn prisma:push:integration

echo "Running integration tests..."
yarn test:integration

echo "Removing test database..."
rm -rf "$DATABASE_FILE"

echo "Integration tests completed successfully."