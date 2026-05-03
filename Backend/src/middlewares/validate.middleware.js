import { ZodError } from "zod";

/**
 * Express middleware factory that validates req.body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema
 */
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const issues = err.issues ?? err.errors ?? [];
            const errors = issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return res.status(400).json({ message: "Validation failed", errors });
        }
        next(err);
    }
};

export default validate;
