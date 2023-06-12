 
# Django Rest Framework / React Shitty Auth Stack

This is a shitty auth stack using shitty tokens.

## Backend

Basically it's just a custom user model paired with DRF and allauth.

### Quick start

```
cd back
python3 -m pip install virtualenv
python3 -m virtualenv venv
. venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py creategroups
```

Start the development server and visit 

1. http://127.0.0.1:8000/admin/
2. http://127.0.0.1:8000/api/auth


## Front

Open another terminal

```
cd front
yarn install
yarn start
```

1. http://127.0.0.1:3000/dashboard

Enjoy the shit.
