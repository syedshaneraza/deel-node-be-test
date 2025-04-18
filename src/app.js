const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");

const app = express();

app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

// Swagger implemented
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const contractRoutes = require("./routes/contract.route");
const jobRoutes = require("./routes/job.route");
const balanceRoutes = require("./routes/balance.route");
const adminRoutes = require("./routes/admin.route");

app.use("/contracts", contractRoutes);
app.use("/jobs", jobRoutes);
app.use("/balances", balanceRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
