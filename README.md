# lofi

## Server require

We are using a lib the create a thumbnail (https://github.com/vadimdemedes/node-video-thumb), and we should have ffmpeg in the server.

Run :

```bash
sudo apt update && sudo apt upgrade
sudo apt install ffmpeg
```

Or follow instructions : https://phoenixnap.com/kb/install-ffmpeg-ubuntu

## AzuraCast

we use azuracast to handle the music that will be listen on the application.
See the documentation to install it : https://docs.azuracast.com/en/getting-started/installation/docker

Run :

```bash
cd azuracast ; ./docker.sh install
```

## Run project using pm2 :

Front and BO :

```bash
npm run build
```

Run start.sh or :

```bash
pm2 start npm --name "PROJECT NAME" -- run start
```

Copy mp3 from azuracast container to folder :

```bash
docker cp b77125f995f7://var/azuracast/stations/lofilyradio/media ./public
```

Dev :
Add admin : hello@lofily.com / XH2T6LtA9anXAakyH

in docker container:

```bash
docker exec -it lofily-db psql -U lofily -d lofily -c "INSERT INTO public."user"(created, updated, username, email, password, type)
VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'admin', 'hello@lofily.com', '$2b$10$tWbdwFqKzzxxYy2b4j.so.I9NNgaoHwQfrMDEnHKXV8bWGNodgD4G', 'ADMIN');"
```

Prod :
Add admin : hello@lofily.com / XH2T6LtA9anXAakyH

in docker container:

```bash
docker exec -it lofily-db psql -U lofily -d lofily -c "INSERT INTO public."user"(created, updated, username, email, password, type,setting)
VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'admin', 'hello@lofily.com', '$2b$10$Yan3NubNqPk34TWDtC1YqeSllrqxSP8EWnbrDP49uVZLikVhRgu3m', 'ADMIN','{}');"
```

nginx
for the front :

```bash
server {
    server_name app.lofily.com;

    location /api/ {
      proxy_pass http://127.0.0.1:3000/;
    }
}
```

for the backoffice :

```bash
server {
    server_name app.lofily.com;

    location /api/ {
      proxy_pass http://127.0.0.1:3000/;
    }
}
```

..
