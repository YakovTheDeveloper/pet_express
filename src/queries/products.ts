import {db} from "database/repository";
import {nutrientCodeToNormValue} from "constants/nutrientNorms";
import {
    ProductCreate,
    ProductMinimal,
    productSchemaUpdate,
    ProductUpdate,
    ProductWithNutrients
} from "entities/product";
import {getKeyChanges} from "utils/getKeyChanges";
import {Nutrient} from "entities/nutrients";

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

const normalizeDescription = (row: { description: string }) => {
    const [name, ...description] = row.description
        .split(",")
        .map((v) => v.trim());
    return {
        ...row,
        name,
        description,
    };
}

const createIdToContentMapping = (
    data: ProductWithNutrients[],
    idKey = "id"
) => {
    const mapping = {};
    data.forEach((row) => {
        const {
            nutrient_id,
            nutrient_name,
            amount,
            unit_name,
            nutrient_nbr,
            group_name,
        } = row;
        const nutrient = {
            id: nutrient_id,
            name: nutrient_name,
            amount,
            unit: unit_name,
            code: nutrient_nbr,
            group_name,
        };
        const rowId = row[idKey];
        if (rowId in mapping) {
            mapping[rowId].nutrients.push(nutrient);
            return;
        }
        const [name, ...description] = row.description
            .split(",")
            .map((v) => v.trim());
        const {id} = row;

        mapping[rowId] = {
            id,
            name,
            description,
            nutrients: [nutrient],
        };
    });
    return mapping;
};

export async function getProductsMinimalData(cleanParams) {
    const {name} = cleanParams;
    const filters: string[] = [];
    let filterQuery = "";

    if (name) {
        filters.push(`description ILIKE '%${name}%'`);
    }

    if (filters.length > 0) {
        filterQuery = "WHERE " + filters.join(" AND ");
    }

    const sql = `
    SELECT fdc_id as id, description FROM food ${filterQuery}`;

    const {rows} = await db.query<ProductMinimal>(sql);

    return rows.map(normalizeData);
}

export async function getProductWithNutrients(cleanParams: { foodId: string }) {
    const {foodId} = cleanParams;
    const data: string[][] = [];
    if (foodId != null) data.push(foodId.split(","));
    const sql = `
      SELECT f.description, f.fdc_id as id, fn.nutrient_id, n.name as nutrient_name, n.nutrient_nbr, fn.amount, n.unit_name, ng.name as group_name
      FROM food_nutrient fn
      JOIN nutrient n ON fn.nutrient_id = n.id
      JOIN food f on fn.fdc_id = f.fdc_id
      LEFT JOIN nutrient_group ng on n.group_id = ng.id
      WHERE fn.amount != 0 
      AND fn.fdc_id = ANY($1)
      AND n.name NOT ILIKE '%added%' AND n.name NOT ILIKE '%intrinsic%';
  `;

    const {rows} = await db.query<ProductWithNutrients>(sql, data);

    const idToContentMapping = createIdToContentMapping(rows);

    return idToContentMapping;
}

export async function getRichProducts(cleanParams: { nutrientId: string }, userId: string | null) {
    const {nutrientId} = cleanParams;

    const defaultNorm = nutrientCodeToNormValue[nutrientId]
    if (!defaultNorm) throw new Error('No default norm for that nutrient code')

    let finalQuery = 'AND f.user_id is NULL'

    if(userId != null) finalQuery = `AND (f.user_id IS NULL OR f.user_id = ${userId})`

    const richnessCoefficient = defaultNorm * 0.05
    const data = [nutrientId, richnessCoefficient]

    const sql = `
        SELECT f.fdc_id as id, description, fn.amount as quantity
        FROM food as f
        JOIN food_nutrient fn ON f.fdc_id = fn.fdc_id
        WHERE fn.nutrient_id = $1 AND fn.amount >= $2 ${finalQuery}
        ORDER BY fn.amount DESC;
  `;
    const {rows} = await db.query<ProductWithNutrients>(sql, data);
    return rows.map(normalizeDescription)
}

export async function getProducts() {
    const sql = `
      SELECT fdc_id as id, description FROM food`;

    const {rows} = await db.query<ProductMinimal>(sql);

    const normalized = rows.map(normalizeData);

    const mapping = {};

    for (const product of normalized) {
        mapping[product.id] = product.name;
    }

    return mapping;
}


