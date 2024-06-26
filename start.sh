#!/bin/bash

if [ "X$GITURL" == "X" ] ; then
	echo "Check the environment variables(GITLAB) in docker-compose.yaml"
	exit
fi
if [ "X$SERVICE" == "X" ] ; then
	echo "Check the environment variables(SERVICE) in docker-compose.yaml"
	exit
fi
if [ "X$TAG" == "X" ] ; then
	echo "Check the environment variables(TAG) in docker-compose.yaml"
	exit
fi
if [ "X$BRANCH" == "X" ] ; then
	BRANCH="master"
fi

# Get Service Code By Git Repository
mkdir -p /var/www

git clone $GITURL /var/www/$SERVICE
cd /var/www/$SERVICE
git fetch --all --tags /var/www/$SERVICE

if [ $BRANCH == "master" ] ; then
	git checkout tags/$TAG
else
	git checkout $BRANCH
fi

cd /app
cp -r /var/www/$SERVICE/src/* /app/src/
cp -r /var/www/$SERVICE/package.json /app/

# Build
npm run build

# Run
pm2-runtime start dist/main.js -i $CORECOUNT
