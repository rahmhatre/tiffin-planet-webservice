# Tiffin Planet Webservice

## Run app locally

- Install the node modules by `npm install`
- Check the `.env` file for the mongoDB connection string
- To run the backend run command `npm start` which will connect to the mongodb instance setup

## Deployment of MongoDB

- Login to [MongoDB](https://cloud.mongodb.com/)
- Create a Project
- Connect to the database
- Install MongoDB Compass locally to view the db collections locally
- Network Access security is set to IP whitelisting

## Deployment to Heroku

- Check for the procfile if present
- Login to [Heroku](https://dashboard.heroku.com/)
- Goto tiffin planet ws and select environment
- Under settings you have to setup the `config vars` for `DATABASE_URL`
- Login to heroko using cmd by `heroku login`
- Can view `config vars` by Heroku CLI with `heroku config -a <application-name>`
  - Eg. `heroku config -a staging-tiffin-planet-ws`
- You need to scale up heroku node if the service is down by `heroku ps:scale web=1`
- If you want to open the deployed app directly from the CLI then `heroku open -a <application-name>`
- Debuggin the logs can be achieved with `heroku logs -a <application-name>`
