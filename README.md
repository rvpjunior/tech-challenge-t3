# Tech Challenge Term 3

This project focuses on extracting financial transaction data from the Sao Paulo government. By leveraging machine learning techniques, it aims to identify potential fraudulent activities within the dataset. 

## Setup

- Generate your consumer key and secret by registering in the [Sao Paulo government API portal](https://apilib.prefeitura.sp.gov.br/store/).
- Set the consumer key and secret as environment variables:

```sh
export CONSUMER_KEY=<consumer_key>
export CONSUMER_SECRET=<consumer_secret>
```

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
python3 -v venv venv
source venv/bin/activate
pip install -r requirements.txt
python export_data.py <year> <month>
```

Replace `<year>` and `<month>` with the desired period.

The generated parquet file will be located in the `/data` folder.