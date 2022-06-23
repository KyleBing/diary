#!/bin/bash
cd /usr/share/nginx/html &&
rm -Rf diary/* &&
mv diary-* diary &&
cd diary &&
unzip diary-* &&
rm -f diary-*
echo 'Diary deploy finished.'
