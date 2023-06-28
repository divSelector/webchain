curl -XPOST -H "Authorization: Token $1" \
    -H "Content-type: application/json" -d "{
      \"title\": \"$2\",
      \"description\": \"$4\",
      \"url\": \"$3\"
  }" 'http://localhost:8000/api/page/'
