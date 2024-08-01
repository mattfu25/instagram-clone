# instagram-clone

Instagram clone built with Postgres, Express, React, and Node. 

## Usage

This is for development environments.

### Backend

1. Cd into backend directory.

```bash
cd backend
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file. Insert the following environment variables. Note, the database url should be for Postgres. For the database url format and more on Prisma visit the [Prisma Docs](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql).

```javascript
# Prisma
DATABASE_URL=""

# Express
PORT = 

# Cookie-secret
COOKIE_SECRET = ""
```

4. Run initial migration and generate prisma client.

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Start the server with either of the following.
```bash
npm run dev
```
```bash
npm run build
npm run start
```

### Frontend

1. Cd into frontend directory.

```bash
cd frontend
```

2. Install dependencies.

```bash
npm install
```

3. Start the frontend.
```bash
npm run dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)