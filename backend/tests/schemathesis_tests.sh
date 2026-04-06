#!/bin/bash
# Schemathesis Automated Contract Testing
# Requires active backend endpoints to validate OpenAPI conformity

echo "Starting Schemathesis API Contract Tests..."

# Validate Auth MS API Definitions
echo "Running against Auth Microservice (Port 8001)..."
python3 -m schemathesis.cli run http://localhost:8001/openapi.json \
  --checks all \
  --workers 4

# Validate SOS MS API Definitions
echo "Running against SOS Microservice (Port 8002)..."
python3 -m schemathesis.cli run http://localhost:8002/openapi.json \
  --checks all \
  --workers 4

# Validate Gamification MS API Definitions
echo "Running against Gamification Microservice (Port 8004)..."
python3 -m schemathesis.cli run http://localhost:8004/openapi.json \
  --checks all \
  --workers 4

echo "Contract Validation Complete."
