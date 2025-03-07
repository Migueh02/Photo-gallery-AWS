require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Servir archivos estáticos
app.use(express.static('views'));

// Rutas de la API
app.use('/api/users', userRoutes);
app.post('/upload', upload.single('photo'), uploadPhoto);
app.get('/photos', listPhotos);

// Funciones para manejar fotos
async function uploadPhoto(req, res) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer
  };
  
  try {
    await s3.upload(params).promise();
    res.redirect('/');
  } catch (err) {
    res.status(500).send(err);
  }
}

async function listPhotos(req, res) {
  try {
    const data = await s3.listObjectsV2({
      Bucket: process.env.S3_BUCKET
    }).promise();
    
    const photos = data.Contents.map(photo => {
      return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${photo.Key}`;
    });
    
    res.json(photos);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Sincronizar base de datos y iniciar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });