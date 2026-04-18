#!/bin/bash

for i in {1..1000}
do
  curl -s -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$i\",\"side\":\"buy\",\"price\":100,\"quantity\":1}" > /dev/null
done

echo "Load test completed"