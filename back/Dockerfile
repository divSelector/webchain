# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.11.3-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./back/requirements.txt /src/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /src/requirements.txt

RUN adduser -D notroot
USER notroot

COPY ./back /src/back/
COPY ./.env /src/back/core/.env

WORKDIR /src/back

EXPOSE 8000
CMD gunicorn core.wsgi:application --bind 0.0.0.0:8000 & celery -A core worker -l info