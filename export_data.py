import os
import requests
import base64
import sys
import csv
import pandas as pd
import time

def verify_env_variables():
    consumer_key = os.getenv('CONSUMER_KEY')
    consumer_secret = os.getenv('CONSUMER_SECRET')

    if not consumer_key:
        raise ValueError("CONSUMER_KEY environment variable is not set or is empty.")
    
    if not consumer_secret:
        raise ValueError("CONSUMER_SECRET environment variable is not set or is empty.")

def generate_access_token():
    consumer_key = os.getenv('CONSUMER_KEY')
    consumer_secret = os.getenv('CONSUMER_SECRET')
    credentials = f"{consumer_key}:{consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}"
    }
    response = requests.post("https://gateway.apilib.prefeitura.sp.gov.br/token", headers=headers, data={"grant_type": "client_credentials"})

    data = response.json()
    return data.get("access_token")

def export_data(year, month, access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(f"https://gateway.apilib.prefeitura.sp.gov.br/sf/sof/v4/empenhos?anoEmpenho={year}&mesEmpenho={month}", headers=headers)

    data = response.json()

    items = data.get("lstEmpenhos", [])
    total_pages = data.get("metaDados").get("qtdPaginas", 1)
    current_page = 1

    consecutive_errors = 0
    while current_page < total_pages:
        time.sleep(10)
        current_page += 1
        response = requests.get(f"https://gateway.apilib.prefeitura.sp.gov.br/sf/sof/v4/empenhos?anoEmpenho={year}&mesEmpenho={month}&page={current_page}", headers=headers)
        try:
            data = response.json()
            page_items = data.get("lstEmpenhos", [])
            items.extend(page_items)
            consecutive_errors = 0
        except Exception as e:
            consecutive_errors += 1
            print(f"Error while fetching page {current_page}")
            if consecutive_errors >= 5:
                print("Too many consecutive errors. Exiting.")
                break

    for item in items:
        if 'anexos' in item:
            del item['anexos']

    return items

def write_parquet_file(year, month, items):
    df = pd.DataFrame(items)
    df.to_parquet(f"data/transacoes_{year}_{month}.parquet", index=False)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise ValueError("Please provide both year and month as arguments.")

    year = sys.argv[1]
    month = sys.argv[2]

    verify_env_variables()
    access_token = generate_access_token()
    items = export_data(year, month, access_token)
    write_parquet_file(year, month, items)