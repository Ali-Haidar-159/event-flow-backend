/**
 * @openapi
 * /attendance/mark:
 *   post:
 *     summary: Mark attendance using ticket ID
 *     description: Marks a user's attendance for an event by scanning or providing the ticket ID (supports body, query, or params).
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 example: "tick-uuid-1234"
 *               eventId:
 *                 type: string
 *                 example: "event-uuid-5678"
 *     responses:
 *       200:
 *         description: Attendance marked successfully or already marked.
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
 *                   example: "Attendance marked successfully"
 *                 alreadyMarked:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request (missing ticketId or event mismatch).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Registration not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /attendance/mark:
 *   get:
 *     summary: Mark attendance via query parameter
 *     description: Marks a user's attendance for an event using query parameters.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ticket ID
 *         example: "tick-uuid-1234"
 *       - in: query
 *         name: eventId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique event ID for verification
 *         example: "event-uuid-5678"
 *     responses:
 *       200:
 *         description: Attendance marked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Registration not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /attendance/event:
 *   get:
 *     summary: Get event attendance list via query
 *     description: Retrieves all attendance records for a specific event using query parameters.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique event ID
 *         example: "event-uuid-5678"
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
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
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad Request (missing eventId).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /attendance/event/{eventId}:
 *   get:
 *     summary: Get event attendance list via path parameter
 *     description: Retrieves all attendance records for a specific event using path parameters.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique event ID
 *         example: "event-uuid-5678"
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /attendance/event-attendance:
 *   get:
 *     summary: Get event attendance list (alternative endpoint)
 *     description: Retrieves all attendance records for an event.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique event ID
 *         example: "event-uuid-5678"
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /attendance/verify:
 *   get:
 *     summary: Verify ticket via query
 *     description: Verifies ticket validity and checks if attendance has been marked using query parameters.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ticket ID
 *         example: "tick-uuid-1234"
 *     responses:
 *       200:
 *         description: Ticket verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ticket verified successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request (missing ticketId).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid ticket ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid ticket ID"
 */


/**
 * @openapi
 * /attendance/verify/{ticketId}:
 *   get:
 *     summary: Verify ticket via path parameter
 *     description: Verifies ticket validity and checks if attendance has been marked using path parameters.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ticket ID
 *         example: "tick-uuid-1234"
 *     responses:
 *       200:
 *         description: Ticket verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid ticket ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid ticket ID"
 */


/**
 * @openapi
 * /attendance/verify-ticket:
 *   get:
 *     summary: Verify ticket (alternative endpoint)
 *     description: Verifies ticket validity and attendance status.
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ticket ID
 *         example: "tick-uuid-1234"
 *     responses:
 *       200:
 *         description: Ticket verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid ticket ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid ticket ID"
 */
