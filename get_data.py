#!/usr/bin/env python3

import urllib.request
import subprocess
from pathlib import Path
import os
import pandas as pd

def main():
    cases_data_url = 'https://data.nsw.gov.au/data/dataset/97ea2424-abaf-4f3e-a9f2-b5c883f42b6a/resource/2776dbb8-f807-4fb2-b1ed-184a6fc2c8aa/download/covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv'

    tests_data_url = 'https://data.nsw.gov.au/data/dataset/60616720-3c60-4c52-b499-751f31e3b132/resource/fb95de01-ad82-4716-ab9a-e15cf2c78556/download/covid-19-tests-by-date-and-postcode-local-health-district-and-local-government-area-aggregated.csv'

    urls = [cases_data_url, tests_data_url]
    filenames = [url.split('/')[-1] for url in urls]
    url_filename_pairs = zip(urls, filenames)

    for url, filename in url_filename_pairs:
        urllib.request.urlretrieve(url, filename)

    cases_df = pd.read_csv('covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv',
                           dtype=str)

    infection_source_mapping = {
        'Locally acquired - contact of a confirmed case and/or in a known cluster': 'Local contact',
        'Locally acquired - source not identified': 'Local unknown'
    }

    cases_df['likely_source_of_infection'] = (
        cases_df['likely_source_of_infection']
        .replace(infection_source_mapping))
    cases_df.to_csv('covid-19-cases-by-notification-date-location-and-likely-source-of-infection.csv', index=False)

    git_commands = [
        f'git add {" ".join(filenames)}'.split(), # assumes no spaces in filenames
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
