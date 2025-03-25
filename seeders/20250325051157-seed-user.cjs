'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
      await queryInterface.bulkInsert('User',
        [
          {
            name: "John Doe",
            email: "john@example.com",
            age: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Jane Smith",
            email: "jane@example.com",
            age: 32,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Alice Johnson",
            email: "alice@example.com",
            age: 24,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      {});
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
