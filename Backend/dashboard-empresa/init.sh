#!/bin/sh
./wait-for-it.sh mongodb:27017 --timeout=60 --strict


# If DATABASE_URL is present, run prisma db push
DATABASE_URL="mongodb://mongodb:27017/ticketmaster?replicaSet=rs0" #si no no furula

# if [ -n "$DATABASE_URL" ]; then
# 	echo "Generating Prisma Client..."
# 	pnpm exec prisma generate --schema=/app/prisma/schema.prisma
	
# 	echo "Applying DB schema: prisma db push"
# 	pnpm exec prisma db push --schema=/app/prisma/schema.prisma --skip-generate || true
# fi

echo "Generating Prisma Client..."
./node_modules/.bin/prisma generate --schema=/app/prisma/schema.prisma

echo "Applying DB schema: prisma db push"
./node_modules/.bin/prisma db push --schema=/app/prisma/schema.prisma --skip-generate || true
echo "Starting Dashboard Admin..."


node dist/apps/api-gateway/main.js &
p1=$!
node dist/apps/auth-service/main.js &
p2=$!
node dist/apps/merch-service/main.js &
p3=$!
node dist/apps/categoria-service/main.js &
p4=$!

pids="$p1 $p2 $p3 $p4"


trap 'echo "Stopping services..."; for pid in $pids; do kill -TERM "$pid" 2>/dev/null || true; done; wait; exit' INT TERM


exit_code=0
for pid in $pids; do
    if ! wait "$pid"; then
        exit_code=$?
        echo "Process $pid exited with code $exit_code"
    fi
done

exit $exit_code