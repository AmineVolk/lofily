pm2 stop back;
pm2 delete back;
npm run build;
pm2 start npm --name "back" -- run start;