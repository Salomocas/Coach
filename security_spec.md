# Security Specification & Invariants: Coach Sérgio Cunha Platform

## Data Invariants
1. A user can only access their own private profile unless the requester is Coach Sérgio Cunha (`isCoach()`).
2. Subscription status can be updated upon payment confirmation or by the coach.
3. Workout plans and nutrition plans belong to a specific athlete and can only be created/edited by the coach, and read by the assigned athlete.
4. Exercise library is coach-managed, but athletes have read-only access to view demonstration videos and exercise instructions.
5. Messages are strictly private between the designated client and the coach. Neither unauthenticated users nor unrelated clients can read or post to another client's chat.
6. Progress logs (weight, body measurements, physical check-in photos) can only be created by the owning client or coach, and viewed only by the client and coach.
7. Workout logs (recording loads and completed series) can only be created and updated by the athlete or the coach.
8. Notifications are targeted to a specific `userId` and cannot be read by other athletes.

## The Dirty Dozen Payloads (Targeting Rejection)
1. Unauthenticated read of any user document -> PERMISSION_DENIED.
2. Client B attempting to read Client A's progress photos/measurements -> PERMISSION_DENIED.
3. Client B attempting to inject a message into Client A's chat conversation -> PERMISSION_DENIED.
4. Client attempting to write or overwrite an exercise in the global library -> PERMISSION_DENIED.
5. Client attempting to modify their subscription status to 'active' without authorization -> PERMISSION_DENIED.
6. Client attempting to delete Coach's workout plan -> PERMISSION_DENIED.
7. Client attempting to read another client's workout plan -> PERMISSION_DENIED.
8. Client attempting to alter another athlete's workout performance log -> PERMISSION_DENIED.
9. Malicious actor injecting a payload with document ID length > 128 characters or invalid regex -> PERMISSION_DENIED.
10. Malicious actor creating a message with text length > 2000 chars -> PERMISSION_DENIED.
11. Malicious actor reading notifications for a different user ID -> PERMISSION_DENIED.
12. Unauthenticated write of any workout or nutrition plan -> PERMISSION_DENIED.
