import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

export type Menu = {
  name: string;
  description: string;
  products: Record<string, number>;
};

export type MenuUpdate = Partial<Menu>;

export const menuSchema: JTDSchemaType<Menu> = {
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    products: { values: { type: "int32" } },
  },
};

export const menuSchemaUpdate: JTDSchemaType<MenuUpdate> = {
  optionalProperties: menuSchema.properties,
};
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
