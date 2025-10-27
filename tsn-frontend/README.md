Task Scheduling Platform – Frontend
Description

Vue 3 + TypeScript frontend for the Task Scheduling Platform. Provides responsive UI, modals, real-time notifications, and task management interface.

Setup Instructions

Clone repo:

git clone https://github.com/SargisArshakyan818/tsn-platform
cd tsn-frontend


Install dependencies:

npm install


Configure .env:

VITE_API_URL=http://localhost:3000/api


Run dev server:

npm run dev


Open browser at http://localhost:5173

(Optional) Build for production:

npm run build

Admin Credentials

Use any registered user. Default demo user:

Email: admin@example.com

Password: password123!

Trade-offs / Notes

Task filtering and sorting are performed client-side.

Modal date inputs require ISO string conversion.

Socket.IO provides notifications; currently, only admin email is used for events.

No component library used (e.g., Vuetify) to reduce bundle size.

TailwindCSS ensures responsive layout.
