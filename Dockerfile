FROM node:20.15.1
LABEL authors="733Law"
WORKDIR .
COPY . .
RUN npm install
CMD ["npm", "build"]
CMD ["npm", "start"]

ENTRYPOINT ["top", "-b"]