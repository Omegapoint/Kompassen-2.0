#!/bin/bash

set -e

NAME=kompassen2setup
GROUP="$NAME"
LOCATION="West Europe"

if [ "$1" == "--delete" ] || [ "$1" == "-d" ]; then
    az group delete -n $GROUP
    az storage account delete -n $NAME -g $GROUP
else
    az group create -l "$LOCATION" -n $GROUP
    az storage account create -n $NAME -g $GROUP --sku Standard_LRS
    az storage container create -n tfstate --account-name $NAME -g $GROUP --public-access off
    az storage blob upload --account-name $NAME --container-name tfstate --name terraform.tfstate --content-type application/json --type Block -f /dev/null
fi
