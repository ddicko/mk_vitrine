FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y gcc python3-dev libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Copy and install requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

# Expose port (adjust if needed)
EXPOSE 8000

# Example command (adjust to your needs)
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]