#!/bin/bash

echo "deploying to 2psy.net..."
rsync -avh ~/Documents/Projects/2psy.net/ website:/var/www/html --exclude=src/ --exclude=node_modules/ --exclude=.gitignore --exclude=deploy.sh --exclude=Gruntfile.js --exclude=package.json --exclude=.DS_Store
echo "done :)"
