const scpClient = require('scp2');      // 基于ssh2的纯javascript安全复制程序
const ora = require('ora');             // 一个优雅的 Node.js 终端加载动画效果
const chalk = require('chalk');         // 字体颜色插件

const spinner = ora('正在发布到 ' + process.env.NODE_ENV + ' 服务器...\n');
spinner.start();
const SERVER_LIST = {
  'development': {
    hostname: '112.124.1.100',            // ip
    port: 22,                       // 端口
    username: 'root',               // 登录服务器的账号
    password: 'JINGjiuBUchi7486',                // 登录服务器的账号
    path: '/opt/www/admin'                // 发布至静态服务器的项目路径
  },
  'production': {
    hostname: '112.124.1.100',      // ip
    port: 22,                       // 端口
    username: 'root',               // 登录服务器的账号
    password: 'JINGjiuBUchi7486',                // 登录服务器的账号
    path: '/opt/www/admin'                // 发布至静态服务器的项目路径
  },
};

const server = SERVER_LIST[process.env.NODE_ENV];
scpClient.scp(
  'dist/',
  {
    host: server.hostname,
    port: server.port,
    username: server.username,
    password: server.password,
    path: server.path
  },
  function (err) {
    spinner.stop();
    if (err) {
      console.log(chalk.red('发布失败.\n'));
      throw err;
    } else {
      console.log(chalk.green('Success! 成功发布到' + process.env.NODE_ENV + '服务器! \n'));
    }
  }
);
