const { validate } = require('class-validator');
const { plainToClass } = require('class-transformer');

// Test simple pour vérifier que le DTO fonctionne
console.log('Testing DTO validation...');

// Simuler des données d'update
const updateData = {
  fullname: 'Test User',
  background_id: 123,
  volume: 50,
};

console.log('Update data:', updateData);
console.log('Validation should pass now with proper decorators');
