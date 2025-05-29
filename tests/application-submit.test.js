const request = require('supertest');
require('./setup');

const { app, Faculty, Specialty, Benefit, Application } = require('../form_application');

describe('Application Submission', () => {
  beforeEach(() => {
    global.clearMocks();
  });

  describe('POST /submit_application', () => {
    const validApplicationData = {
      first_name: 'Тест',
      middle_name: 'Тестович',
      last_name: 'Тестенко',
      date_of_birth: '2000-01-01',
      home_address: 'вул. Тестова',
      home_street_number: '1',
      home_campus_number: '1',
      home_city: 'Київ',
      home_region: 'Київська',
      phone_number: '+380501234567',
      email: 'test@example.com',
      faculty_name: 1,          // Зверни увагу — це ID, а не назва
      specialty_name: 1,        // теж ID
      benefit_name: 1           // теж ID
    };

    test('повинен успішно створити заявку з валідними даними', async () => {
      // Мокаємо пошук факультету, спеціальності та пільги по ID
      Faculty.findOne.mockResolvedValue({ faculty_id: 1 });
      Specialty.findOne.mockResolvedValue({ specialty_id: 1 });
      Benefit.findOne.mockResolvedValue({ benefit_id: 1 });
      
      // Мокаємо створення заявки
      const newApplication = { ...validApplicationData, application_id: 1 };
      Application.create.mockResolvedValue(newApplication);

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(200);

      expect(response.body).toEqual({ message: 'Заявка успішно подана' });
      
      // Перевіряємо, що моделі були викликані з правильними параметрами за ID
      expect(Faculty.findOne).toHaveBeenCalledWith({ where: { faculty_id: 1 } });
      expect(Specialty.findOne).toHaveBeenCalledWith({ where: { specialty_id: 1 } });
      expect(Benefit.findOne).toHaveBeenCalledWith({ where: { benefit_id: 1 } });
      
      expect(Application.create).toHaveBeenCalledWith({
        first_name: 'Тест',
        middle_name: 'Тестович',
        last_name: 'Тестенко',
        date_of_birth: '2000-01-01',
        home_address: 'вул. Тестова',
        home_street_number: '1',
        home_campus_number: '1',
        home_city: 'Київ',
        home_region: 'Київська',
        phone_number: '+380501234567',
        email: 'test@example.com',
        faculty_id: 1,
        specialty_id: 1,
        benefit_id: 1
      });
    });

    test('повинен повертати помилку якщо факультет не знайдено', async () => {
      Faculty.findOne.mockResolvedValue(null);
      Specialty.findOne.mockResolvedValue({ specialty_id: 1 });
      Benefit.findOne.mockResolvedValue({ benefit_id: 1 });

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(400);

      expect(response.body).toEqual({ 
        error: 'Невірні або відсутні дані для створення заявки.' 
      });
      expect(Application.create).not.toHaveBeenCalled();
    });

    test('повинен повертати помилку якщо спеціальність не знайдено', async () => {
      Faculty.findOne.mockResolvedValue({ faculty_id: 1 });
      Specialty.findOne.mockResolvedValue(null);
      Benefit.findOne.mockResolvedValue({ benefit_id: 1 });

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(400);

      expect(response.body).toEqual({ 
        error: 'Невірні або відсутні дані для створення заявки.' 
      });
      expect(Application.create).not.toHaveBeenCalled();
    });

    test('повинен повертати помилку якщо пільгу не знайдено', async () => {
      Faculty.findOne.mockResolvedValue({ faculty_id: 1 });
      Specialty.findOne.mockResolvedValue({ specialty_id: 1 });
      Benefit.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(400);

      expect(response.body).toEqual({ 
        error: 'Невірні або відсутні дані для створення заявки.' 
      });
      expect(Application.create).not.toHaveBeenCalled();
    });

    test('повинен обробляти помилки бази даних при створенні заявки', async () => {
      Faculty.findOne.mockResolvedValue({ faculty_id: 1 });
      Specialty.findOne.mockResolvedValue({ specialty_id: 1 });
      Benefit.findOne.mockResolvedValue({ benefit_id: 1 });
      Application.create.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(500);

      expect(response.body).toEqual({ error: 'Database connection failed' });
    });

    test('повинен обробляти помилки при пошуку факультету', async () => {
      Faculty.findOne.mockRejectedValue(new Error('Faculty search failed'));

      const response = await request(app)
        .post('/submit_application')
        .send(validApplicationData)
        .expect(500);

      expect(response.body).toEqual({ error: 'Faculty search failed' });
    });

    test('повинен правильно обробляти неповні дані', async () => {
      const incompleteData = {
        first_name: 'Тест',
        faculty_name: undefined,
        specialty_name: undefined,
        benefit_name: undefined
      };

      Faculty.findOne.mockResolvedValue(null);
      Specialty.findOne.mockResolvedValue(null);
      Benefit.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/submit_application')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toEqual({ 
        error: 'Невірні або відсутні дані для створення заявки.' 
      });
    });
  });
});
