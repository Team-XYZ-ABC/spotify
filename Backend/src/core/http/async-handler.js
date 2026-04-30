/**
 * Wraps an async Express handler so thrown errors are forwarded to
 * the global error handler — no try/catch boilerplate in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
