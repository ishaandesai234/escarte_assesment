# Escarté Test Credentials

## Admin Account
- **Email:** admin@escarte.com
- **Password:** escarte2026
- **Role:** admin
- Login via the normal /login screen with this email + password. Admin link appears in the dashboard header.

## Endpoints
- POST /api/auth/login — email + password
- GET  /api/admin/users — includes submissions[], submission_count, last_attempt_at, last_login_at
- GET  /api/admin/submissions — all attempts
- GET  /api/admin/analytics — category averages
