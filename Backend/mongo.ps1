docker compose up -d --remove-orphans

Start-Sleep -Seconds 10


docker exec -it mongo mongosh -u root -p winteriscoming --authenticationDatabase admin --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'mongo:27017'}]})" --quiet


docker exec -it mongo mongosh -u root -p winteriscoming --authenticationDatabase admin --eval "rs.status()" --quiet

# mongodb://root:winteriscoming@localhost:27018/?authSource=admin&directConnection=true
