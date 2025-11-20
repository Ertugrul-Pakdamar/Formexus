mkdir -p ~/formexus-mongo-data

docker rm -f formexus-mongo 2>/dev/null || true
docker run -d \
  --name formexus-mongo \
  -p 27017:27017 \
  -v ~/formexus-mongo-data:/data/db:Z \
  mongo:7 mongod --noauth