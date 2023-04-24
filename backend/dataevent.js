const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const cateQueryJoin = 'SELECT a.cate_code, a.cate_nm, b.cont_id, b.photo_url, b.photo_txt, b.photo_time, b.photo_user FROM photo_category AS a INNER JOIN photo_cont AS b ON a.cate_code = b.cate_code ORDER BY b.cont_id;';

const cateClick = function (receiveData, res) {
  //console.log(dataInfo)
  if (receiveData.data != 100) {
    connection.query('SELECT a.cate_code, a.cate_nm, b.cont_id, b.photo_url, b.photo_txt, b.photo_time, b.photo_user FROM photo_category AS a INNER JOIN photo_cont AS b ON a.cate_code = b.cate_code WHERE b.cate_code = ? ORDER BY b.cont_id', receiveData.data, function(err, result) {
      data = result
      res.json({data: data, func: receiveData.func})
    })
  } else {
    connection.query(cateQueryJoin, function(err, result) {
      data = result
      res.json({data: data, func: receiveData.func})
    })
  }
}

const cateAdd = function (receiveData, res) {
  connection.query('INSERT INTO photo_cont (cate_code, photo_url, photo_txt, photo_user, p_user_pw) VALUES (?, ?, ?, ?, ?);' + cateQueryJoin, receiveData.data, function(err, result) {
    data = result
    res.json({data: data[1], func: receiveData.func})
  })
}

const cateDelete = function (receiveData, res) {
  dataSplit = receiveData.data.split(' ')

  connection.query('SELECT cont_id , p_user_pw from photo_cont WHERE cont_id = ? and p_user_pw = ?;', dataSplit, function(err, result) {
    if (result.length == 0) {
      let data = {};
      data['msg'] =  'error';
      data['id'] = dataSplit[0];
      res.json({data: data, func: receiveData.func})
    } else {
      connection.query('DELETE from photo_cont WHERE cont_id = ? and p_user_pw = ?; ' + cateQueryJoin, dataSplit, function(err, result) {
        data = result
        res.json({data: data, func: receiveData.func})
        return
      })
    }
  })
}

exports.cateClick = cateClick;
exports.cateAdd = cateAdd;
exports.cateDelete = cateDelete;