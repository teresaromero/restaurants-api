import path from 'path';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

if (process.env.NODE_ENV === 'development') {
  const openapiFile: swaggerUi.JsonObject = YAML.load(
    path.join(__dirname, '../../openapi.yaml'),
  );

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiFile));
}

export default app;
