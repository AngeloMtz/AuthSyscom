Pasos para ejecutar el proyecto:

Paso 1: Clonar el repositorio (O descargar el ZIP y descomprimirlo).
git clone https://github.com/Angelomtz/Syscom-web.git
cd Syscom-web

Paso 2: Instalar dependencias del Backend
cd backend
pnpm install

Paso 3: Crear el archivo de secretos del Backend
cp .env

Paso 4: Correr las migraciones de la Base de Datos
pnpm prisma migrate dev

Paso 5: Instalar dependencias del Frontend
cd ..
cd frontend
pnpm install

Paso 6: Crear el archivo de secretos del Frontend
cp .env

Paso 7: ¡Ejecutar!
cd backend
pnpm run dev

cd frontend
pnpm run dev
