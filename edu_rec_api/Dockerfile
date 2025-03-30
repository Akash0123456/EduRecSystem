# Use default playwright image
FROM mcr.microsoft.com/playwright:v1.51.1-noble

WORKDIR .

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]