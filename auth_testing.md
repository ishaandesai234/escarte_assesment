# SkillSpark Auth Testing Playbook

## Admin Credentials (seeded on startup)
- email: `admin@skillspark.com`
- password: `admin123`

## Test Flow
1. Register a new user via POST /api/auth/register with body `{"email":"kid@test.com","password":"pass123","name":"Kid","age":12,"grade":"7"}` — expect 200 with `{user,token}` and `access_token` cookie set.
2. Login with same credentials via POST /api/auth/login — expect 200.
3. Call GET /api/auth/me with cookie or Bearer token — expect user object.
4. Login as admin and hit GET /api/admin/users — expect list.
5. Non-admin user hitting /api/admin/users should return 403.
