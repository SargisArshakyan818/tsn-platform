Backend

Clone the backend repo:

git clone https://github.com/SargisArshakyan818/tsn-platform
cd tsn-backend


Install dependencies:

npm install


Configure .env file:

PORT=3000
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=sargisarshakyan818
DATABASE_PASSWORD=81ZZ818altezza
DATABASE_NAME=tasks_db
JWT_SECRET=my_super_secret_key_123



Run database migrations (if applicable):

npm run typeorm:migrate


Start backend server:

npm run start:dev


(Optional) Docker setup:

docker-compose up --build


🌱 Seeding Database

Seed users and tasks with sample data:

npm run seed


Example seeds included:

Admin user: admin@example.com | password123

Regular users: manager@example.com | password123

Sample tasks with random titles, descriptions, statuses, and assigned users

The seed script will create users and tasks only if they do not exist, safe to run multiple times.