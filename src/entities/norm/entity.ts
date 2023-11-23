import Ajv, {JTDSchemaType} from "ajv/dist/jtd";

export type Norm = {
    name: string;
    user_id: string;
    id: string;
    norm: Record<string, number>
};

export type NormCreate = Omit<Norm, 'id', 'user_id'>;
export type NormUpdate = Partial<NormCreate>;

export const normSchemaCreate: JTDSchemaType<NormCreate> = {
    properties: {
        name: {type: "string"},
        norm: {values: {type: "int32"}},
    },
};

export const normSchemaUpdate: JTDSchemaType<NormUpdate> = {
    optionalProperties: normSchemaCreate.properties,
};
