/**
 * @openapi
 * /events/event-register:
 *   post:
 *     summary: Register for an event
 *     description: Registers a user for an event. Handles free events instantly with a generated ticket and paid events by creating a pending registration and payment session.
 *     tags:
 *       - Event Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: "event-uuid-1234"
 *               userId:
 *                 type: string
 *                 example: "user-uuid-5678"
 *     responses:
 *       200:
 *         description: Registration confirmed for free event or initiated for paid event.
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
 *                   example: "Registration confirmed successfully for free event."
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request (missing ID or already registered).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Event not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /events/verify-payment:
 *   post:
 *     summary: Verify and complete payment for event registration
 *     description: Updates a pending payment session to SUCCESS, confirms the associated registration, and generates a ticket ID.
 *     tags:
 *       - Event Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: "payment-uuid-1234"
 *               transactionId:
 *                 type: string
 *                 example: "TRX_BKASH_1712345678"
 *     responses:
 *       200:
 *         description: Payment successful and ticket confirmed.
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
 *                   example: "Payment successful! Registration and ticket confirmed."
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad Request (missing paymentId or payment already completed).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Payment session not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


/**
 * @openapi
 * /events/my-registrations:
 *   get:
 *     summary: Get user's event registrations
 *     description: Retrieves all event registrations, payment details, and attendance status for the specified user.
 *     tags:
 *       - Event Registration
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique user ID (can also be derived from authenticated session)
 *         example: "user-uuid-5678"
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
 *       400:
 *         description: Bad Request (missing userId).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to fetch registrations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
