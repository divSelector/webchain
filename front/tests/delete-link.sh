curl -s -XDELETE -H "Authorization: Token $1" \
    -H "Content-type: application/json"  'http://localhost:8000/api/link/delete/33/'
