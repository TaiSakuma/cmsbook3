#!/bin/bash
# Replace the public path place holder with the actual public path

PUBLIC_PATH_PLACEHOLDER="/public_path_placeholder/"

source $(dirname -- "$0")/.env.sh

for f in $(find . -type f); do
    command="sed -i -e \"s#$PUBLIC_PATH_PLACEHOLDER#$PUBLIC_PATH#g\" $f"
    echo + $command
    eval $command
done
