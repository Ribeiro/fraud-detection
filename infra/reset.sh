#!/bin/bash
docker compose down -v
docker compose up -d --force-recreate
echo "Ambiente resetado!"
