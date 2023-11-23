import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

// host must be as container name (postgres) when app is running within docker
// otherwise 0.0.0.0 if running directly with npm run dev

export const db = new pg.Client({
  user: "yakov",
  host: "postgres",
  // host: '0.0.0.0',
  database: "aboutfood",
  password: "123456",
  port: 5432,
});
// export const db = new pg.Client({
//     connectionString: 'postgres://yakov:123456@localhost:5432/aboutfood',
//     query_timeout: 5000,
//     connectionTimeoutMillis: 5000
//     // user: process.env.PGUSER,
//     // password: process.env.PGPASSWORD,
//     // database: process.env.PGDATABASE,
//     // host: '0.0.0.0',
//     // port: 5432
// })
async function init() {
  await db.connect().then(() => console.log("Ready"));

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100),
        token VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255),
        products JSONB, -- or JSON,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
        REFERENCES users(id)
    );
    `);
  //   console.log("");

  //   await db.query(`
  //     ALTER TABLE menus ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
  //     `);
}

init();

// export const db = new client.Database('db.sqlite3', (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to the chinook database.');
// });
