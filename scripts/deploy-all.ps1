$ErrorActionPreference = "Stop"

Write-Host "== Full deploy start =="

& "$PSScriptRoot\deploy-backend.ps1"
& "$PSScriptRoot\deploy-frontend.ps1"

Write-Host "== Full deploy done =="