// load the library
var SMB2 = require('v9u-smb2')

// create an SMB2 instance
var smb2Client = new SMB2({
  share: '\\\\localhost\\BaiduNetdiskDownload',
  username: 'username',
  password: 'password!'
})

smb2Client.mkdir('path', function(err) {
  if (err) throw err;
  console.log('Directory created!');
});

smb2Client.close()
