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

def export_data(year, month, first_page, last_page):
    access_token = generate_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(f"https://gateway.apilib.prefeitura.sp.gov.br/sf/sof/v4/empenhos?anoEmpenho={year}&mesEmpenho={month}&numPagina={first_page}", headers=headers)

    data = response.json()

    items = data.get("lstEmpenhos", [])
    total_pages = data.get("metaDados").get("qtdPaginas", 1)
    current_page = first_page

    consecutive_errors = 0
    while current_page < total_pages and current_page <= last_page:
        time.sleep(0.5)
        current_page += 1

        response = requests.get(f"https://gateway.apilib.prefeitura.sp.gov.br/sf/sof/v4/empenhos?anoEmpenho={year}&mesEmpenho={month}&numPagina={current_page}", headers=headers)
        try:
            data = response.json()
            page_items = data.get("lstEmpenhos", [])
            items.extend(page_items)
            consecutive_errors = 0
        except Exception as e:
            print(f"Error while fetching page {current_page}. Response: {response.text} | Status Code: {response.status_code}")

            consecutive_errors += 1

            if consecutive_errors > 5:
                print("Too many consecutive errors. Exiting.")
                break

            if(response.status_code == 401):
                current_page -= 1
                access_token = generate_access_token()
                headers = {
                    "Authorization": f"Bearer {access_token}"
                }
                continue

        total_requested_pages = last_page - first_page + 1
        progress = ((current_page - first_page + 1) / total_requested_pages) * 100
        if current_page % 10 == 0:
            print(f"Progress: {progress:.0f}% ({current_page}/{last_page}/{total_pages})")

    for item in items:
        if 'anexos' in item:
            del item['anexos']
            item["mesEmpenho"] = int(item["datEmpenho"].split('/')[1])

    return items

def write_parquet_file(year, items, first_page, last_page):
    df = pd.DataFrame(items)
    df.to_parquet(f"data/transacoes_{year}_{first_page}_{last_page}.parquet", index=False)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise ValueError("Please provide year, first and last page as arguments.")

    year = sys.argv[1]
    first_page = int(sys.argv[2])
    last_page = int(sys.argv[3])
    current_year = time.localtime().tm_year
    current_month = time.localtime().tm_mon

    if int(year) != current_year:
        month = 12
    else:
        month = current_month - 1

    print(f"Exporting data from {year}, pages {first_page} to {last_page}.")

    verify_env_variables()
    items = export_data(year, month, first_page, last_page)
    write_parquet_file(year, items, first_page, last_page)