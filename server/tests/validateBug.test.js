const validateBug = require('../utils/validateBug');

describe('validateBug', () => {
  it('should validate a correct bug object', () => {
    const data = { title: 'Bug 1', description: 'A bug', status: 'open' };
    const { isValid, errors } = validateBug(data);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('should return error for missing title', () => {
    const data = { description: 'A bug', status: 'open' };
    const { isValid, errors } = validateBug(data);
    expect(isValid).toBe(false);
    expect(errors.title).toBeDefined();
  });

  it('should return error for invalid status', () => {
    const data = { title: 'Bug', description: 'A bug', status: 'invalid' };
    const { isValid, errors } = validateBug(data);
    expect(isValid).toBe(false);
    expect(errors.status).toBeDefined();
  });
});
