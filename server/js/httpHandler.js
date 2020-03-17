
const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageArray = require('./messageQueue');
const formidable = require('formidable');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  if (req.method === 'POST') {
    var fileData = Buffer.alloc(0);

    req.on('data', (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    })

    req.on('end', () => {
      var file = multipart.getFile(fileData);

      fs.writeFile(module.exports.backgroundImageFile, file.data, (err) => {
        res.writeHead(err ? 400 : 201, headers);
        res.end();
        next();
      })
    })

    // var form = new formidable.IncomingForm();

    // form.parse(req,
    //   function (err, fields, files) {
    //     console.log(files.file.path);
    //     var oldpath = files.file.path;

    //     var newpath = path.join(__dirname, 'background.jpg');

    //     fs.rename(oldpath, newpath, function (err) {
    //       if (err) throw err;
    //       res.writeHead(200, headers);
    //       res.write('File uploaded and moved!');
    //       res.end();
    //     });
    // });
  }

  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.write(['Up','Down','Left','Right'][Math.floor(Math.random() * 4)]);
      res.end();
      next();
    }

    if (req.url === '/?random') {
      res.writeHead(200, headers);
      res.write(['Up','Down','Left','Right'][Math.floor(Math.random() * 4)]);
      res.end();
      next();
    }

    if (req.url === '/?serverResponse') {
      res.writeHead(200, headers);
      res.write(messageArray.dequeue());
      res.end();
      next();
    }
    if (req.url === '/background.jpg') { // .match(/jpg$/i)
      fs.readFile(module.exports.backgroundImageFile, (err, fileData) => {
        if (err) {
          res.writeHead(404, headers);
        } else {
          res.writeHead(200, {
            'content-type': 'image/jpeg',
            'content-length': fileData.length
          })
          res.write(fileData, 'binary');
        }
        res.end();
        next();
      });

      // console.log('url : ' + req.url);
      // if (fs.existsSync(path.join(__dirname, req.url)) === false) {
      //   res.writeHead(404, 'No resource at that location', headers);
      //   res.end();
      // } else {
      //   var filePath = path.join(__dirname, 'background.jpg');
      //   var img = fs.readFileSync(filePath);
      //   headers['content-type'] = 'image/jpeg';
      //   res.writeHead(200, headers);
      //   res.end(img, 'binary');
      // }

    }
  }
 // next(); // invoke next() at the end of a request to help with testing!
};
