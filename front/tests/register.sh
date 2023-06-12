curl -XPOST -H "Content-type: application/json" -d "{
      \"email\": \"$1\",
      \"password1\": \"$2\",
      \"password2\": \"$2\"
  }" 'http://localhost:8000/api/auth/register/' | jq
