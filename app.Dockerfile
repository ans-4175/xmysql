# FROM mhart/alpine-node
FROM sitapati/docker-alpine-python-node

# Create Directory
RUN mkdir -p /services
WORKDIR /services

COPY . .
# RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
# RUN npm install --quiet node-gyp -g
RUN apk update && apk add --virtual build-dependencies build-base gcc wget git make
RUN npm install

ENV PORT_APP 80
EXPOSE 80

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node","app.js"]