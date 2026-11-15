/**
 * @openapi
 * /students/signup:
 *   post:
 *     summary: Register a new student
 *     description: Creates a new user account along with student preferences in the system.
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - name
 *               - email
 *               - password
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: "STU12345"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@university.edu"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               department:
 *                 type: string
 *                 example: "Computer Science"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Coding", "Chess"]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Artificial Intelligence", "Web Development"]
 *               preferredTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["hackathon", "tech"]
 *               graduationYear:
 *                 type: integer
 *                 example: 2026
 *               bio:
 *                 type: string
 *                 example: "Passionate software developer student."
 *     responses:
 *       201:
 *         description: Student registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "new user created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     newUser:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user-uuid-1234"
 *                         studentId:
 *                           type: string
 *                           example: "STU12345"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@university.edu"
 *                         phone:
 *                           type: string
 *                           example: "+1234567890"
 *                         department:
 *                           type: string
 *                           example: "Computer Science"
 *                     newStudentPreference:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "pref-uuid-5678"
 *                         userId:
 *                           type: string
 *                           example: "STU12345"
 *                         graduationYear:
 *                           type: integer
 *                           example: 2026
 *                         bio:
 *                           type: string
 *                           example: "Passionate software developer student."
 *       400:
 *         description: Bad Request (email exists, syntax error, or validation failure).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /students/update-profile:
 *   put:
 *     summary: Update user profile and preferences
 *     description: Updates core user fields (name, phone, department) and upserts student preferences using the user ID passed in query parameters.
 *     tags:
 *     - Student
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user whose profile is being updated
 *         example: "user-uuid-1234"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               phone:
 *                 type: string
 *                 example: "+1987654321"
 *               department:
 *                 type: string
 *                 example: "Electrical Engineering"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Photography", "Robotics"]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Machine Learning", "IoT"]
 *               preferredTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["hardware", "ai"]
 *               graduationYear:
 *                 type: integer
 *                 example: 2027
 *               bio:
 *                 type: string
 *                 example: "Tech enthusiast and robotics club lead."
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "user-uuid-1234"
 *                         name:
 *                           type: string
 *                           example: "Jane Doe"
 *                         email:
 *                           type: string
 *                           example: "jane.doe@university.edu"
 *                         phone:
 *                           type: string
 *                           example: "+1987654321"
 *                         department:
 *                           type: string
 *                           example: "Electrical Engineering"
 *                     preference:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "pref-uuid-5678"
 *                         userId:
 *                           type: string
 *                           example: "user-uuid-1234"
 *                         hobbies:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Photography", "Robotics"]
 *                         graduationYear:
 *                           type: integer
 *                           example: 2027
 *       400:
 *         description: Bad Request (missing userId or validation error).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found with the provided ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found with the provided ID"
 */


/**
 * @openapi
 * /students/profile:
 *   get:
 *     summary: Retrieve a user profile
 *     description: Fetches a single user's profile details along with preferences and associated clubs using either `userId` or `email` in query parameters. Passwords are excluded.
 *     tags:
 *       - Student
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique ID of the user
 *         example: "user-uuid-1234"
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user
 *         example: "john.doe@university.edu"
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-uuid-1234"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@university.edu"
 *                     department:
 *                       type: string
 *                       example: "Computer Science"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     preference:
 *                       type: object
 *                       nullable: true
 *                     club:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: []
 *       400:
 *         description: Bad Request (missing both userId and email).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */

/**
 * @openapi
 * /students/all-students:
 *   get:
 *     summary: Retrieve all student profiles
 *     description: Fetches a list of all users with the "STUDENT" role, including preferences, ordered by creation date descending. Passwords are excluded.
 *     tags:
 *       - Student
 *     responses:
 *       200:
 *         description: Students retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "user-uuid-1234"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@university.edu"
 *                       role:
 *                         type: string
 *                         example: "STUDENT"
 *                       department:
 *                         type: string
 *                         example: "Computer Science"
 *                       preference:
 *                         type: object
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-10-07T19:21:00.000Z"
 *       400:
 *         description: Failed to retrieve students.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */



/**
 * @openapi
 * /students/my-registrations:
 *   get:
 *     summary: Retrieve student's event registrations
 *     description: Fetches all event registrations, associated event details, club information, payment status, and attendance records for the authenticated or specified student.
 *     tags:
 *       - Student
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique user ID (optional if authenticated session provides user ID)
 *         example: "user-uuid-1234"
 *     responses:
 *       200:
 *         description: Registrations retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "reg-uuid-1234"
 *                       registrationId:
 *                         type: string
 *                         example: "reg-uuid-1234"
 *                       userId:
 *                         type: string
 *                         example: "user-uuid-1234"
 *                       eventId:
 *                         type: string
 *                         example: "event-uuid-5678"
 *                       status:
 *                         type: string
 *                         example: "CONFIRMED"
 *                       ticketId:
 *                         type: string
 *                         example: "TICKET_A1B2C3"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-10-07T19:21:00.000Z"
 *                       isAttended:
 *                         type: boolean
 *                         example: false
 *                       attendedAt:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       attendanceStatus:
 *                         type: string
 *                         example: "NOT_ATTENDED"
 *       400:
 *         description: Bad Request (missing user ID).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to fetch student registrations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */







