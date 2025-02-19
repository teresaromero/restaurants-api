#!/bin/bash

set -e

echo "Creating test database..."
yarn prisma:push

echo "Running integration tests..."
yarn test:integration

echo "Integration tests completed successfully."