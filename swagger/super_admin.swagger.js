/**
 * @openapi
 * /clubs/create-club:
 *   post:
 *     summary: Create a new club
 *     description: Creates a new club with a name, optional description, and an optional profile image file.
 *     tags:
 *       - Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the club
 *                 example: "Coding Club"
 *               description:
 *                 type: string
 *                 description: Brief details about the club
 *                 example: "A community for developers and tech enthusiasts."
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Profile image for the club
 *     responses:
 *       201:
 *         description: Club created successfully
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
 *                   example: "Club created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                     name:
 *                       type: string
 *                       example: "Coding Club"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "A community for developers and tech enthusiasts."
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                       example: "uploads/profileImage-16987654321.png"
 *       400:
 *         description: Bad Request (missing required fields or creation error)
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
 *                   example: "Club name is required"
 *                 error:
 *                   type: string
 *                   example: "Error message details (if unexpected error occurs)"
 */






/**
 * @openapi
 * /clubs/all-clubs:
 *   get:
 *     summary: Retrieve all clubs
 *     description: Fetches a list of all existing clubs in the database.
 *     tags:
 *       - Super Admin
 *     responses:
 *       200:
 *         description: List of clubs retrieved successfully.
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
 *                         format: uuid
 *                         example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                       name:
 *                         type: string
 *                         example: "Coding Club"
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: "A community for developers and tech enthusiasts."
 *                       profileImage:
 *                         type: string
 *                         nullable: true
 *                         example: "uploads/profileImage-16987654321.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-31T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-31T10:00:00.000Z"
 *       400:
 *         description: Failed to retrieve clubs
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
 *                   example: "Find error to get clubs"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */


/**
 * @openapi
 * /clubs/single-club:
 *   get:
 *     summary: Retrieve a single club by ID
 *     description: Fetches details for a specific club using a query parameter (`clubId`).
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: query
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the club to retrieve
 *         example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *     responses:
 *       200:
 *         description: Club details retrieved successfully.
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
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                     name:
 *                       type: string
 *                       example: "Coding Club"
 *                     description:
 *                       type: string
 *                       nullable: true
 *                       example: "A community for developers and tech enthusiasts."
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                       example: "uploads/profileImage-16987654321.png"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-10-07T19:21:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-10-07T19:21:00.000Z"
 *       400:
 *         description: Failed to retrieve club or missing query parameter
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
 *                   example: "Find error to get club"
 *                 error:
 *                   type: string
 *                   example: "Club ID is required"
 */


/**
 * @openapi
 * /clubs/search-club:
 *   post:
 *     summary: Search for clubs by name
 *     description: Searches for clubs in the database using a partial or full name match supplied in the request body.
 *     tags:
 *       - Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clubName
 *             properties:
 *               clubName:
 *                 type: string
 *                 description: The full or partial club name to search for
 *                 example: "Coding"
 *     responses:
 *       200:
 *         description: Clubs retrieved successfully.
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
 *                         format: uuid
 *                         example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                       name:
 *                         type: string
 *                         example: "Coding Club"
 *                       description:
 *                         type: string
 *                         nullable: true
 *                         example: "A community for developers and tech enthusiasts."
 *                       profileImage:
 *                         type: string
 *                         nullable: true
 *                         example: "uploads/profileImage-16987654321.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-31T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-31T10:00:00.000Z"
 *       400:
 *         description: Bad Request (missing search term or server error)
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
 *                   example: "Club search query 'clubName' is required"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */



/**
 * @openapi
 * /clubs/update-club:
 *   put:
 *     summary: Update the clubs data
 *     description: This API is used to update the existing clubs data .
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: query
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Club id to identify the club  
 *         example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: new name for club
 *                 example: "Updated Coding Club"
 *               description:
 *                 type: string
 *                 description: new description for club
 *                 example: "Updated details about coding club."
 *               admin:
 *                 type: string
 *                 description: New Admin for the club
 *                 example: "admin-id-123"
 *     responses:
 *       200:
 *         description: Club  updated successfully.
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
 *                   example: "Club updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                     name:
 *                       type: string
 *                       example: "Updated Coding Club"
 *                     description:
 *                       type: string
 *                       example: "Updated details about coding club."
 *                     profileImage:
 *                       type: string
 *                       example: "uploads/new-profile.png"
 *       400:
 *         description: Bad Request (clubId missing or internal server error).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Club ID required (Record Not Found).
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
 *                   example: "Club not found with the provided ID"
 */





/**
 * @openapi
 * /clubs/delete-club:
 *   delete:
 *     summary: Delete a club
 *     description: Deletes a specific club from the database using its unique club ID provided in the query parameters.
 *     tags:
 *       - Super Admin
 *     parameters:
 *       - in: query
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the club to delete
 *         example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *     responses:
 *       200:
 *         description: Club deleted successfully.
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
 *                   example: "Club deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "a8b3c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d"
 *                     name:
 *                       type: string
 *                       example: "Coding Club"
 *                     description:
 *                       type: string
 *                       example: "Community for developers"
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                       example: "uploads/profile.png"
 *       400:
 *         description: Bad Request (missing clubId or server error).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Club not found with the provided ID.
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
 *                   example: "Club not found with the provided ID"
 */


/**
 * @openapi
 * /clubs/all-students:
 *   get:
 *     summary: Retrieve all students
 *     description: Fetches a list of all users with the role "STUDENT", including their preferences, ordered by creation date. Passwords are excluded.
 *     tags:
 *       - Super Admin
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
 *                       studentId:
 *                         type: string
 *                         example: "STU12345"
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
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       preference:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "pref-uuid-5678"
 *                           hobbies:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["Coding", "Chess"]
 *                           graduationYear:
 *                             type: integer
 *                             example: 2026
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-10-07T19:21:00.000Z"
 *                       updatedAt:
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
 * /clubs/all-admins:
 *   get:
 *     summary: Retrieve all admins
 *     description: Fetches a list of all users with the role "ADMIN", including associated clubs and preferences, ordered alphabetically by name. Passwords are excluded.
 *     tags:
 *       - Super Admin
 *     responses:
 *       200:
 *         description: Admins retrieved successfully.
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
 *                         example: "admin-uuid-9876"
 *                       name:
 *                         type: string
 *                         example: "Dr. Admin Smith"
 *                       email:
 *                         type: string
 *                         example: "admin.smith@university.edu"
 *                       role:
 *                         type: string
 *                         example: "ADMIN"
 *                       department:
 *                         type: string
 *                         example: "Computer Science"
 *                       phone:
 *                         type: string
 *                         example: "+0987654321"
 *                       club:
 *                         type: array
 *                         items:
 *                           type: object
 *                         example: []
 *                       preference:
 *                         type: object
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-10-07T19:21:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-10-07T19:21:00.000Z"
 *       400:
 *         description: Failed to retrieve admins.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */





