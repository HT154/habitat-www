#!/bin/bash

while inotifywait -r -e modify,create,delete /src/components/www/build/; do
    cp -Rfv /src/components/www/build/* /src/site/static/js/
done
