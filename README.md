Aquí tienes una plantilla de documentación para tu proyecto de galería de fotos con Node.js, AWS EC2 y S3. Puedes copiar y pegar esto en un archivo `README.md` en tu repositorio de GitHub.

---

# Galería de Fotos con Node.js, AWS EC2 y S3

Este proyecto es una galería de fotos simple construida con Node.js, desplegada en AWS EC2 y utilizando Amazon S3 para el almacenamiento de imágenes.

## Características

- Subida de imágenes a Amazon S3.
- Visualización de imágenes almacenadas en S3.
- Despliegue en una instancia EC2 de AWS.
- Uso de PM2 para la gestión de procesos en producción.

## Requisitos

- Node.js (v14 o superior)
- Cuenta de AWS con acceso a EC2 y S3
- Git

## Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/photo-gallery.git
cd photo-gallery
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
AWS_ACCESS_KEY=TU_ACCESS_KEY
AWS_SECRET_KEY=TU_SECRET_KEY
AWS_REGION=tu-region
S3_BUCKET=nombre-tu-bucket
PORT=3000
```

### 4. Configura AWS S3

1. Crea un bucket en S3.
2. Configura las políticas de CORS del bucket:
   ```xml
   <CORSConfiguration>
     <CORSRule>
       <AllowedOrigin>*</AllowedOrigin>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedMethod>POST</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
     </CORSRule>
   </CORSConfiguration>
   ```

### 5. Ejecuta la aplicación en desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en AWS EC2

### 1. Conéctate a tu instancia EC2

```bash
ssh -i "tu-key.pem" ec2-user@tu-ip-publica
```

### 2. Instala Node.js y Git

```bash
sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs git
```

### 3. Clona el repositorio en EC2

```bash
git clone https://github.com/tu-usuario/photo-gallery.git
cd photo-gallery
```

### 4. Instala las dependencias

```bash
npm install
```

### 5. Configura PM2 para la gestión de procesos

```bash
sudo npm install pm2 -g
pm2 start app.js
pm2 save
pm2 startup
```

### 6. Abre el puerto en el Security Group de EC2

Asegúrate de que el puerto 3000 esté abierto en el Security Group de tu instancia EC2.

### 7. Accede a la aplicación

La aplicación estará disponible en:
```
http://<tu-ip-publica>:3000
```

## Uso

### Subir una imagen

1. Accede a la aplicación.
2. Selecciona una imagen y haz clic en "Subir".
3. La imagen se almacenará en tu bucket de S3.

### Ver imágenes subidas

1. Accede a la ruta `/photos` para ver una lista de las imágenes almacenadas en S3.

## Estructura del Proyecto

```
photo-gallery/
  ├── .env
  ├── app.js
  ├── views/
  │    └── index.html
  ├── package.json
  └── README.md
```

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Preguntas Frecuentes

### ¿Cómo puedo configurar HTTPS?

Puedes usar Nginx como proxy inverso o configurar un Application Load Balancer (ALB) en AWS para manejar HTTPS.

### ¿Cómo reinicio la aplicación después de un cambio?

Si estás usando PM2, simplemente ejecuta:
```bash
pm2 restart app
```

### ¿Cómo actualizo el código en EC2?

Conéctate a tu instancia EC2 y ejecuta:
```bash
cd /ruta/a/tu/proyecto
git pull origin main
pm2 restart app
```

---

¡Gracias por usar este proyecto! Si tienes alguna pregunta, no dudes en abrir un issue en GitHub. 😊

---

Puedes personalizar esta documentación según tus necesidades. ¡Espero que te sea útil! 🚀
