curl -X PATCH -H "Authorization: Token $1" -H "Content-Type: application/json" -d '{"description": "Hello from curl -X PATCH"}' "http://127.0.0.1:8000/api/page/1/"
