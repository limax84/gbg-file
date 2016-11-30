#!/bin/bash
#set -x

input=$1
case "$input" in
    success )
        echo "Generation success"
        exit 0
        ;;
    failed )
        echo "Generation failed"
        exit 1
        ;;
    * )
        echo "Generation not found"
        exit 2
        ;;
esac
