@echo off
set /p msg="请输入提交信息："
git add .
git commit -m "%msg%"
git push
vercel --prod
pause