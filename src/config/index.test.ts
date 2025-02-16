import config from '.';

describe('Config', () => {
  it('should return default value when no env found', () => {
    expect(process.env.PORT).toBeUndefined();
    const cfg = config();
    expect(cfg.PORT).toBe('3000');
  });
  it('should return environment value when set', () => {
    expect(process.env.PORT).toBeUndefined();
    process.env.PORT = '4000';
    expect(process.env.PORT).toBe('4000');

    const cfg = config();
    expect(cfg.PORT).toBe('4000');

    delete process.env.PORT;
  });
});
