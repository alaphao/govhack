const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const path = require('path');
const serverPath = './server';
const dapp = require(`${path.join(process.cwd(), serverPath)}/dapp/dapp.js`)(config.contractsPath);

const loginController = {
  login: function(req, res) {
    const deploy = req.app.get('deploy');
    const username = req.body.username;
    const password = req.body.password;

    dapp.setScope()
      .then(dapp.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address, deploy.adminAddress))
      .then(dapp.login(deploy.adminName, username, password))
      .then(scope => {
        util.response.status200(res, {
          authenticate: true,
          user: scope.result.user
        });
      })
      .catch(err => {
        console.log('Login Error:', err);
        util.response.status(401, res, 'Login failed');
      });
  }
}

module.exports = loginController;
