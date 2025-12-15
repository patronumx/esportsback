const Joi = require('joi');

const teamSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    game: Joi.string().required(),
    region: Joi.string().optional().allow(''),
    logoUrl: Joi.string().uri().optional().allow('')
});

const playerSchema = Joi.object({
    name: Joi.string().required(),
    ign: Joi.string().required(),
    role: Joi.string().required(),
    avatarUrl: Joi.string().uri().optional().allow('')
});

const eventSchema = Joi.object({
    title: Joi.string().required(),
    startTime: Joi.date().required(),
    team: Joi.string().required(), // Team ID
    type: Joi.string().required(),
    location: Joi.string().optional().allow('')
});

const performanceSchema = Joi.object({
    team: Joi.string().required(), // Team ID
    tournamentName: Joi.string().required(),
    placement: Joi.number().integer().required(),
    earnings: Joi.number().min(0).optional(),
    date: Joi.date().required()
});

module.exports = {
    teamSchema,
    playerSchema,
    eventSchema,
    performanceSchema
};
