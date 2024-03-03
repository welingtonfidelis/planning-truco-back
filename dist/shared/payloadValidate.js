"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadValidate = void 0;
const errors_1 = require("../errors");
const payloadValidate = (schema) => {
    return (req, res, next) => {
        const input = Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query);
        const options = {
            abortEarly: false,
        };
        const { error } = schema.validate(input, options);
        const valid = error == null;
        if (valid) {
            next();
        }
        else {
            const { details } = error;
            const message = details.map((item) => item.message.replace(/['"]+/g, ""));
            throw new errors_1.AppError(message, 400);
        }
    };
};
exports.payloadValidate = payloadValidate;
//# sourceMappingURL=payloadValidate.js.map