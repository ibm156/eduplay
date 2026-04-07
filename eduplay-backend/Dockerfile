# 1. Use the official Python image
FROM python:3.10-slim

# 2. Set the folder where our code will live inside the container
WORKDIR /app

# 3. Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 4. Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 5. Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your Django project code
COPY . .

# 7. Start the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]