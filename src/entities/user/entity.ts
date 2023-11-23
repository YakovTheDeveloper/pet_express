import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

export type User = {
    email: string
    password: string
    name?: string
}

export const userSchema: JTDSchemaType<User> = {
    properties: {
        email: {type: "string"},
        password: {type: "string"},
    },
    optionalProperties: {
        name: {type: "string"}
      }
  }
  
