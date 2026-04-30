import { HTTP_STATUS } from "../constants.js";

const send = (res, statusCode, message, payload = {}) =>
    res.status(statusCode).json({ success: true, message, ...payload });

const ok = (res, { message = "OK", ...rest } = {}) =>
    send(res, HTTP_STATUS.OK, message, rest);

const created = (res, { message = "Created", ...rest } = {}) =>
    send(res, HTTP_STATUS.CREATED, message, rest);

const noContent = (res) => res.status(HTTP_STATUS.NO_CONTENT).send();

export default { ok, created, noContent };
