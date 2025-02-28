require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Configura rutas
app.use(express.static('views'));
app.post('/upload', upload.single('photo'), uploadPhoto);
app.get('/photos', listPhotos);

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

// Configura HTTPS
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Configura rutas
app.get('/', (req, res) => {
  res.send('¡Hola, mundo seguro!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));