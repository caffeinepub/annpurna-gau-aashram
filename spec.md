# Annpurna Gau Aashram

## Current State
- 4-digit PIN login
- getUserByPin returns first match only
- Default admin PIN 0000

## Requested Changes (Diff)

### Add
- getUsersByPin backend function
- Multi-user selection when PIN matches multiple users

### Modify
- PIN 4 to 6 digits everywhere
- Default admin PIN 000000

### Remove
- Nothing

## Implementation Plan
1. Backend: getUsersByPin, ensureDefaultAdmin with 000000
2. LoginPage: 6 dots, trigger at 6, user-pick screen for duplicates
3. AdminPage: 6-digit PIN field
