# MongoDB Configuration for Formexus

This directory contains MongoDB initialization scripts and configuration.

## Local MongoDB (Raspberry Pi)

The MongoDB container is configured in `docker-compose.yml` with:

- Persistent data storage in Docker volumes
- Health checks
- ARM64 compatible image

### Initial Setup

1. MongoDB will be automatically initialized when you run:

```bash
docker-compose up -d mongodb
```

2. The initialization script (`init-mongo.js`) will:
   - Create the `formexus` database
   - Create a dedicated user with read/write permissions
   - Set up indexes for optimal performance

### Connecting to MongoDB

From within containers:

```
mongodb://admin:changeme@mongodb:27017
```

From Raspberry Pi host:

```
mongodb://admin:changeme@localhost:27017
```

### Security Notes

1. **Change default passwords** in `.env` file:

   - `MONGO_ROOT_USERNAME`
   - `MONGO_ROOT_PASSWORD`

2. **Backup your data** regularly:

```bash
docker exec formexus-mongodb mongodump --out /data/backup
```

3. **Restore from backup**:

```bash
docker exec formexus-mongodb mongorestore /data/backup
```

## MongoDB Atlas (Cloud Alternative)

If you prefer using MongoDB Atlas instead:

1. Comment out the `mongodb` service in `docker-compose.yml`

2. Update `.env` with your Atlas connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/formexus?retryWrites=true&w=majority
```

3. Remove `depends_on: mongodb` from backend service

## Data Persistence

Data is stored in Docker volumes:

- `mongodb_data` - Database files
- `mongodb_config` - Configuration files

To backup volumes:

```bash
docker run --rm -v formexus_mongodb_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mongodb-backup.tar.gz /data
```

To restore volumes:

```bash
docker run --rm -v formexus_mongodb_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/mongodb-backup.tar.gz -C /
```
