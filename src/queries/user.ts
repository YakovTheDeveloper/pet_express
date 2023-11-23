import { User } from "@entities/user";
import { generateToken, hashPassword, validatePassword } from "@utils/user";
import { db } from "database/repository";
import {ProductMinimal} from "entities/product";

const normalizeData = (row: ProductMinimal) => {
  const [name, ...description] = row.description
      .split(",")
      .map((v) => v.trim());

  return {
    id: row.id,
    name,
    description,
  };
};

export async function signup(credentials: User) {
  const { email, password } = credentials;
  const passwordHash = hashPassword(password);
  console.log("passwordHash", passwordHash);

  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const values = [email, passwordHash, createdAt, updatedAt];
  const query = `
    INSERT INTO users (email, password_hash, created_at, updated_at)
    VALUES ($1, $2, $3, $4)
    RETURNING id`;

  try {
    const { rows } = await db.query(query, values);
    const { id } = rows[0];
    const token = generateToken(id);
    await addToken(id, token);

    return {
      result: {
        token,
      },
      isError: false,
      detail: null,
    };
  } catch (error) {
    console.error(error);
    return {
      result: error,
      isError: true,
      detail: error,
    };
  }
}

export async function login(credentials: User) {
  const { email, password } = credentials;
  const query = `
        SELECT password_hash, id FROM users
        WHERE email = $1`;

  try {
    const { rows } = await db.query(query, [email]);
    // const { password_hash } = rows[0];
    if (rows.length === 0)
      //todo error to detail
      throw new Error("No user with such email or password");

    const { password_hash, id } = rows[0];
    const validated = validatePassword(password, password_hash);

    if (!validated) throw new Error("No user with such email or password");

    const token = await getToken(id);

    return {
      result: token,
      isError: false,
      detail: null,
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      detail: error,
    };
  }
}

export async function getMe(token: string) {
  const query = `
          SELECT id,email,name FROM users
          WHERE token = $1`;
  const { rows } = await db.query(query, [token]);
  return rows[0];
}

export async function addToken(userId: number, token: string) {
  const query = `
    UPDATE users
    SET token = $1
    WHERE id = $2`;

  const result = await db.query(query, [token, userId]);
  return result;
}

export async function getToken(userId: number) {
  const query = `
    SELECT token FROM users
    WHERE id = $1
`;

  const { rows } = await db.query(query, [userId]);
  return rows[0];
}

export async function getUserProducts(userId: string) {
  const queryData = [userId]
  const sql = `
    SELECT fdc_id as id, description FROM food WHERE user_id = $1`;

  const {rows} = await db.query<ProductMinimal>(sql, queryData);

  const normalized = rows.map(normalizeData)
  const mapping = normalized.reduce(createMapping, {})

  return mapping
}

function createMapping(acc: any, curr){
  const {id, ...rest} = curr
  acc[curr.id] = rest
  return acc
}
