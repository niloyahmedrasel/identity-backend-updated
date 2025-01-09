import Joi from 'joi';

const UserValidator = {
  get: Joi.object({
    page: Joi.number().integer().min(1).optional(), // Example: Validate a "page" query parameter
    limit: Joi.number().integer().min(1).optional(), // Example: Validate a "limit" query parameter
    search: Joi.string().optional(), // Example: Validate a "search" query parameter
  }),
};

export default UserValidator;
