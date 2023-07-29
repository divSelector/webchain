curl -X PATCH -H "Authorization: Token $1" -H "Content-Type: application/json" -d "{\"primary\": true}" "http://127.0.0.1:8000/api/webring/29/"
