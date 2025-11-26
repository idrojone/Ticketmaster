# Script para iniciar todos los servidores y Angular en Windows Terminal

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$adminPath = "$baseDir\Backend\DashboardAdmin"
$userPath = "$baseDir\Backend\UserServices"
$empresaPath = "$baseDir\Backend\dashboard-empresa"
$angularPath = "$baseDir\ticketmain"

Write-Host "🚀 Iniciando todos los servicios..." -ForegroundColor Green

# Abrir Windows Terminal con todos los servicios en pestañas separadas
wt.exe new-tab --title "AdminServer" --startingDirectory "$adminPath" pwsh -NoExit -c "npm run dev" `; new-tab --title "UserService" --startingDirectory "$userPath" pwsh -NoExit -c "npm run dev" `; new-tab --title "EmpresaServer" --startingDirectory "$empresaPath" pwsh -NoExit -c "npm run start:all:dev" `; new-tab --title "AngularApp" --startingDirectory "$angularPath" pwsh -NoExit -c "npm start"

Write-Host ""
Write-Host "✅ Todos los servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "Pestañas creadas:" -ForegroundColor Yellow
Write-Host "  ⚡ AdminServer (npm run dev)" -ForegroundColor White
Write-Host "  🔐 UserService (npm run dev)" -ForegroundColor White
Write-Host "  🏢 EmpresaServer (npm run start:all:dev)" -ForegroundColor White
Write-Host "  🎨 AngularApp (npm start)" -ForegroundColor White
