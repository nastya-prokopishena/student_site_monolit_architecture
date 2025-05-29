
// Встановлюємо тестове середовище
process.env.NODE_ENV = 'test';

// Створюємо мок для Sequelize щоб не підключатися до реальної БД
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  
  return {
    ...actualSequelize,
    Sequelize: jest.fn().mockImplementation(() => ({
      authenticate: jest.fn().mockResolvedValue(true),
      define: jest.fn().mockImplementation((name, attributes, options) => {
        // Повертаємо мок моделі
        const mockModel = {
          findAll: jest.fn(),
          findOne: jest.fn(),
          findByPk: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
          hasMany: jest.fn(),
          belongsTo: jest.fn()
        };
        return mockModel;
      }),
      sync: jest.fn().mockResolvedValue(true)
    }))
  };
});

// Глобальні мок дані для тестів
global.mockData = {
  faculties: [
    { faculty_id: 1, name: 'Інформаційних технологій' },
    { faculty_id: 2, name: 'Економічний' }
  ],
  specialties: [
    { specialty_id: 1, name: 'Комп\'ютерні науки', faculty_id: 1 },
    { specialty_id: 2, name: 'Інженерія програмного забезпечення', faculty_id: 1 },
    { specialty_id: 3, name: 'Економіка', faculty_id: 2 }
  ],
  benefits: [
    { benefit_id: 1, name: 'Пільги для сиріт' },
    { benefit_id: 2, name: 'Пільги для малозабезпечених' }
  ],
  applications: [
    {
      application_id: 1,
      first_name: 'Іван',
      middle_name: 'Іванович',
      last_name: 'Іваненко',
      date_of_birth: '2000-01-01',
      home_address: 'вул. Тестова',
      home_city: 'Київ',
      home_region: 'Київська',
      home_street_number: '1',
      home_campus_number: '1',
      phone_number: '+380501234567',
      email: 'test@example.com',
      faculty_id: 1,
      specialty_id: 1,
      benefit_id: 1
    }
  ],
  dormitories: [
    {
      dormitory_id: 1,
      name: 'Гуртожиток №1',
      address: 'вул. Студентська, 1',
      phone_number: '+380441234567',
      superintendent_id: 1,
      floor_amount: 5,
      type_residents: 'Студенти'
    }
  ],
  prices: [
    {
      price_id: 1,
      price_amount: 1500.00,
      dormitory_id: 1
    }
  ]
};

global.clearMocks = () => {
  jest.clearAllMocks();
};
