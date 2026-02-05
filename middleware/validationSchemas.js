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
    name: Joi.string().allow('').optional(),
    ign: Joi.string().required(),
    role: Joi.string().required(),
    avatarUrl: Joi.string().uri().allow('').optional(),
    image: Joi.string().uri().allow('').optional(), // Frontend alias
    email: Joi.string().email().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    uid: Joi.string().allow('').optional(),
    team: Joi.string().allow('').optional(),
    socialLinks: Joi.object({
        instagram: Joi.string().allow('').optional(),
        twitter: Joi.string().allow('').optional(),
        discord: Joi.string().allow('').optional()
    }).optional()
}).unknown(true);

const eventSchema = Joi.object({
    title: Joi.string().required(),
    startTime: Joi.date().required(),
    team: Joi.string().required(), // Team ID
    type: Joi.string().required(),
    location: Joi.string().optional().allow(''),
    totalDays: Joi.number().optional(),
    matchesPerDay: Joi.number().optional(),
    schedule: Joi.array().items(
        Joi.object({
            day: Joi.number().required(),
            date: Joi.alternatives().try(Joi.string(), Joi.date()).optional().allow(''),
            matches: Joi.array().items(
                Joi.object({
                    matchOrder: Joi.number().required(),
                    map: Joi.string().required(),
                    time: Joi.string().optional().allow(''),
                    status: Joi.string().optional()
                })
            ).optional()
        })
    ).optional()
});

const performanceSchema = Joi.object({
    team: Joi.string().required(), // Team ID
    tournamentName: Joi.string().required(),
    placement: Joi.number().integer().required(),
    earnings: Joi.number().min(0).optional(),
    eliminations: Joi.number().integer().min(0).optional(),
    wins: Joi.number().integer().min(0).optional(),
    matchesPlayed: Joi.number().integer().min(0).optional(),
    region: Joi.string().allow('').optional(),
    date: Joi.date().required(),
    playerStats: Joi.array().items(
        Joi.object({
            player: Joi.string().optional(), // Player ID
            ign: Joi.string().required(),
            kills: Joi.number().integer().min(0).default(0),
            assists: Joi.number().integer().min(0).default(0),
            deaths: Joi.number().integer().min(0).default(0),
            matches: Joi.number().integer().min(0).default(0),
            mvpCount: Joi.number().integer().min(0).default(0)
        })
    ).optional()
}).unknown(true);

module.exports = {
    teamSchema,
    playerSchema,
    eventSchema,
    performanceSchema
};
