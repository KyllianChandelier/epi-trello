FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
COPY prisma ./prisma/
ENV NODE_ENV=development
RUN npm install

# Generate Prisma client with correct binary target
RUN npx prisma generate

# Copy source
COPY . .

# Expose backend port
EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
