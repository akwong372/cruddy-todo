const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, id) => {
    if (error) {
      throw new Error("Error: ", error);
    }
    fs.writeFile(this.dataDir + '/' + id + '.txt', text, (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  return new Promise((resolve, reject) => {
    fs.readdir(this.dataDir, (error, data) => {
      if (error) {
        callback(error);
      }

      resolve(data);
    })
  }).then((fileNames)=>{
    var mapped = Promise.map(fileNames, (fileName)=> {
      // Promise.map awaits for returned promises as well.
        return fs.readFile(this.dataDir + '/' + fileName, 'utf8', (err, content)=>{
          JSON.stringify({id: fileName.split('.txt').join(''), text: content});
        });
      })
    Promise.all(mapped).then((data)=>{console.log(data)});
  })
    // .then(function (data) {
    //   var check = data.map((uri)=>{
    //     return fs.readFile(this.dataDir + '/' + uri, 'utf8', (err, fileData)=>{
    //       if (err) {
    //         throw new Error ('Error');
    //       }
    //       return fileData;
    //     })
    //   });
    //   Promise.all(check).then((result)=> console.log(result));
    // })
    // (error, files) => {
    //   if (error) {
    //     reject(error);
    //   } else {
    //     var data = [];
    //     _.each(files, (id) => {
    //       data.push({ 'id': id.split('.txt').join(''), 'text': id.split('.txt').join('') });
    //     });
    //     console.log('--------------data:', data)
    //     resolve(data);
    //   }
    // });
};

exports.readOne = (id, callback) => {

  fs.readFile(this.dataDir + '/' + id + '.txt', 'utf8', (error, content) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id, 'text': content });
    }
  });

};

exports.update = (id, text, callback) => {
  fs.readFile(this.dataDir + '/' + id + '.txt', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(this.dataDir + '/' + id + '.txt', text, (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(this.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
