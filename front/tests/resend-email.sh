curl -XPOST -H "Content-type: application/json" -d "{
      \"email\": \"$1\"
}" 'http://127.0.0.1:8000/api/auth/register/resend-email/' | jq
