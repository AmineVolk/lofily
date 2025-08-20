pm2 stop bo;
pm2 delete bo;
npm run build;
pm2 start npm --name "bo" -- run start;