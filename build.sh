#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create and activate a virtual environment if one doesn’t already exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies, including Flake8
pip install -r backend/requirements.txt

# Run Flake8 on the backend directory
echo "Running Flake8..."
flake8 backend/src  # Adjust the path if needed

# Deactivate the virtual environment
deactivate

echo "Flake8 check complete!"
