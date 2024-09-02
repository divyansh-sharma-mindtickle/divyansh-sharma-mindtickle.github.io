## Requirements
- Update Sync status component + sync status next to title [1 SP]
- Status filter [3 SP]
    - UI [filter with multi select] + Graphql
- Listing
    - handle new statuses [0.5 SP]
    - graphql schema update [0.5 SP]
    - default status logic for sync details page [2 SP]
        - Show failed and skipped status by default. If these files are absent then show success filter selected by default and show successfully synced files.
    - successful file CC link [1 SP]
        - graphql changes [2 SP]

## CC Sync details page

**Appears when you click view sync details on a particular file:**
1. Add status in heading
2. Add status icon for each file and folder

**Account setting page**
1. Add status for each sync

# PROGRESS

## Tasks

- [x] Handle extra status in cc ui
- [x] add status filter
- [x] Show default skip and failed
- [ ] Map extra status in GQL
- [ ] get info around pointing directly to gql local
- [ ] QA till this
- [ ] Get context around account page
- [ ] implement account section changes
- [ ] end to end test

## Action Items ( *2 Sept* )

1. Folder status PR is not merged yet - Vibhu will merge then have to test
2. Vibhu will be making Integration GQL changes
3. I have to Do the required mapping similar to content-gql
4. Have to complete FE changes on integrations side
5. verify if changes are required or not
6. Deploy CC on integration and then setup account setting repo in local