@echo off
title Pushing Fuzion Academy to GitHub...
cd /d "d:\antigravity\fuzion-academy"
echo =================================================================
echo        FUZION ACADEMY - PUSH PROJECT TO GITHUB
echo =================================================================
echo Target: https://github.com/iampraveensinghrawat-lab/fuzion-academy.git
echo Branch: main
echo.
set "PATH=C:\Users\iampr\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;%PATH%"
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed all code, games, and materials to GitHub!
    echo Your repository is now ready for 1-click Vercel deployment.
) else (
    echo [NOTICE] If prompted for authentication, log in via your browser.
)
pause
