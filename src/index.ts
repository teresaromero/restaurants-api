import app from './app';
import initConfig from './config/indext';

const config = initConfig();

app.listen(config.Port(), () => {
  console.log(`Server is running on ${config.Port()}`);
});
