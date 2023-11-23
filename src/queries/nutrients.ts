import {db} from "database/repository";
import {Menu} from "entities/menu";
import {Nutrient, NutrientForProductCreation} from "entities/nutrients";
import {nutrientCodeToNormValue} from "constants/nutrientNorms";

const addAmountMapper = (row: NutrientForProductCreation) => ({
    ...row,
    amount: 0
})

export async function getNutrients({haveNorms}: { haveNorms: boolean }) {

    let query = `
    SELECT n.id, n.name, unit_name, group_id, ng.name as group_name FROM nutrient n
    LEFT JOIN nutrient_group ng ON n.group_id = ng.id
      `;

    if(haveNorms){
        const availableNorms = Object.keys(nutrientCodeToNormValue).map(key => +key)
        query += ` WHERE n.id IN (${availableNorms})`
    }

    const {rows} = await db.query<NutrientForProductCreation>(query);
    return rows.map(addAmountMapper)
}
