#!/bin/bash
# Script para generar el archivo htpasswd para Docker Registry usando las variables del .env

set -e

# Cargar variables del .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found!"
  exit 1
fi

# Crear directorio de auth si no existe
mkdir -p registry/auth

# Verificar que htpasswd esté instalado
if ! command -v htpasswd &> /dev/null; then
  echo "htpasswd no está instalado. Instálalo con: sudo apt-get install apache2-utils"
  exit 1
fi

# Generar el archivo htpasswd
htpasswd -Bbn "$REGISTRY_USERNAME" "$REGISTRY_PASSWORD" > registry/auth/htpasswd

echo "Archivo registry/auth/htpasswd generado correctamente."
