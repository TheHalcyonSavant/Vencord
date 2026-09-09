taskkill /F /T /IM Discord.exe;

pnpm build --dev;
pnpm inject --location=C:\Users\Administrator\AppData\Local\Discord;

$discordExe = Get-ChildItem -Path "$env:LOCALAPPDATA\Discord" -Filter "Discord.exe" -Recurse | Select-Object -ExpandProperty FullName -First 1
# RedirectStandardOutput "NUL" is similar, but not the same, to: & $discordExe *>$null
Start-Process -FilePath $discordExe -WindowStyle Hidden -RedirectStandardOutput "NUL"
