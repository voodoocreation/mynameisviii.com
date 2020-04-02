source /home/ec2-user/.bash_profile

cd /var/www/mynameisviii.com
npm install -g yarn pm2
yarn cache clean
yarn install --force
yarn cache clean
