import { Menu } from "@entities/menu";
import { db } from "database/repository";

export async function createMenu(menu: Menu, userId: string) {
  const { name, description, products } = menu;
  const data = [name, description, products, userId];
  const query = `
    INSERT INTO menus (name, description, products, user_id) 
    VALUES ($1, $2, $3, $4);
    `;

  try {
    await db.query(query, data);
    return {
      result: true,
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

export async function getMenu(userId: string) {
  const data = [userId];
  const query = `
    SELECT id, name, description, products FROM menus WHERE user_id = $1
      `;

  try {
    const { rows } = await db.query<Menu>(query, data);

    return {
      result: rows,
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

export async function patchMenu(id: string, menu: Partial<Menu>) {
  const data = [menu.name, menu.description, menu.products, id];
  const query = `
  UPDATE menus
  SET
      name = COALESCE($1, name),  
      description = COALESCE($2, description),  
      products = COALESCE($3, products) 
  WHERE
      id = $4
   RETURNING id,name,description,products;`;

  try {
    const { rows } = await db.query<Menu>(query, data);

    return {
      result: rows[0],
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


const first = [
  {
    name: "Good menu",
    description: "wow wow",
    products: { "322892": 100, "323121": 300 },
  },
];
const second = [
  {
    id: 322892,
    description: "Milk, whole, 3.25% milkfat, with added vitamin D",
  },
  { id: 323121, description: "Frankfurter, beef, unheated" },
];

const need = [
  {
    name: "Good menu",
    description: "wow wow",
    products: {
      "322892": {
        quantity: 100,
        description: "Milk, whole, 3.25% milkfat, with added vitamin D",
      },
      "323121": {
        quantity: 300,
        description: "Frankfurter, beef, unheated",
      },
    },
  },
];
