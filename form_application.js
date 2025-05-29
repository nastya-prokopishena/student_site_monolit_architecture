const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'static')));

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  dialect: 'postgres',
  host: 'localhost',
  
});

// Опис моделей
const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'faculties', freezeTableName: true,  timestamps: false });

const Specialty = sequelize.define('Specialty', {
  specialty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  faculty_id: DataTypes.INTEGER, 
}, { tableName: 'specialties', freezeTableName: true, timestamps: false });

const Benefit = sequelize.define('Benefit', {
  benefit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'benefits', freezeTableName: true, timestamps: false });


Faculty.hasMany(Specialty, { foreignKey: 'faculty_id' });
Specialty.belongsTo(Faculty, { foreignKey: 'faculty_id' });


const Application = sequelize.define(
  'Application',
  {
    application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    home_address: DataTypes.STRING,
    home_city: DataTypes.STRING, 
    home_region: DataTypes.STRING,
    home_street_number: DataTypes.STRING,
    home_campus_number: DataTypes.STRING, 
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    faculty_id: DataTypes.INTEGER,
    specialty_id: DataTypes.INTEGER,
    benefit_id: DataTypes.INTEGER,
    
  },
  {
    tableName: 'Applications',
    timestamps: true, // Встановіть як true, щоб увімкнути createdAt та updatedAt
  }
);

const Dormitories = sequelize.define('Dormitories', {
    dormitory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    superintendent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    floor_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_residents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  
  },
  {
    tableName: 'dormitories',
    timestamps: false
  }
  );

const Price = sequelize.define('Price', {
    price_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    dormitory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'price',
    timestamps: false
  }
);

// Роути для отримання даних та обробки заявок
app.get('/fetch-select-data/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.findAll({ attributes: ['faculty_id', 'name'] });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fetch-select-data/specialties/:facultyId', async (req, res) => {
  const facultyId = req.params.facultyId;

  try {
    const specialties = await Specialty.findAll({
      where: { faculty_id: facultyId },
      attributes: ['specialty_id', 'name'] // Вибирайте лише існуючі поля
    });
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/fetch-select-data/benefits', async (req, res) => {
  try {
    const benefits = await Benefit.findAll({ attributes: ['benefit_id', 'name'] });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit_application', async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_name,
      specialty_name,
      benefit_name,
    } = req.body;


    // Отримання відповідних ID з бази даних за обраними назвами
    const faculty = await Faculty.findOne({ where: { faculty_id: faculty_name } });
    const specialty = await Specialty.findOne({ where: { specialty_id: specialty_name } });
    const benefit = await Benefit.findOne({ where: { benefit_id: benefit_name } });

    const faculty_id = faculty ? faculty.faculty_id : null;
    const specialty_id = specialty ? specialty.specialty_id : null;
    const benefit_id = benefit ? benefit.benefit_id : null;

    if (!faculty_id || !specialty_id || !benefit_id) {
      return res.status(400).json({ error: 'Невірні або відсутні дані для створення заявки.' });
    }

    // Створення нової заявки з отриманими ID
    const newApplication = await Application.create({
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_id,
      specialty_id,
      benefit_id,
    });

    res.json({ message: 'Заявка успішно подана' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/dormitories/:id', async (req, res) => {
  const dormitoryId = req.params.id;

  try {
    const dormitory = await Dormitories.findByPk(dormitoryId);

    if (!dormitory) {
      return res.status(404).json({ error: 'Гуртожиток не знайдено' });
    }

    // Приклад відправки даних назад на клієнт
    res.json({
      name: dormitory.name,
      address: dormitory.address,
      phone_number: dormitory.phone_number,
      type_residents: dormitory.type_residents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка сервера');
  }
});


app.get('/prices', async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка сервера');
  }
});

// Підключення до бази даних та запуск сервера
if (process.env.NODE_ENV !== 'test') {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection established');
      app.listen(5500, () => {
        console.log('Server running on port 5500');
      });
    })
    .catch(err => {
      console.error('Database connection failed:', err);
    });
}

module.exports = {
  app,
  sequelize,
  Faculty,
  Specialty,
  Benefit,
  Application,
  Dormitories,
  Price
};
