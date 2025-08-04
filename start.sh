#!/bin/bash
# 🚀 Script de inicio para Docker Registry Manager

set -e

# Función para mostrar mensajes con emojis
info() { echo -e "\033[1;34mℹ️  $1\033[0m"; }
ok() { echo -e "\033[1;32m✅ $1\033[0m"; }
error() { echo -e "\033[1;31m❌ $1\033[0m"; }
warn() { echo -e "\033[1;33m⚠️  $1\033[0m"; }

# Mensaje de bienvenida y pasos
info "Bienvenido al asistente de inicio de Docker Registry Manager 🐳"
echo "\nPasos que realizará este script:"
echo "  1️⃣  Generar el archivo de credenciales htpasswd con los datos de .env"
echo "  2️⃣  Levantar los contenedores con docker-compose"
echo "\n"
read -p "¿Deseas continuar? (s/n): " confirm
if [[ ! "$confirm" =~ ^[sS]$ ]]; then
  warn "Operación cancelada por el usuario."
  exit 0
fi

# 1. Generar htpasswd
if [ ! -f .env ]; then
  error ".env no encontrado. Por favor, crea el archivo .env antes de continuar."
  exit 1
fi

export $(grep -v '^#' .env | xargs)
mkdir -p registry/auth

if ! command -v htpasswd &> /dev/null; then
  error "htpasswd no está instalado. Instálalo con: sudo apt-get install apache2-utils"
  exit 1
fi

if [ -z "$REGISTRY_USERNAME" ] || [ -z "$REGISTRY_PASSWORD" ]; then
  error "Las variables REGISTRY_USERNAME o REGISTRY_PASSWORD no están definidas en .env."
  exit 1
fi

htpasswd -Bbn "$REGISTRY_USERNAME" "$REGISTRY_PASSWORD" > registry/auth/htpasswd
ok "Archivo registry/auth/htpasswd generado."

# 2. Levantar los contenedores
info "Iniciando los contenedores con docker-compose..."
if docker-compose up -d; then
  ok "Contenedores levantados correctamente."
  info "Puedes ver los logs con: docker-compose logs -f"
else
  error "Hubo un error al levantar los contenedores."
  exit 1
fi

echo -e "\n🎉  Proceso finalizado. Tu Docker Registry Manager está listo."
