curl -XGET -H "Authorization: Token $1" \
    -H "Content-type: application/json" 'http://localhost:8000/stripe/get-session'
