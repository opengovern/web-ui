FROM node:18-alpine

COPY package.json ./
COPY package-lock.json ./

RUN npm install --force
RUN npm install -g serve --force
COPY . ./
RUN npm run build

CMD ["serve","-s","dist","-p" ,"2100"]