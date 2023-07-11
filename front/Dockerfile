# # Use an official Node.js runtime as a parent image
FROM node:16-alpine

WORKDIR /app
COPY ./front/build /app

RUN adduser -D notroot
RUN chown -R notroot:notroot /app
USER notroot

RUN yarn global add serve

EXPOSE 3000
CMD /home/notroot/.yarn/bin/serve -s build
