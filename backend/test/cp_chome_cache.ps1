$source = "C:\Users\edward\AppData\Local\Google\Chrome\User Data\Default\Cache"
$destination = Get-Location

Get-ChildItem $source -File -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length).TrimStart('\')
    $targetPath = Join-Path $destination $relativePath

    New-Item -ItemType Directory -Path (Split-Path $targetPath) -Force | Out-Null
    Copy-Item $_.FullName $targetPath -Force
}