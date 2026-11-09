# RAT CATCHERS online server

The online server for RAT CATCHERS (an ORION Original). Players never set anything up: the game has this
server's address built in, joins it by itself when it is awake, and plays on its own (and with friends,
without a server) when it isn't.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ACCUCT/rat-catchers-server)

## How it works on a free host

* **Saves live on players' devices** (`RC_DEVICE_SAVES=1`). A player's game brings its save when it connects,
  and the server sends it back every 8 seconds. A free server that sleeps or restarts with an empty disk loses nothing.
* **It sleeps** after 15 minutes with nobody playing. The first player's game wakes it (about a minute) and moves
  over by itself when it's ready.
* Leaderboards, the admin password (back to `1111`, change it at first login) and owner settings start fresh after
  each restart.

## Owner app

Open `https://<your-address>/admin`. It needs the admin password **and** the owner key: on Render, open the
service → **Environment** → `RC_OWNER_KEY`.

## Running it elsewhere

`node server/main.js --device-saves` with Node.js 22.13 or newer (no packages to install). `PORT` is honoured.