export async function createProduct(userId: string, {name, description, category, nutrients}: ProductCreate) {
    const data = [name + ', ' + description, 'custom', userId]
    const queryProduct = `
      INSERT INTO food (description, data_type, user_id) VALUES ($1,$2, $3) RETURNING description, fdc_id as id;`;

    const {rows} = await db.query<any>(queryProduct, data);
    const normalized = rows.map(normalizeData);
    const foodId = normalized[0].id

    const nutrientData: any[][] = Object.entries(nutrients).map(([id, quantity]) => {
        return [foodId, +id, quantity];
    });
    const values = nutrientData.map((data, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(',');

    const queryNutrients = `
      INSERT INTO food_nutrient (fdc_id, nutrient_id, amount)
      VALUES ${values}
      RETURNING *;
    `;

    const flatNutrientData = nutrientData.flat()

    await db.query<any>(queryNutrients, flatNutrientData);
    return {
        id: foodId,
        name,
        description,
        category,
        nutrients
    }
}

export async function deleteProduct(userId: string, productId: string) {
    const data = [userId, productId]

    const query = `
    DELETE FROM food WHERE user_id=$1 AND fdc_id=$2 AND data_type='custom'
    RETURNING *;
      `;
    const {rows} = await db.query<any>(query, data);
    if (rows.length === 0) throw new Error('Nothing to delete')
    return rows[0]
}


export async function patchProductNutrients(userId: string, productId: string, {
    nutrients
}: ProductUpdate) {
    if (!nutrients) return null
    const promises: Iterable<PromiseLike<any>> = []

    const getProductData = [productId, userId]
    const getProduct = `
      SELECT * FROM food f
      JOIN food_nutrient fn ON f.fdc_id = fn.fdc_id
      WHERE f.fdc_id = $1 AND f.data_type='custom' AND f.user_id=$2;
      `;
    const {rows: productNutrientRows} = await db.query<any>(getProduct, getProductData);


    const oldNutrientsMapping = createCodeToAmountMapping(productNutrientRows)
    const changes = getKeyChanges(oldNutrientsMapping, nutrients)

    const deletedProductNutrientsData = [productId, changes.deletedKeys]
    const queryDeleteProductNutrients = `
            DELETE FROM food_nutrient
            WHERE fdc_id = $1 AND nutrient_id = ANY($2::int[]);
        `;

    //todo make it more safety for sql injection

    const caseStatements = changes.changedKeys.map(({key, value}) => {
        return `WHEN ${key} THEN ${value}::real`;
    }).join('\n');
    const ids = changes.changedKeys.map(d => d.key);

    const updatedProductNutrientsData = [productId, ids]
    const queryUpdateProductNutrients = `
              UPDATE food_nutrient
              SET amount = 
              CASE nutrient_id
                ${caseStatements}
              END
              WHERE fdc_id = $1 AND nutrient_id = ANY($2::int[]);
    `;

    const placeholders = changes.addedKeys.map((data, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(',');
    const productNutrientsData: any[][] = changes.addedKeys.map(({key, value}) => {
        return [productId, +key, value];
    }).flat();

    const queryAddProductNutrients = `
              INSERT INTO food_nutrient (fdc_id, nutrient_id, amount)
              VALUES ${placeholders}
              RETURNING *;
        `;

    const result: Record<string, any[]> = {}

    if (changes.changedKeys.length > 0) {
        promises.push(
            db.query<any>(queryUpdateProductNutrients, updatedProductNutrientsData)
        )
        result.updated = changes.changedKeys
    }

    if (changes.addedKeys.length > 0) {
        promises.push(
            db.query<any>(queryAddProductNutrients, productNutrientsData)
        )
        result.added = changes.addedKeys
    }

    if (changes.deletedKeys.length > 0) {

        promises.push(
            db.query<any>(queryDeleteProductNutrients, deletedProductNutrientsData)
        )
        result.deleted = changes.deletedKeys
    }

    await Promise.all(promises)

    return result
}

export async function patchProduct(userId: string, productId: string, {name, description}: ProductUpdate) {
    if (!name && !description) {
        return null
    }
    const newProductData = [`${name}, ${description}`, +productId, userId]

    const updateProductDescription = `
          UPDATE food
          SET
              description = COALESCE($1, description)
          WHERE
              fdc_id = $2 AND user_id = $3 AND data_type = 'custom'
           RETURNING fdc_id,description;`;
    const {rows} =
        await db.query<any>(updateProductDescription, newProductData)
    return rows[0]

}

function createCodeToAmountMapping(rows: { code: string, amount: number, nutrient_id: string }[]) {
    const mapping: Record<string, number> = {}
    for (const {nutrient_id, amount} of rows) {
        mapping[nutrient_id] = amount
    }
    return mapping
}