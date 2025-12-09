./wait-for-it.sh mongodb:27017 --timeout=60 --strict

# If DATABASE_URL is present, run prisma db push
DATABASE_URL="mongodb://mongodb:27017/ticketmaster?replicaSet=rs0" #si no no furula

if [ -z "$DATABASE_URL" ]; then
	echo "DATABASE_URL not set. Skipping prisma db push."
else
	echo "Applying DB schema: prisma db push"
	pnpm exec prisma db push --schema=/app/prisma/schema.prisma --skip-generate || true
fi

echo "Starting Dashboard Admin..."
npm run start