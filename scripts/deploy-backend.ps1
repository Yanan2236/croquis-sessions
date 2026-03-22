$ErrorActionPreference = "Stop"

Write-Host "== Backend deploy start =="

Set-Location "$PSScriptRoot\..\backend"

aws ecr get-login-password --region ap-northeast-1 `
| docker login --username AWS --password-stdin 941875981366.dkr.ecr.ap-northeast-1.amazonaws.com

docker build -t croquis-backend .
docker tag croquis-backend:latest 941875981366.dkr.ecr.ap-northeast-1.amazonaws.com/croquis-backend:latest
docker push 941875981366.dkr.ecr.ap-northeast-1.amazonaws.com/croquis-backend:latest

aws ecs update-service `
  --cluster croquis-cluster `
  --service croquis-backend-service `
  --force-new-deployment `
  --region ap-northeast-1

Write-Host "== Backend deploy done =="