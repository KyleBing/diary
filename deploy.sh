#!/bin/bash

file_pattern="diary-*.zip"
folder_html="/var/www/html/"
if ls "${folder_html}${file_pattern}" 1> /dev/null 2>&1; then
    rm -Rf diary/* &&
    mv ${file_pattern} diary &&
    cd diary &&
    unzip ${file_pattern} &&
    rm -f ${file_pattern}
    echo 'Diary deployed'
else
    echo "文件 ${file_pattern} 不存在"
fi

# 仅供我自己使用，并不通用
