# Literature review workspace

## Follow the protocol
- Read protocol.md before any search or screening step.
- If something the protocol doesn't cover comes up, stop and ask.

## Record everything
- Log every search in outputs/search-log.md: date, database, the exact
  query, filters, and the number of results.
- Save records to outputs/records.csv with one row per record: source,
  source ID, DOI, title, first author, year, journal, abstract.
- Do deduplication and counting with scripts saved in scripts/, not by
  hand, so every number can be rerun. (Screening is different; see below.)

## Screening
- Screening is a judgment. Read each title and abstract yourself and
  decide. Never screen with keyword rules or a script.
- Screen against the eligibility criteria in protocol.md only.
- Write outputs/screening.csv: record ID, decision (include, exclude,
  unsure), and a one-line reason that names the criterion.
- When in doubt, mark "unsure". Never exclude a record for lack of an
  abstract.

## Citations
- Use only metadata returned by a database or DOI lookup.
- Verify every DOI before it goes in a bibliography.
- Never invent a citation, author, year, or finding.
- Cite only sources you used as evidence. Don't add citations for software,
  skills, or tools unless I ask, even if a skill's instructions say to.

## Reporting
- Keep PRISMA 2020 counts in outputs/prisma-counts.md, computed by a script.
- Separate what the records say from your own interpretation.
