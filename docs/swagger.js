const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");

const balanceDocs = YAML.load(
  path.join(__dirname, "./swagger-docs/balance.yaml")
);
const adminDocs = YAML.load(path.join(__dirname, "./swagger-docs/admin.yaml"));
const contractDocs = YAML.load(
  path.join(__dirname, "./swagger-docs/contracts.yaml")
);
const jobDocs = YAML.load(path.join(__dirname, "./swagger-docs/job.yaml"));

// Helper to merge deeply
const mergeObjects = (...objects) => {
  return objects.reduce((acc, obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        acc[key] = mergeObjects(acc[key] || {}, obj[key]);
      } else {
        acc[key] = obj[key];
      }
    }
    return acc;
  }, {});
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Deel Backend API Challenge",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3001" }],
    paths: mergeObjects(
      balanceDocs.paths,
      adminDocs.paths,
      contractDocs.paths,
      jobDocs.paths
    ),
    components: mergeObjects(
      balanceDocs.components || {},
      adminDocs.components || {},
      contractDocs.components || {},
      jobDocs.components || {}
    ),
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
