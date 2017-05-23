FROM node:argon

# Create app directory

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies


RUN npm install -g nodemon


COPY package.json /usr/src/app/

RUN npm install

# Bundle app source

COPY . /usr/src/app

EXPOSE 8083

CMD [ "npm", "start" ]
