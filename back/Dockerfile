FROM python:3.11.3-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./back/requirements.txt /src/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /src/requirements.txt


RUN adduser -D notroot
USER notroot

COPY --chown=notroot:notroot ./back /src/back/
COPY --chown=notroot:notroot ./.env /src/back/core/.env

WORKDIR /src/back

EXPOSE 8000
CMD gunicorn core.wsgi:application --bind 0.0.0.0:8000 & celery -A core worker -l info & celery -A core beat -l info