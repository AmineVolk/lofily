pm2 stop landing;
pm2 delete landing;
npm run build;
pm2 start npm --name "landing" -- run start;