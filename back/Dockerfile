# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.11.3-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

COPY ./back/requirements.txt /src/requirements.txt
RUN pip install -r /src/requirements.txt

COPY ./back /src/back/
COPY ./.env /src/back/core/.env
EXPOSE 8000
WORKDIR /src/back
#  python manage.py makemigrations && \
    # python manage.py migrate && \
    # python manage.py createusers && \
    # python manage.py creategroups && \
    # python manage.py createpages && \ 
CMD python manage.py runserver 0.0.0.0:8000
