/**
 * Express middleware factory that validates `req.body` against a Zod schema.
 * Validation errors propagate to the global error handler (ZodError branch).
 */
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        next(err);
    }
};

export default validate;
