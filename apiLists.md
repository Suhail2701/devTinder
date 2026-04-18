authRouter
- POST /singup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- POST /profile/edit
- POST /profile/forget-password
- PATCH /profile/reset-password 

connectionRequestRouter
- POST /request/send/interested:userId
- POST /request/send/ignored:userId
- POST /request/review/accepted:requestId
- POST /request/review/rejected:requestId

userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed  - gets the profiles of othe users on platform.