#!/bin/bash
cd /var/www/html

# 尝试列出匹配的文件，并将错误信息重定向到 /dev/null
file_list=$(ls diary-*.zip 2>/dev/null)

# 判断获取到的文件名列表是否为空
if [ -n "$file_list" ]; then
    echo "存在匹配 diary-*.zip 的文件，开始解压..."

    # 清空 ./diary 目录
    rm -Rf ./diary/*

    # 遍历匹配到的文件并解压
    for file in $file_list; do
        unzip -o "$file" -d ./diary
    done
    echo "解压完成。"
    rm -f "${file}"
else
    echo "不存在匹配 diary-*.zip 的文件。"
fi
