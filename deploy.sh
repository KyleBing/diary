#!/bin/bash
cd /var/www/html &&
if compgen -G "./diary*.zip" > /dev/null; then
    rm -Rf diary/* &&
    mv diary-* diary &&
    cd diary &&
    unzip diary-* &&
    rm -f diary-*
    echo 'Diary deploy finished.'
else
    echo "diary-*.zip 不存在"
fi
