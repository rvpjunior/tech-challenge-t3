# Tech Challenge Term 3

This project focuses on extracting financial transaction data from the Sao Paulo government. By leveraging machine learning techniques, it aims to identify potential fraudulent activities within the dataset.

## Scripts

### Setup

1. **Generate API Credentials:**
    - Register at the [Sao Paulo government API portal](https://apilib.prefeitura.sp.gov.br/store/) to obtain your consumer key and secret.
    - Set the consumer key and secret as environment variables:

    ```sh
    export CONSUMER_KEY=<consumer_key>
    export CONSUMER_SECRET=<consumer_secret>
    ```

2. **Configure AWS environment variables:**
    - Set the AWS S3 bucket name as an environment variable:

    ```sh
    export S3_BUCKET_NAME=<s3_bucket_name>
    ```

    - Set environment variables for AWS credentials:

    ```sh
    export AWS_ACCESS_KEY_ID=<your_access_key_id>
    export AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
    export AWS_REGION=<your_aws_region>
    ```

3. **Setup Python Environment:**
    - Create a virtual environment and install the dependencies:

    ```sh
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

### Extracting Data to a Parquet File

To extract Sao Paulo government data to a Parquet file, run the following command:

```sh
python export_data.py <year> <start_page> <end_page>
```

Replace `<year>`, `<start_page>`, and `<end_page>` with the desired values. The generated Parquet file will be located in the `/data` folder.

### Upload the Parquet File to S3

To upload the Parquet file to S3, run the following command:

```sh
python upload_s3.py <file>
```

Replace `<file>` with the path to your Parquet file.

## Model

This project utilizes the DBSCAN algorithm to identify outliers in the dataset.

- The script for data processing and model execution is located in the `/notebooks` folder.
- The results of the model execution will be stored in an S3 bucket.

**Recommendation:**
- It is recommended to run the script on AWS SageMaker for better performance and direct access to the data.

## API

We implemented a simple REST API to return the anomalies.

### Setup

1. **Set AWS:**
    - Ensure the following environment variables are set:

    ```sh
    export AWS_ACCESS_KEY_ID=<your_access_key_id>
    export AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
    export AWS_REGION=<your_aws_region>
    export DATABASE_NAME=<your_aws_athena_database>
    export OUTPUT_BUCKET=<your_s3_bucket_to_query_outputs>
    ```

2. **Install NodeJS Dependencies:**
    - Ensure you have NodeJS and NPM installed, then install the dependencies:

    ```sh
    npm install
    ```

3. **Run the API:**
    - Start the API server:

    ```sh
    npm start
    ```

    The API will be available at `http://localhost:3000`.