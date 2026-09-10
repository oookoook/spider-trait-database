# Runs taxa-importer.js for every non-Araneae order found in the WSC source folder.
# Usage: cd backend\util\taxonomy-synchro ; .\run-taxa-import.ps1

$sourceDir = "C:\Users\adamk\dev\pajouci\watdb\taxa"
$targetDir = Join-Path $PSScriptRoot "..\..\..\db\sql\arachind-taxa"
$importer  = Join-Path $PSScriptRoot "taxa-importer.js"

# Araneae is excluded - it's the existing legacy dataset, not part of this import
$orders = @('Solifugae', 'Scorpiones', 'Palpigradi', 'Uropygi', 'Amblypygi',
            'Schizomida', 'Pseudoscorpiones', 'Ricinulei', 'Opiliones')

New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

foreach ($order in $orders) {
    $sourceFile = Get-ChildItem -Path $sourceDir -Filter '*.xlsx' |
        Where-Object { $_.BaseName -ieq $order } |
        Select-Object -First 1

    if (-not $sourceFile) {
        Write-Warning "No source file found for order '$order', skipping."
        continue
    }

    $outputFile = Join-Path $targetDir "$($order.ToLower()).sql"
    Write-Host "Importing $order from $($sourceFile.Name) -> $outputFile"
    node $importer $sourceFile.FullName $outputFile
}
