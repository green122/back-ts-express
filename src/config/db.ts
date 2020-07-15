import mongoose from "mongoose";
import {Sequelize} from "sequelize";
import * as path from "path";
import CONFIG from "./config";
import {Pool} from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shop',
  port: 5432
});
mongoose.set("useCreateIndex", true);

export const sequelize = new Sequelize('shop', 'postgres', '', {dialect: 'postgres'});

console.log(path.resolve(__dirname, './test.db'));

// Connecting to the database
export default (async () => {
  try {
    // const {rows} = await pool.query('' +
    //   `SELECT *  FROM categories
    //             LEFT JOIN category_variation ON categories.id = category_variation.category_id
    //             LEFT JOIN variations ON category_variation.category_id = variations.id
    //             `);
    // rows.forEach(v => console.log(v));
    // listen for requests
    console.log("The Conection is Ok");
  } catch (err) {
    console.log(`${err} Could not Connect to the Database. Exiting Now...`);
    process.exit();
  }
})();
