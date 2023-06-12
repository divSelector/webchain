curl -XPOST -H "Content-type: application/json" -d "{
      \"uid\": \"$1\",
      \"token\": \"$2\",
      \"new_password1\": \"$3\",
      \"new_password2\": \"$3\"
  }" 'http://localhost:8000/api/auth/password/reset/confirm/' | jq

