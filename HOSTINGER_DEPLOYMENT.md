# 🚀 Despliegue en Hostinger - Impostor App

## Opciones de Hosting en Hostinger

### 1. **Hosting Web (Económico) - $2-4/mes**
- ✅ Más barato
- ✅ Fácil de configurar
- ⚠️ Limitado a archivos estáticos
- ⚠️ Requiere configuración manual

### 2. **VPS (Recomendado) - $5-10/mes**
- ✅ Control total
- ✅ Mejor rendimiento
- ✅ Más flexible
- ⚠️ Requiere conocimientos técnicos

## Método 1: Hosting Web (Estático)

### Paso 1: Preparar la Aplicación
```bash
# En tu computadora local
npm run build
```

### Paso 2: Subir a Hostinger
1. **Accede al Panel de Control** de Hostinger
2. **Ve a File Manager**
3. **Navega a `public_html`**
4. **Sube la carpeta `build/` completa**
5. **Descomprime** si es necesario

### Paso 3: Configurar Supabase
1. **Ve a tu proyecto en Supabase**
2. **Settings > API**
3. **Site URL**: `https://tu-dominio.com`
4. **Additional Redirect URLs**: `https://tu-dominio.com`

### Paso 4: Variables de Entorno
Crea un archivo `.htaccess` en `public_html`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Método 2: VPS (Recomendado)

### Paso 1: Configurar VPS
```bash
# Conectar por SSH
ssh root@tu-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Instalar PM2
npm install -g pm2

# Instalar Nginx
apt install nginx -y
```

### Paso 2: Desplegar Aplicación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/impostor-app.git
cd impostor-app

# Instalar dependencias
npm install

# Build de producción
npm run build

# Instalar servidor estático
npm install -g serve

# Iniciar con PM2
pm2 start "serve -s build -l 3000" --name "impostor-app"
pm2 save
pm2 startup
```

### Paso 3: Configurar Nginx
```bash
# Crear configuración
nano /etc/nginx/sites-available/impostor-app

# Contenido del archivo:
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Habilitar sitio
ln -s /etc/nginx/sites-available/impostor-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Paso 4: SSL (Opcional pero Recomendado)
```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com
```

## Configuración de Supabase

### 1. URLs Permitidas
En Supabase > Settings > API:
- **Site URL**: `https://tu-dominio.com`
- **Additional Redirect URLs**: 
  - `https://tu-dominio.com`
  - `https://www.tu-dominio.com`

### 2. Variables de Entorno
Para VPS, crear archivo `.env`:
```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima
```

## Comandos Útiles

### Build y Deploy
```bash
# Build local
npm run build

# Verificar build localmente
npx serve -s build

# Subir a Hostinger (método manual)
# Comprimir carpeta build y subir via File Manager
```

### Gestión de VPS
```bash
# Ver logs de la aplicación
pm2 logs impostor-app

# Reiniciar aplicación
pm2 restart impostor-app

# Ver estado
pm2 status

# Ver logs de Nginx
tail -f /var/log/nginx/access.log
```

## Solución de Problemas

### Si la app no carga:
1. Verifica que los archivos estén en `public_html`
2. Revisa los permisos de archivos (644 para archivos, 755 para carpetas)
3. Verifica la configuración de Supabase

### Si hay errores de CORS:
1. Revisa las URLs en Supabase
2. Verifica que el dominio esté correctamente configurado

### Si la app no se actualiza:
1. Limpia la caché del navegador
2. Verifica que los archivos se hayan subido correctamente

## Costos Estimados

- **Hosting Web**: $2-4/mes
- **VPS**: $5-10/mes
- **Dominio**: $1-2/mes (si no está incluido)
- **Total**: $3-12/mes

## Recomendación

Para la **Impostor App**, recomiendo:
1. **Si tienes presupuesto limitado**: Hosting Web
2. **Si quieres mejor rendimiento**: VPS
3. **Si quieres la opción más fácil**: Vercel (gratis)

¡Hostinger es una excelente opción para tu aplicación!
