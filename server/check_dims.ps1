Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem "d:\PATRONUM X\Esports\WEB\esports\esports\src\assets\zones\*.png"
foreach ($file in $files) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    Write-Output "$($file.Name): $($img.Width)x$($img.Height)"
    $img.Dispose()
}
