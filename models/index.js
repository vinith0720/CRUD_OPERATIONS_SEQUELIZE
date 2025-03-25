import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load database configuration
const env = process.env.NODE_ENV || "development";
const configData = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/config.json"), "utf8"));
const config = configData[env];

const db = {};

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

  const loadModels = async () => {
    const files = fs.readdirSync(__dirname).filter(
      (file) => file.indexOf(".") !== 0 && file !== path.basename(__filename) && file.endsWith(".js")
    );
  
    for (const file of files) {
      const modulePath = pathToFileURL(path.join(__dirname, file)).href;
      const { default: modelImport } = await import(modulePath);
      const model = modelImport(sequelize, DataTypes);
      db[model.name] = model; 
    }
  
    // Run associations
    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  
    console.log("Loaded models:", Object.keys(db)); 
  };
  
await loadModels();
  


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
