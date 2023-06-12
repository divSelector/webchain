curl -XPOST -H "Content-type: application/json" -d "{
      \"email\": \"$1\"
  }" 'http://localhost:8000/api/auth/password/reset/' | jq
