curl -XPOST -H "Content-type: application/json" -d "{
      \"email\": \"$1\",
      \"password\": \"$2\"
  }" 'http://localhost:8000/api/auth/login/' | jq

