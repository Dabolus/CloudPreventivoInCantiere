FROM node:carbon
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/server
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
