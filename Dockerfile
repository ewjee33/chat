FROM node:16 AS builder 

RUN apt-get update
RUN apt-get -y install vim

WORKDIR /app 
COPY . . 
# RUN npm install npm -g # nodejs 버전이 낮아서 -g옵션 해제
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]

