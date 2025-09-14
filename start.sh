#!/bin/bash

# Impostor App - Script de Inicio
echo "🎨 Iniciando Impostor App..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "✅ Node.js y npm están instalados"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
    echo "✅ Dependencias instaladas correctamente"
else
    echo "✅ Dependencias ya instaladas"
fi

# Verificar si existe archivo .env
if [ ! -f ".env.local" ]; then
    echo "⚠️  No se encontró archivo .env.local"
    echo "📝 Copiando archivo de ejemplo..."
    cp env.example .env.local
    echo "✅ Archivo .env.local creado. Por favor configura tus credenciales de Supabase."
    echo "🔧 Edita .env.local con tus credenciales de Supabase para funcionalidad completa."
fi

# Iniciar la aplicación
echo "🚀 Iniciando la aplicación..."
echo "🌐 La aplicación estará disponible en: http://localhost:3000"
echo "📱 Presiona Ctrl+C para detener la aplicación"
echo ""

npm start
