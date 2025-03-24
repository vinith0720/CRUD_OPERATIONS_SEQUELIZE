import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
import configData from "../config/config.json" assert { type: "json" };
const config = configData[env];

const db = {};

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Read all model files and import them
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== path.basename(__filename) && file.endsWith(".js"))
  .forEach(async (file) => {
    const { default: modelImport } = await import(path.join(__dirname, file));
    const model = modelImport(sequelize, DataTypes);
    db[model.name] = model;
  });

// Run associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
