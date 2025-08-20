pm2 stop fo;
pm2 delete fo;
npm run build;
pm2 start npm --name "fo" -- run start;