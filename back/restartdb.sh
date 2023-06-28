find . -path "*/migrations/*.py" -not -path "./venv/*" -not -name "__init__.py" -delete && rm db.sqlite3
./manage.py makemigrations
./manage.py migrate
./manage.py createusers
./manage.py creategroups
./manage.py createpages
./manage.py createsuperuser --email "admin@example.com"
./manage.py runserver
