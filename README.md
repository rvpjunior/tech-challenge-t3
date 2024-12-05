# Tech Challenge Term 3

This project focuses on extracting financial transaction data from the Sao Paulo government. By leveraging machine learning techniques, it aims to identify potential fraudulent activities within the dataset. 

## Setup

- Generate your consumer key and secret by registering in the [Sao Paulo government API portal](https://apilib.prefeitura.sp.gov.br/store/).
- Set the consumer key and secret as environment variables:

```sh
export CONSUMER_KEY=<consumer_key>
export CONSUMER_SECRET=<consumer_secret>
```

- Set the AWS S3 bucket as environment variable:

```sh
export S3_BUCKET_NAME=<s3_bucket_name>
```

- Set environment variables for AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION).

- Create a virtual environment and install the dependencies:

```sh
python3 -v venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Scripts

### Extracting data to a Parquet file

To extract Sao Paulo government data to a parquet file, run the following command:

```sh
python export_data.py <year> <start_page> <end_page>
```

Replace `<year>` with the desired period and `<start_page>` and `<end_page>` with the desired interval.

The generated parquet file will be located in the `/data` folder.

### Upload the Parquet File to S3

To upload the parquet file to S3, run the following command:

```sh
python upload_s3.py <file>
```