#!/usr/bin/env python3

import urllib.request
import subprocess
import os
import sys
from pathlib import Path
from datetime import datetime
import pandas as pd


def contains_future_date(series):
    try:
        return (series > datetime.now()).any()
    except TypeError:
        raise TypeError('series must have datetime compatible dtype')


def main():
    # Download data
    # cases_data_url = 'https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'
    # cases_data_url = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/21304414-1ff1-4243-a5d2-f52778048b29/download/confirmed_cases_table1_location.csv'
    cases_data_url = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/5d63b527-e2b8-4c42-ad6f-677f14433520/download/confirmed_cases_table1_location_agg.csv'
    tests_data_url = 'https://data.nsw.gov.au/data/dataset/60616720-3c60-4c52-b499-751f31e3b132/resource/fb95de01-ad82-4716-ab9a-e15cf2c78556/download/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area-aggregated.csv'

    urls = [cases_data_url, tests_data_url]
    files = [url.split('/')[-1] for url in urls]
    url_filename_pairs = zip(urls, files)

    for url, filename in url_filename_pairs:
        urllib.request.urlretrieve(url, filename)

    # Test for invalid dates
    date_columns = {'case': 'notification_date',
                    'test': 'test_date'}
    names = date_columns.keys()
    name_file_pairs = zip(names, files)

    dfs = {}
    for name, file in name_file_pairs:
        df = pd.read_csv(file, dtype=str)
        date_column = date_columns[name]
        dates = pd.to_datetime(df[date_column])
        if contains_future_date(dates):
            print(f'Data Error: {name} dates in future!')
            sys.exit(1)
        dfs[name] = df

    # Process cases file
    cases_df = dfs['case']

    # infection_source_mapping = {
    #     'Locally acquired - contact of a confirmed case and/or in a known cluster': 'Local contact',
    #     'Locally acquired - source not identified': 'Local unknown'
    # }

    # cases_df['likely_source_of_infection'] = (
    #     cases_df['likely_source_of_infection']
    #     .replace(infection_source_mapping))

    cases_df['lga_name19'] = cases_df['lga_name19'].str.replace(
        r' *\(.*\) *', '', regex=True)

    # cases_df.to_csv(
    #     'covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv',
    #     index=False)

    cases_df.to_csv(
        name_file_pairs['case'],
        index=False)

    # Push latest data to GitHub
    git_commands = [
        f'git add {" ".join(files)}'.split(), # assumes no spaces in filenames
        'git -c commit.gpgsign=false commit -m'.split() + ['Update data'],
    ]

    for command in git_commands:
        subprocess.run(command)

    ssh_key = Path.home() / '.ssh/covid_repo_id_rsa'

    # The path passed to ssh in the environment variable works best with forward slashes.
    # But pathlib wants to use backslashes on Windows.
    ssh_key_path_hack = '/'.join(str(ssh_key).split('\\'))
    subprocess.run(['git', 'push'],
                   shell=True,
                   env=dict(os.environ, GIT_SSH_COMMAND=f'ssh -i {ssh_key_path_hack} -o IdentitiesOnly=yes'))

if __name__ == '__main__':
    main()
