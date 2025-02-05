import Joi from 'joi';

const UserValidator = {
  get: Joi.object({
    page: Joi.number().integer().min(1).optional(), 
    limit: Joi.number().integer().min(1).optional(), 
    search: Joi.string().optional(), 
  }),
};

export default UserValidator;
