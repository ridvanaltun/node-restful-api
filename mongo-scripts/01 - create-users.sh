#!/usr/bin/env bash
echo "Creating users..."
mongo admin --host localhost -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} --eval "db.createUser({user: ${MONGO_USERNAME}, pwd: ${MONGO_PASSWORD}, roles: [{role: 'readWrite', db: ${MONGO_DATABASE}}, {role: 'readWrite', db: ${AGENDA_DATABASE}}]});"
echo "Users created."
