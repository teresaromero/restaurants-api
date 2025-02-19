import app from './app';
import config from './config';

(async () => {
  try {
    const cfg = config();
    const server = await app(cfg);
    server.listen(cfg.PORT, () => {
      console.log(`Server is running on ${cfg.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
