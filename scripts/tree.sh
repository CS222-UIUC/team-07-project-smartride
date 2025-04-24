# Linux script to generate a tree of the current directory excluding .git files

find . -type f -not -path "./.git/*" \
| grep -v -f <(find . -type f -not -path "./.git/*" | git check-ignore --stdin --no-index) \
| sed 's|^\./||' \
| tree --fromfile --prune > tree.txt