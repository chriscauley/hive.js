# Hive.js

This is intended to be a hive game engine, as well as assets and a react client. The game is running at hive.unrest.io if you want to play online. To run the game locally at http://localhost:4483 run:

``` bash
git clone https://github.com/chriscauley/hive.js.git
cd hive.js
yarn install
yarn develop
```

The above will start only the client. If you also want to run the client you will need python3 and postgres installed. You'll also need docker (or redis if you don't want to use docker). To install the python server and start both the client and multiplayer server at http://localhost:8239 run:

``` bash
# from hive.js directory

# install python dependencies
python3 venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# create database
createdb hive
python manage.py migrate

# start redis
docker run -p 6379:6379 -d redis:5is:5

# start server locally
./bin/develop
```

## TODO

* minmax AI

* add more variants from board game geek