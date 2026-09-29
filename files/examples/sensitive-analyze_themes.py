import csv
from collections import defaultdict
from pathlib import Path

data_path = Path('data/interviews-coded.csv')
output_dir = Path('outputs')
output_dir.mkdir(parents=True, exist_ok=True)

participants = {}
theme_counts_overall = defaultdict(int)
theme_counts_by_county = defaultdict(lambda: defaultdict(int))
participants_per_county_theme = defaultdict(lambda: defaultdict(set))

with data_path.open(newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        pid = row['participant_id']
        county = row['county']
        theme = row['theme']
        # Track unique participants per theme overall and by county
        # Using participant_id as unique identifier
        key = (pid, theme)
        # Overall count per theme: unique participants
        if pid not in participants:
            participants[pid] = {'county': county, 'themes': set()}
        participants[pid]['themes'].add(theme)
        # We'll aggregate later per participant to avoid double-counting same participant/theme
        # But data appears one row per coding, possibly same participant multiple themes
        # Count mentions = rows, but requirement: how many participants mention each theme
        # So unique participants per theme
        participants_per_county_theme[theme][county].add(pid)

# Compute overall unique participants per theme
overall_unique = {}
for theme, county_map in participants_per_county_theme.items():
    total = set()
    for county, pids in county_map.items():
        total.update(pids)
    overall_unique[theme] = len(total)

# Compute by county
by_county = {}
for theme, county_map in participants_per_county_theme.items():
    by_county[theme] = {}
    for county, pids in county_map.items():
        count = len(pids)
        # Suppress groups <5
        if count < 5:
            count = None
        by_county[theme][county] = count

# Also compute total participants mentioning each theme overall, suppress if <5
themes_summary = []
for theme in sorted(overall_unique):
    total = overall_unique[theme]
    if total < 5:
        total_display = 'suppressed (<5)'
    else:
        total_display = str(total)
    themes_summary.append((theme, total_display, by_county[theme]))

# Write markdown report
report_path = output_dir / 'theme-summary.md'
with report_path.open('w') as out:
    out.write('# Theme Summary Report\n\n')
    out.write('Data source: data/interviews-coded.csv\n\n')
    out.write('Counts represent number of unique participants mentioning each theme. ')
    out.write('Groups with fewer than 5 participants are suppressed per workspace rules.\n\n')
    out.write('## Overall counts by theme\n\n')
    out.write('| Theme | Participants |\n')
    out.write('|---|---|\n')
    for theme, total_display, _ in themes_summary:
        out.write(f'| {theme} | {total_display} |\n')
    out.write('\n## Counts by theme and county\n\n')
    # Determine all counties
    counties = set()
    for theme_map in participants_per_county_theme.values():
        counties.update(theme_map.keys())
    counties = sorted(counties)
    out.write('| Theme | ' + ' | '.join(counties) + ' |\n')
    out.write('|---|' + '|'.join(['---'] * len(counties)) + '|\n')
    for theme, total_display, county_map in themes_summary:
        row = [theme]
        for county in counties:
            pids = participants_per_county_theme[theme].get(county, set())
            actual = len(pids)
            if actual == 0:
                row.append('—')
            elif actual < 5:
                row.append('suppressed (<5)')
            else:
                row.append(str(actual))
        out.write('| ' + ' | '.join(row) + ' |\n')
    out.write('\n*Note: Direct identifiers (names, IDs, dates of birth, addresses) are omitted. ')
    out.write('Quotes are paraphrased or omitted to protect privacy.*\n')

print('Report written to', report_path)
