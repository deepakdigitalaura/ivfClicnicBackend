# Local portable PostgreSQL control for the Payload CMS POC.
# Usage:  powershell -NoProfile -File scripts\pg-local.ps1 start|stop|status
# The DB lives OUTSIDE the repo at %USERPROFILE%\pgsql-portable (never committed).
# Connection: postgresql://postgres:payload_local_pw@127.0.0.1:5433/bfi_payload
param([Parameter(Mandatory=$true)][ValidateSet('start','stop','status')] [string]$action)

$bin  = "$env:USERPROFILE\pgsql-portable\pgsql\bin"
$data = "$env:USERPROFILE\pgsql-portable\data"
$log  = "$env:USERPROFILE\pgsql-portable\server.log"

switch ($action) {
  'start'  { & (Join-Path $bin 'pg_ctl.exe') -D $data -l $log -o '-p 5433' -w start }
  'stop'   { & (Join-Path $bin 'pg_ctl.exe') -D $data -m fast stop }
  'status' { & (Join-Path $bin 'pg_isready.exe') -h 127.0.0.1 -p 5433 }
}
