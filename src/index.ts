import app from './app';
import config from './config';

const cfg = config();
app.listen(cfg.PORT, () => {
  console.log(`Server is running on ${cfg.PORT}`);
});
