# Quiz App Front End - React

## Resources
 - GRPC issue upon first `npm i`? Go [here](https://github.com/grpc/grpc-node/issues/1183)
 
## Build

### Docker
1. `docker-compose -f .\development.yml up -d --build` --- or --- `docker build -t react:current .`

## Run

### Non-docker
1. `npm run start-dev`

### Docker
1. `docker run -it --rm -p 45762:80 react:dev` 