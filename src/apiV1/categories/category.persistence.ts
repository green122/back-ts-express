import "reflect-metadata";

import {ICategory} from "./category.controller";
import {pool, sequelize} from "../../config/db";
import {groupBy, KeyMap} from "../../helpers/groupBy";
import { injectable } from "inversify";

interface IRawPrice {
  categoryId: number;
  variationId: number;
  optionId: number;
  price: number;
}

interface DataRow extends Record<string, any> {
  id: number,
  categoryname: string,
  variationname: string,
  variationid: number,
  optionid: number,
  optionname: string,
  price: number
}

const keyMap: KeyMap<DataRow> = {
  groupKey: 'id',
  fields: [['categoryname', 'categoryName']],
  oneToOne: true,
  nested: {
    groupKey: 'variationid',
    fields: [['variationid', 'id'], ['variationname', 'variation']],
    groupName: 'variations',
    nested: {
      groupKey: 'optionid',
      fields: [['optionid', 'id'], ['optionname', 'name'], 'price'],
      groupName: 'options'
    }
  }
}

@injectable()
export class CategoryPersistence {

  public async findCategoryById(categoryId: string) {

    const {rows} = await pool.query(`SELECT categories.id AS id,
        categories.name AS categoryName,
        variations.variation AS variationName,
        variations.id AS variationId,
        options.id AS optionId,
        options.name AS optionName,
        prices.price AS price
        FROM categories
        LEFT JOIN category_variations ON categories.id = category_variations.category_id
        LEFT JOIN variations ON category_variations.variation_id = variations.id
        LEFT JOIN options_variations ON options_variations.variation_id = variations.id
        LEFT JOIN options ON options_variations.option_id = options.id
        LEFT JOIN prices ON prices.category_id = categories.id AND prices.variation_id = variations.id AND prices.option_id = options.id

        WHERE categories.id = $1
      `, [categoryId])


    const groupByCategoryId = groupBy(rows as DataRow[], keyMap) as {categories: ICategory[]};
    return groupByCategoryId;
  }

}



