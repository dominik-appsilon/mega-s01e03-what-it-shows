#!/bin/sh
# Copy the kb's src from the repo, add the minimal SvelteKit shell, build static pages.
set -e
cd "$(dirname "$0")"
rm -rf src build .svelte-kit
cp -r ../src src
cat > src/app.html <<'H'
<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />%sveltekit.head%</head>
<body><div style="display: contents">%sveltekit.body%</div></body></html>
H
printf "export const prerender = true;\nexport const trailingSlash = 'never';\n" > src/routes/+layout.ts
npx vite build
