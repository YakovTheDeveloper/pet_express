import {ajv} from "app";
import {menuSchemaUpdate} from "entities/menu";
import {JTDSchemaType} from "ajv/dist/jtd";
import {ErrorResponse} from "utils/response";

const ValidatePayload = (schema: JTDSchemaType<any>, payload) => {
    const validate = ajv.compile(schema);
    const valid = validate(payload);

    if (!valid) {
        res.send({result: validate.errors, isError: true});
        console.error(validate.errors);
        return;
    }
    // const
}

const ValidatePayloadMiddleware = (schema: JTDSchemaType<any>, payload) => {
    const validate = ajv.compile(schema);
    const valid = validate(payload);

    if (!valid) {
        res.send({result: validate.errors, isError: true});
        console.error(validate.errors);
        return;
    }
    // const
}

export const createPayloadValidationMiddleware = (schema: JTDSchemaType<any>) => {
    return (req, res, next) => {
        const payload = req.body;
        const validate = ajv.compile(schema);
        const valid = validate(payload);

        if (!valid) {
            res.send(ErrorResponse(validate.errors));
            return;
        }
        next()
    }
}