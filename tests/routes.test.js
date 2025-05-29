const request = require('supertest');
require('./setup'); // Імпортуємо налаштування

// Імпортуємо додаток після налаштування моків
const { app } = require('../form_application');

// Мокаємо console.error щоб не засмічувати виведення тестів
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('API Routes', () => {
  beforeEach(() => {
    global.clearMocks();
    console.error.mockClear(); // Очищуємо моки console.error
  });

  describe('GET /fetch-select-data/faculties', () => {
    test('повинен повертати список факультетів', async () => {
      // Мокаємо Faculty.findAll
      const Faculty = require('../form_application').Faculty;
      Faculty.findAll.mockResolvedValue(global.mockData.faculties);

      const response = await request(app)
        .get('/fetch-select-data/faculties')
        .expect(200);

      expect(response.body).toEqual(global.mockData.faculties);
      expect(Faculty.findAll).toHaveBeenCalledWith({ 
        attributes: ['faculty_id', 'name'] 
      });
    });

    test('повинен обробляти помилки', async () => {
      const Faculty = require('../form_application').Faculty;
      Faculty.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/fetch-select-data/faculties')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /fetch-select-data/specialties/:facultyId', () => {
    test('повинен повертати спеціальності для конкретного факультету', async () => {
      const facultyId = 1;
      const expectedSpecialties = global.mockData.specialties.filter(
        s => s.faculty_id === facultyId
      );

      const Specialty = require('../form_application').Specialty;
      Specialty.findAll.mockResolvedValue(expectedSpecialties);

      const response = await request(app)
        .get(`/fetch-select-data/specialties/${facultyId}`)
        .expect(200);

      expect(response.body).toEqual(expectedSpecialties);
      expect(Specialty.findAll).toHaveBeenCalledWith({
        where: { faculty_id: facultyId.toString() },
        attributes: ['specialty_id', 'name']
      });
    });

    test('повинен обробляти помилки при отриманні спеціальностей', async () => {
      const Specialty = require('../form_application').Specialty;
      Specialty.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/fetch-select-data/specialties/1')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /fetch-select-data/benefits', () => {
    test('повинен повертати список пільг', async () => {
      const Benefit = require('../form_application').Benefit;
      Benefit.findAll.mockResolvedValue(global.mockData.benefits);

      const response = await request(app)
        .get('/fetch-select-data/benefits')
        .expect(200);

      expect(response.body).toEqual(global.mockData.benefits);
      expect(Benefit.findAll).toHaveBeenCalledWith({ 
        attributes: ['benefit_id', 'name'] 
      });
    });

    test('повинен обробляти помилки при отриманні пільг', async () => {
      const Benefit = require('../form_application').Benefit;
      Benefit.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/fetch-select-data/benefits')
        .expect(500);

      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

  describe('GET /dormitories/:id', () => {
    test('повинен повертати інформацію про гуртожиток', async () => {
      const dormitoryId = 1;
      const expectedDormitory = global.mockData.dormitories[0];

      const Dormitories = require('../form_application').Dormitories;
      Dormitories.findByPk.mockResolvedValue(expectedDormitory);

      const response = await request(app)
        .get(`/dormitories/${dormitoryId}`)
        .expect(200);

      expect(response.body).toEqual({
        name: expectedDormitory.name,
        address: expectedDormitory.address,
        phone_number: expectedDormitory.phone_number,
        type_residents: expectedDormitory.type_residents
      });
      expect(Dormitories.findByPk).toHaveBeenCalledWith(dormitoryId.toString());
    });

    test('повинен повертати 404 якщо гуртожиток не знайдено', async () => {
      const Dormitories = require('../form_application').Dormitories;
      Dormitories.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/dormitories/999')
        .expect(404);

      expect(response.body).toEqual({ error: 'Гуртожиток не знайдено' });
    });

    test('повинен обробляти помилки сервера', async () => {
      const Dormitories = require('../form_application').Dormitories;
      Dormitories.findByPk.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/dormitories/1')
        .expect(500);

      expect(response.text).toBe('Помилка сервера');
      // Перевіряємо що console.error був викликаний
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('GET /prices', () => {
    test('повинен повертати список цін', async () => {
      const Price = require('../form_application').Price;
      Price.findAll.mockResolvedValue(global.mockData.prices);

      const response = await request(app)
        .get('/prices')
        .expect(200);

      expect(response.body).toEqual(global.mockData.prices);
      expect(Price.findAll).toHaveBeenCalled();
    });

    test('повинен обробляти помилки при отриманні цін', async () => {
      const Price = require('../form_application').Price;
      Price.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/prices')
        .expect(500);

      expect(response.text).toBe('Помилка сервера');
      // Перевіряємо що console.error був викликаний
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
