FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements-dev.txt /app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt -r requirements-dev.txt

COPY . /app/

EXPOSE 8000

# ECS用コマンド: gunicornを使用してDjangoアプリケーションを起動
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 4 --timeout 60 --access-logfile - --error-logfile - --log-level info"]