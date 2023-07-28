curl -X PATCH -H "Authorization: Token $1" -H "Content-Type: application/json" -d "{\"account_type\": \"$2\"}" "http://127.0.0.1:8000/api/user/rossfrank/"
