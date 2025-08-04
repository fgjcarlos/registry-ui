# registry-ui

Este proyecto es una interfaz de usuario para la gestión de un registro de imágenes de contenedores Docker, con autenticación básica y panel de administración.

## Estructura del proyecto

- **frontend/**: Contiene el código fuente de la aplicación Next.js (React), componentes, hooks, servicios y tipos.
- **registry/**: Incluye la configuración y autenticación del registro Docker (por ejemplo, `htpasswd`).
- **nginx.conf**: Configuración de NGINX para servir la aplicación y el registro.
- **docker-compose.yml**: Orquestación de los servicios necesarios (frontend, NGINX, registro).
- **start.sh** y **generate-htpasswd.sh**: Scripts para inicializar el entorno y generar credenciales.

## Funcionamiento general

1. **Autenticación**: Los usuarios deben iniciar sesión con usuario y contraseña. Las credenciales se gestionan mediante el archivo `htpasswd` en `registry/auth/`.
2. **Panel de administración**: Tras autenticarse, los usuarios acceden a un dashboard donde pueden ver y gestionar las imágenes del registro Docker.
3. **Servicios**: La comunicación entre frontend y backend se realiza a través de endpoints API definidos en `src/app/api/`.
4. **Despliegue**: Utiliza Docker y Docker Compose para levantar todos los servicios necesarios de forma sencilla.

## Instalación y uso

1. Clona el repositorio:
   ```bash
   git clone https://github.com/fgjcarlos/registry-ui.git
   cd registry-ui
   ```
2. Genera las credenciales de acceso:
   ```bash
   ./generate-htpasswd.sh <usuario> <contraseña>
   ```
3. Levanta los servicios:
   ```bash
   docker-compose up -d
   ```
4. Accede a la aplicación en tu navegador en la URL configurada (por defecto, `http://localhost`).

## Personalización
- Puedes modificar la configuración de NGINX en `nginx.conf`.
- Para cambiar la configuración del registro, edita `registry/config.yml`.
- Los componentes y servicios del frontend están en `frontend/src/`.

## Requisitos
- Docker
- Docker Compose
- Node.js (solo si deseas desarrollar el frontend localmente)

## Desarrollo
Para desarrollo del frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

## Licencia
MIT
