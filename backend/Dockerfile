# ---- Base Image ----
FROM node:20-alpine

# ---- Working Directory ----
WORKDIR /app

# ---- Copy package files ----
COPY package*.json ./

# ---- Install dependencies ----
RUN npm install

# ---- Copy rest of code ----
COPY . .

# ---- Expose backend port ----
EXPOSE 5000

# ---- Start server ----
CMD ["npm", "start"]
