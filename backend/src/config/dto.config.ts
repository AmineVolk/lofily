import { ValidationPipeOptions } from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  skipMissingProperties: true,
  skipNullProperties: true,
  skipUndefinedProperties: true,
};

export const dtoValidationRules = {
  // Règles communes pour les IDs
  id: {
    min: 1,
    message: 'ID doit être un nombre positif',
  },

  // Règles communes pour les emails
  email: {
    message: 'Format email invalide',
  },

  // Règles communes pour les mots de passe
  password: {
    minLength: 6,
    message: 'Mot de passe doit contenir au moins 6 caractères',
  },

  // Règles communes pour les chaînes
  string: {
    message: 'Doit être une chaîne de caractères',
  },

  // Règles communes pour les nombres
  number: {
    message: 'Doit être un nombre',
  },
};
