import rateLimit from 'express-rate-limit';

export const tigLimiter = rateLimit({
    windowMs : 1 * 60 *1000,
    max: 3,
    message:{
        status: "error",
        codigo: "SOBRECALENTAMIENTO",
        mensaje: " La maquina TIG requiere enfriameinto, Superaste el limite de tres"
    },
    standarHeaders : true,
    legacyHeaders: false
});