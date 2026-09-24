param([switch]$LegacyDemo, [switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$pythonPath = Join-Path $projectRoot '.venv\Scripts\python.exe'
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source
$nextPath = Join-Path $projectRoot 'node_modules\next\dist\bin\next'
$apiPath = Join-Path $projectRoot 'apps\api'
$webPath = Join-Path $projectRoot 'apps\web'
$logPath = Join-Path $projectRoot '.local'
if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Create .venv and install apps/api/requirements-foundation.txt first. See docs/SENTINEL_FOUNDATION_CHECKPOINT.md.' }
if (-not (Test-Path -LiteralPath $nextPath)) { throw 'Run npm ci in the project directory first.' }
foreach ($port in 3000,8000) {
    $probe = New-Object System.Net.Sockets.TcpClient
    try {
        try { $null = $probe.ConnectAsync('127.0.0.1', $port).Wait(1000) } catch { }
        if ($probe.Connected) {
            throw "Port $port is already in use. Existing processes have not been stopped."
        }
    } finally {
        $probe.Dispose()
    }
}
$env:ENVIRONMENT = 'development'
$env:SENTINEL_LEGACY_DEMO = $LegacyDemo.IsPresent.ToString().ToLowerInvariant()
$env:ALLOWED_ORIGINS = 'http://localhost:3000,http://127.0.0.1:3000'
New-Item -ItemType Directory -Force -Path $logPath | Out-Null
Push-Location $projectRoot
try {
    & $pythonPath -m alembic -c apps/api/alembic.ini upgrade head
    if ($LASTEXITCODE -ne 0) { throw 'Database migration failed.' }
    if (-not $SkipBuild) {
        & npm.cmd run build:web
        if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $webPath '.next\BUILD_ID'))) { throw 'No frontend build. Run without -SkipBuild.' }
    $apiProcess = $null
    $webProcess = $null
    try {
        $apiProcess = Start-Process -FilePath $pythonPath -ArgumentList '-m uvicorn main:app --host 127.0.0.1 --port 8000 --no-proxy-headers' -WorkingDirectory $apiPath -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logPath 'api.stdout.log') -RedirectStandardError (Join-Path $logPath 'api.stderr.log')
        $webArguments = '"' + $nextPath + '" start --hostname 127.0.0.1 --port 3000'
        $webProcess = Start-Process -FilePath $nodePath -ArgumentList $webArguments -WorkingDirectory $webPath -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logPath 'web.stdout.log') -RedirectStandardError (Join-Path $logPath 'web.stderr.log')
        $deadline = [DateTime]::UtcNow.AddSeconds(90)
        $ready = $false
        while ([DateTime]::UtcNow -lt $deadline) {
            if ($apiProcess.HasExited -or $webProcess.HasExited) { throw 'A service exited. Inspect the .local logs.' }
            try {
                $apiResponse = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:8000/health/ready' -TimeoutSec 3
                $webResponse = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:3000/workspace' -TimeoutSec 3
                if ($apiResponse.StatusCode -eq 200 -and $webResponse.StatusCode -eq 200) { $ready = $true; break }
            } catch { Start-Sleep -Seconds 1 }
        }
        if (-not $ready) { throw 'Services did not become ready within 90 seconds. Inspect the .local logs.' }
        Write-Output 'SENTINEL is ready: http://127.0.0.1:3000/workspace'
        Write-Output "Local process IDs: API=$($apiProcess.Id), Web=$($webProcess.Id)"
        Write-Output 'Only loopback connections are accepted. See the checkpoint document for local operator provisioning.'
    } catch {
        # Only stop processes created by this invocation, never unrelated port owners.
        if ($apiProcess -and -not $apiProcess.HasExited) { & taskkill.exe /PID $apiProcess.Id /T /F | Out-Null }
        if ($webProcess -and -not $webProcess.HasExited) { & taskkill.exe /PID $webProcess.Id /T /F | Out-Null }
        throw
    }
} finally { Pop-Location }
