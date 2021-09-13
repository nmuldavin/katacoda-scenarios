
echo 'This workshop is setting up...'
sleep 20

# Temporary, will be done in the background later
export ADMIN_UI_URL=https://[[HOST_SUBDOMAIN]]-3000-[[KATACODA_HOST]].environments.katacoda.com

# Build the demo UI
cd $HOME/app/backend/demo-ui
yarn install
yarn build

# Run the api service
cd $HOME/app/backend
yarn install
node index.js