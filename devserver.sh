cd back
. venv/bin/activate
./manage.py runserver & \
	ENVIRONMENT="development" python -m celery -A core worker -l info & \
	stripe listen --forward-to "http://localhost:8000/stripe/webhook" & \
	yarn --cwd "../front" start
deactivate
cd ..