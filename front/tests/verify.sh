curl -XPOST -H "Content-type: application/json" -d "{
      \"key\": \"$1\"
}" 'http://localhost:8000/api/auth/register/verify-email/' | jq
