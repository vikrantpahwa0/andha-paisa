Migrations Mechanism : 
npx sequelize-cli migration:generate --name create-all-survey-tables
npx sequelize-cli db:migrate --config migrations/config.js
Change the file to match the format - use export default syntax