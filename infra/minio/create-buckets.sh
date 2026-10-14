#!/usr/bin/env sh
# Helper script to initialize local MinIO buckets for development
set -e

ENDPOINT="http://minio:9000"
ACCESS_KEY="${AWS_ACCESS_KEY_ID:-minio_dev_access_key}"
SECRET_KEY="${AWS_SECRET_ACCESS_KEY:-minio_dev_secret_key_placeholder}"
BUCKET_NAME="${AWS_STORAGE_BUCKET_NAME:-platform-dev-media}"

echo "Configuring MinIO client alias..."
mc alias set local "$ENDPOINT" "$ACCESS_KEY" "$SECRET_KEY"

echo "Creating bucket $BUCKET_NAME if not existing..."
mc mb --ignore-existing "local/$BUCKET_NAME"

echo "Setting bucket policy for local development..."
mc anonymous set download "local/$BUCKET_NAME"

echo "MinIO initialization completed successfully."
