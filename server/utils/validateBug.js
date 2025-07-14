const validateBug = (data) => {
  const errors = {};
  if (!data.title || typeof data.title !== 'string') {
    errors.title = 'Title is required and must be a string.';
  }
  if (!data.description || typeof data.description !== 'string') {
    errors.description = 'Description is required and must be a string.';
  }
  if (data.status && !['open', 'in-progress', 'resolved', 'complete', 'closed'].includes(data.status)) {
    errors.status = 'Invalid status value.';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = validateBug;
