import app from './app';
import config from './config';

(async () => {
  const cfg = config();

  try {
    const server = await app(cfg);
    server.listen(cfg.PORT, () => {
      console.log(`Server is running on ${cfg.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
