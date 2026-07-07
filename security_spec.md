# Security Specification - TeachFlow

## Data Invariants
1. Only users with the "Owner" designation can see financial data (Fee Tracker) and performance summaries.
2. Teachers can only see tasks assigned to them.
3. Notices once posted are immutable (except for the `readBy` array).

## Access Model
The app uses a shared secret code verification system. 
- Entry screen validates against a fixed code (set by owner).
- Recognition is handled via LocalStorage.
- Firestore as a target for operational data.

## Note on Security
Since the user explicitly requested NO registration and NO email login, standard Firebase Auth is bypassed in favor of a simpler name/code flow. In a production environment, this should be hardened with Anonymous Auth and a server-side verification of the secret code.

## Dirty Dozen Payloads (Conceptual - for current implementation)
1. Task deletion by unauthorized staff.
2. Modifying student fee status by a teacher.
3. Accessing owner performance analytics as a teacher.
4. Injecting fake enquiries with massive payloads.
5. Overwriting the secret code if stored in DB.
...
