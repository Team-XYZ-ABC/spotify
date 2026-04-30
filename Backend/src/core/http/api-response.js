import { HTTP_STATUS } from "../constants/index.js";

/**
 * Uniform HTTP success response wrapper.
 *
 *   ok(res, { data, message })
 *   created(res, { data })
 *   noContent(res)
 */
const send = (res, statusCode, message, payload = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...payload,
    });
};

const ok = (res, { data, message = "OK", ...rest } = {}) =>
    send(res, HTTP_STATUS.OK, message, { ...(data !== undefined && { data }), ...rest });

const created = (res, { data, message = "Created", ...rest } = {}) =>
    send(res, HTTP_STATUS.CREATED, message, { ...(data !== undefined && { data }), ...rest });

const noContent = (res) => res.status(HTTP_STATUS.NO_CONTENT).send();

export default { ok, created, noContent, send };
