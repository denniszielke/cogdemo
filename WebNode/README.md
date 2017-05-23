# WebNode

https://docs.docker.com/engine/getstarted/step_four/
docker build -t docker-whale .

https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli
docker login dzimages-microsoft.azurecr.io -u dzimages -p 5/fPCJ3DoGtbqryxS0XvnmifQWj1W3d5

docker images

docker tag docker-whale dzimages-microsoft.azurecr.io/samples/webnode

docker push dzimages-microsoft.azurecr.io/samples/webnode