import Ajv, {JTDSchemaType} from "ajv/dist/jtd";

export type ProductMinimal = {
    id: string;
    description: string;
};

export type ProductWithNutrients = {
    description: string;
    id: number;
    nutrient_id: number;
    nutrient_name: string;
    amount: number;
    unit_name: "G" | "UG";
    nutrient_nbr: number;
    group_name: string;
};

type NutrientId = string
export type ProductCreate = {
    name: string;
    description: string;
    category: string;
    nutrients: Record<NutrientId, number>
};

export type ProductUpdate = Partial<ProductCreate>;

export const productSchemaCreate: JTDSchemaType<ProductCreate> = {
    properties: {
        name: {type: "string"},
        description: {type: "string"},
        category: {type: "string"},
        nutrients: {values: {type: "int32"}},
    },
};

export const productSchemaUpdate: JTDSchemaType<ProductUpdate> = {
    optionalProperties: productSchemaCreate.properties,
};
