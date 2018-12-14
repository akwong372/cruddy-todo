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
  return fs.readdirAsync(this.dataDir).map(fileName => {
    return fs.readFileAsync(`${this.dataDir}/${fileName}`, 'utf8')
      .then(fileData => {
        return {id: fileName.split('.txt')[0], text: fileData};
      });
  })
  .then(content=>
    callback(null, content));
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
