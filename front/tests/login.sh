curl -XPOST -H "Content-type: application/json" -d "{
      \"email\": \"$1\",
      \"password\": \"$2\"
  }" 'http://0.0.0.0/api/auth/login/' | jq

