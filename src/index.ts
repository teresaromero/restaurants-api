import app from './app';
import initConfig from './config';

const config = initConfig();

app.listen(config.Port(), () => {
  console.log(`Server is running on ${config.Port()}`);
});
