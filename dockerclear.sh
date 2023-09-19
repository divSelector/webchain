docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -aq)
docker volume prune
docker network prune
docker system prune --all --force --volumes
