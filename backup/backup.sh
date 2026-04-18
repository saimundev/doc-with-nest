#!/bin/bash

# Configuration (Ensure these environment variables are passed in docker-compose)
export PGPASSWORD=$POSTGRES_PASSWORD
DATE=$(date +%F_%H-%M)
BACKUP_DIR="/backups"
FILE="$BACKUP_DIR/${POSTGRES_DB}_$DATE.dump"

echo "📦 Backup started: $FILE"

# pg_dump (Ensure 'database' matches your service name in docker-compose)
pg_dump -h database -U $POSTGRES_USER -d $POSTGRES_DB -F c -f "$FILE"

# Upload to Google Drive using the mounted config
echo "☁️ Uploading to Google Drive..."
rclone --config /config/rclone.conf copy "$FILE" gerive:ProjectBackups/ -vv

# Delete files older than 7 days
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "✅ Backup done"