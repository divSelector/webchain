curl -XPOST -H "Authorization: Token $1" \
    -H "Content-type: application/json" -d "{
      \"title\": \"$2\",
      \"description\": \"$3\"
  }" 'http://localhost:8000/api/webring/' | jq

