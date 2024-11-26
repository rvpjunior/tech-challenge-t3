import boto3
import sys
import os

def upload_to_s3(file_name, bucket, object_name):
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except Exception as e:
        print(f"Error uploading file: {e}")
        return False
    return True

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise ValueError("Please provide both year and month as arguments.")

    bucket_name = os.environ.get("S3_BUCKET_NAME")
    if not bucket_name:
        raise ValueError("S3_BUCKET_NAME environment variable is not set or is empty.")

   
    year = sys.argv[1]
    month = sys.argv[2]
    file_name = f"data/transacoes_{year}_{month}.parquet"
    object_name = f"raw/transacoes_{year}_{month}.parquet"

    success = upload_to_s3(file_name, bucket_name, object_name)
    if success:
        print(f"File {file_name} uploaded to {bucket_name} successfully.")
    else:
        print(f"Failed to upload {file_name} to {bucket_name}.")