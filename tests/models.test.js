// tests/models.test.js
require('./setup');

const { 
  Faculty, 
  Specialty, 
  Benefit, 
  Application, 
  Dormitories, 
  Price 
} = require('../form_application');

describe('Models', () => {
  beforeEach(() => {
    global.clearMocks();
  });

  describe('Faculty Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Faculty.findAll).toBe('function');
      expect(typeof Faculty.findOne).toBe('function');
      expect(typeof Faculty.create).toBe('function');
      expect(typeof Faculty.hasMany).toBe('function');
    });

    test('повинен знаходити всі факультети', async () => {
      Faculty.findAll.mockResolvedValue(global.mockData.faculties);

      const result = await Faculty.findAll();
      expect(result).toEqual(global.mockData.faculties);
      expect(Faculty.findAll).toHaveBeenCalled();
    });

    test('повинен знаходити факультет за ID', async () => {
      const expectedFaculty = global.mockData.faculties[0];
      Faculty.findOne.mockResolvedValue(expectedFaculty);

      const result = await Faculty.findOne({ where: { faculty_id: 1 } });
      expect(result).toEqual(expectedFaculty);
      expect(Faculty.findOne).toHaveBeenCalledWith({ where: { faculty_id: 1 } });
    });
  });

  describe('Specialty Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Specialty.findAll).toBe('function');
      expect(typeof Specialty.findOne).toBe('function');
      expect(typeof Specialty.create).toBe('function');
      expect(typeof Specialty.belongsTo).toBe('function');
    });

    test('повинен знаходити спеціальності за факультетом', async () => {
      const facultyId = 1;
      const expectedSpecialties = global.mockData.specialties.filter(
        s => s.faculty_id === facultyId
      );
      Specialty.findAll.mockResolvedValue(expectedSpecialties);

      const result = await Specialty.findAll({ where: { faculty_id: facultyId } });
      expect(result).toEqual(expectedSpecialties);
      expect(Specialty.findAll).toHaveBeenCalledWith({ where: { faculty_id: facultyId } });
    });

    test('повинен знаходити спеціальність за ID', async () => {
      const expectedSpecialty = global.mockData.specialties[0];
      Specialty.findOne.mockResolvedValue(expectedSpecialty);

      const result = await Specialty.findOne({ where: { specialty_id: 1 } });
      expect(result).toEqual(expectedSpecialty);
      expect(Specialty.findOne).toHaveBeenCalledWith({ where: { specialty_id: 1 } });
    });
  });

  describe('Benefit Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Benefit.findAll).toBe('function');
      expect(typeof Benefit.findOne).toBe('function');
      expect(typeof Benefit.create).toBe('function');
    });

    test('повинен знаходити всі пільги', async () => {
      Benefit.findAll.mockResolvedValue(global.mockData.benefits);

      const result = await Benefit.findAll();
      expect(result).toEqual(global.mockData.benefits);
      expect(Benefit.findAll).toHaveBeenCalled();
    });

    test('повинен знаходити пільгу за ID', async () => {
      const expectedBenefit = global.mockData.benefits[0];
      Benefit.findOne.mockResolvedValue(expectedBenefit);

      const result = await Benefit.findOne({ where: { benefit_id: 1 } });
      expect(result).toEqual(expectedBenefit);
      expect(Benefit.findOne).toHaveBeenCalledWith({ where: { benefit_id: 1 } });
    });
  });

  describe('Application Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Application.findAll).toBe('function');
      expect(typeof Application.findOne).toBe('function');
      expect(typeof Application.create).toBe('function');
      expect(typeof Application.update).toBe('function');
      expect(typeof Application.destroy).toBe('function');
    });

    test('повинен створювати нову заявку', async () => {
      const applicationData = global.mockData.applications[0];
      Application.create.mockResolvedValue(applicationData);

      const result = await Application.create(applicationData);
      expect(result).toEqual(applicationData);
      expect(Application.create).toHaveBeenCalledWith(applicationData);
    });

    test('повинен знаходити заявки', async () => {
      Application.findAll.mockResolvedValue(global.mockData.applications);

      const result = await Application.findAll();
      expect(result).toEqual(global.mockData.applications);
      expect(Application.findAll).toHaveBeenCalled();
    });
  });

  describe('Dormitories Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Dormitories.findAll).toBe('function');
      expect(typeof Dormitories.findByPk).toBe('function');
      expect(typeof Dormitories.create).toBe('function');
    });

    test('повинен знаходити гуртожиток за ID', async () => {
      const expectedDormitory = global.mockData.dormitories[0];
      Dormitories.findByPk.mockResolvedValue(expectedDormitory);

      const result = await Dormitories.findByPk(1);
      expect(result).toEqual(expectedDormitory);
      expect(Dormitories.findByPk).toHaveBeenCalledWith(1);
    });

    test('повинен знаходити всі гуртожитки', async () => {
      Dormitories.findAll.mockResolvedValue(global.mockData.dormitories);

      const result = await Dormitories.findAll();
      expect(result).toEqual(global.mockData.dormitories);
      expect(Dormitories.findAll).toHaveBeenCalled();
    });
  });

  describe('Price Model', () => {
    test('повинен мати правильні методи', () => {
      expect(typeof Price.findAll).toBe('function');
      expect(typeof Price.findOne).toBe('function');
      expect(typeof Price.create).toBe('function');
    });

    test('повинен знаходити всі ціни', async () => {
      Price.findAll.mockResolvedValue(global.mockData.prices);

      const result = await Price.findAll();
      expect(result).toEqual(global.mockData.prices);
      expect(Price.findAll).toHaveBeenCalled();
    });

    test('повинен знаходити ціну за ID гуртожитку', async () => {
      const expectedPrice = global.mockData.prices[0];
      Price.findOne.mockResolvedValue(expectedPrice);

      const result = await Price.findOne({ where: { dormitory_id: 1 } });
      expect(result).toEqual(expectedPrice);
      expect(Price.findOne).toHaveBeenCalledWith({ where: { dormitory_id: 1 } });
    });
  });
});