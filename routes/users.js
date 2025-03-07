const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const upload = multer({ storage: multer.memoryStorage() });

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo usuario con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        let imagenUrl = null;
        
        if (req.file) {
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `usuarios/${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            const uploadResult = await s3.upload(params).promise();
            imagenUrl = uploadResult.Location;
        }

        const userData = {
            nombre: req.body.nombre,
            email: req.body.email,
            imagen: imagenUrl
        };

        const user = await User.create(userData);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error completo:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 