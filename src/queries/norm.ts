import {db} from "database/repository";
import {Norm, NormCreate} from "entities/norm";

export async function getNorm(userId: string) {
    const data = [userId];
    const query = `
    SELECT * FROM users_norms WHERE user_id = $1
      `;

    const {rows} = await db.query<Norm>(query, data);
    return rows
}

export async function createNorm(userId, {norm, name}: NormCreate) {
    const data = [userId, name, JSON.stringify(norm)];
    const query = `
    INSERT INTO users_norms (user_id, name,norm) VALUES ($1,$2,$3)
    RETURNING *;
      `;

    const {rows} = await db.query<Norm>(query, data);
    return rows
}

export async function deleteNorm(userId: string, normId: string) {
    const data = [userId, normId];
    const query = `
    DELETE FROM users_norms WHERE user_id=$1 AND id=$2
    RETURNING *;
      `;

    const {rows} = await db.query<Norm>(query, data);
    return rows
}

export async function updateNorm(userId: string, normId: string, {norm, name}: NormCreate) {
    const data = [userId, normId, name, norm];
    const query = `
        UPDATE users_norms
        SET
            name = COALESCE($3, name),
            norm = COALESCE($4, norm)
        WHERE
        user_id = $1 AND id = $2 
        RETURNING id,name,norm;
      `;

    const {rows} = await db.query<Norm>(query, data);
    return rows
}