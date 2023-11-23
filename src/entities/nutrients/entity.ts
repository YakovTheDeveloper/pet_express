import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

export type Nutrient = {
  id: string
  name: string;
  unit_name: string;
  group_id: string;
};

export type NutrientForProductCreation = {
  id: string
  name: string;
  unit_name: string;
  group_id: string;
  group_name: string;
};

// export type MenuUpdate = Partial<Menu>;
//
// export const menuSchema: JTDSchemaType<Menu> = {
//   properties: {
//     name: { type: "string" },
//     description: { type: "string" },
//     products: { values: { type: "int32" } },
//   },
// };
//
// export const menuSchemaUpdate: JTDSchemaType<MenuUpdate> = {
//   optionalProperties: menuSchema.properties,
// };
// export type Menu = {
//   name: string;
//   description: string;
//   products: Record<string, number>;
// };

// export const menuSchema: JTDSchemaType<Menu> = {
//   properties: {
//     name: { type: "string" },
//     description: { type: "string" },
//     products: {
//       values: { type: "int32" },
//     },
//   },
// };
