$ErrorActionPreference = "Stop"

Write-Host "== Frontend deploy start =="

Set-Location "$PSScriptRoot\..\frontend"

npm run build
aws s3 sync dist s3://line-loop-frontend --delete

aws cloudfront create-invalidation `
  --distribution-id E22AWBLF6SW4A2 `
  --paths "/*"

Write-Host "== Frontend deploy done =="