#!/bin/bash

# 获取当前所在的 Git 分支名
branch_name=$(git symbolic-ref --short HEAD)

# 分支名规则
pattern="^((fix|feat)-[a-z]{2,}-([a-zA-Z0-9]+)|main|master|dev|release-[a-zA-Z0-9-]+)$"

# 正则不匹配就错误提示
if [[ ! $branch_name =~ $pattern ]]; then
  echo "Error: Invalid branch name. Branch name must match '(fix|feat)-(名字缩写)-(具体改动) , main , master ,release-(功能分支) ' format."
  exit 1
fi
