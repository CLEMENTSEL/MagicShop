FROM node:18.19.0

WORKDIR /frontend

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN apt-get update && apt-get upgrade -y
RUN apt-get install npm -y
RUN npm install -g npm@10.8.1
RUN npm i cookies-next
RUN npm i

COPY . .

CMD [ "npm", "run", "dev", "--", "-p", "3000" ]