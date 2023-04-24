// node .\middleware.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const eventConnect = require('./dataevent.js')

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3030);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});

let id = [];
let menu = [];
let menu_sub = [];
let cate_tab = [];
let cate_cont = [];
let cate_count = [];

const usersQuery = 'select *from users;';
const menuQuery = 'select *from menu;';
const subQueryJoin = 'SELECT a.menu_id, a.menu, b.sub_id, b.sub_nm FROM menu AS a INNER JOIN menu_sub AS b ON a.menu_id = b.parent_id GROUP BY a.menu_id, b.sub_id ORDER BY a.menu_id, b.sub_id; ';
const cateQuery = 'select *from photo_category ;';
const cateCount = 'SELECT a.cate_code, a.cate_nm, COUNT(*) AS count FROM photo_category AS a INNER JOIN photo_cont AS b ON a.cate_code = b.cate_code group by a.cate_code, a.cate_nm order BY a.cate_code;'
const cateQueryJoin = 'SELECT a.cate_code, a.cate_nm, b.cont_id, b.photo_url, b.photo_txt, b.photo_time, b.photo_user FROM photo_category AS a INNER JOIN photo_cont AS b ON a.cate_code = b.cate_code ORDER BY b.cont_id;';

app.get('/api', function (req, res) {
  res.send({ id: id, menu: menu, menu_sub: menu_sub, cate_tab: cate_tab, cate_cont: cate_cont, cate_count: cate_count });
});

connection.connect();

function dbInit() {
  connection.query(menuQuery + subQueryJoin + cateQuery + cateCount + cateQueryJoin, function (error, result, fileds) {
    if (error) throw error;
    menu = result[0];
    menu_sub = result[1];
    cate_tab = result[2];
    cate_count = result[3];
    cate_cont = result[4];
  });
}

dbInit()

app.post('/api', function (req, res) {

  switch(req.body.func) {
    case 'cateClick':
      eventConnect.cateClick(req.body, res);
      break;
    case 'cateAdd':
      eventConnect.cateAdd(req.body, res);
      break;
    case 'cateDelete':
      eventConnect.cateDelete(req.body, res);
      break;
  }
});

//connection.end();