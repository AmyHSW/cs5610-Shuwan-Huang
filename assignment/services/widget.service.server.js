module.exports = function (app) {

  var _path = require('path');

  var multer = require('multer'); // npm install multer --save
  var upload = multer({ dest: __dirname + '/../../src/assets/uploads' });

  app.post("/api/page/:pageId/widget", createWidget);
  app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
  app.get("/api/widget/:widgetId", findWidgetById);
  app.put("/api/widget/:widgetId", updateWidget);
  app.delete("/api/widget/:widgetId", deleteWidget);
  app.put("/api/page/:pageId/widget?", reorderWidgets);

  //UPLOAD
  app.post ("/api/upload", upload.single('myFile'), uploadImage);

  const widgets = [
    {_id: '1', type: 'HEADER', pageId: '321', size: '2', text: 'GIZMODO'},
    {_id: '2', type: 'HEADER', pageId: '321', size: '4', text: 'Lorem ipsum'},
    {_id: '3', type: 'IMAGE', pageId: '321', size: '2', text: 'text', width: '100%',
      url: 'http://lorempixel.com/400/200/'},
    {_id: '4', type: 'IMAGE', pageId: '321', size: '2', text: 'my image', width: '100%',
      url: 'http://food.fnr.sndimg.com/content/dam/images/food/fullset/2009/11/4/2/FNM_120109-Sugar-Fix-006_s4x3.jpg'
      + '.rend.hgtvcom.616.462.suffix/1382539033745.jpeg'},
    {_id: '5', type: 'YOUTUBE', pageId: '321', size: '2', text: 'text', width: '100%',
      url: 'https://www.youtube.com/embed/d5nCbSNS9mA'}
  ];

  function createWidget(req, res) {
    const widget = req.body;
    widget._id = (new Date()).getTime().toString();
    console.log('create new widget: ' + widget._id);
    widgets.push(widget);
    res.json(widget);
  }

  function findAllWidgetsForPage(req, res) {
    const pageId = req.params['pageId'];
    const resultSet = widgets.filter(function (widget) {
      return widget.pageId === pageId;
    });
    if (resultSet) {
      console.log("find widgets for page: success");
      res.json(resultSet);
    } else {
      console.log("find widgets for page: not found");
      res.json({});
    }
  }

  function findWidgetById(req, res) {
    const widgetId = req.params['widgetId'];
    const widget = widgets.find(function (widget) {
      return widget._id === widgetId;
    });
    if (widget) {
      console.log("find widget by id: " + widget._id);
      res.json(widget);
    } else {
      console.log("find widget by id: not found");
      res.json({});
    }
  }

  function updateWidget(req, res) {
    const widgetId = req.params['widgetId'];
    const widget = req.body;
    for (const i in widgets) {
      if (widgets[i]._id === widgetId) {
        console.log(req.body);
        console.log("update widget: " + widgetId);
        switch (widgets[i].type) {
          case 'HEADER':
            widgets[i].name = widget.name;
            widgets[i].text = widget.text;
            widgets[i].size = widget.size;
            widgets[i].url = "";
            widgets[i].width = "";
            res.status(200).send(widgets[i]);
            return;
          case 'IMAGE':
            widgets[i].name = widget.name;
            widgets[i].text = widget.text;
            widgets[i].size = "";
            widgets[i].url = widget.url;
            widgets[i].width = widget.width;
            res.status(200).send(widgets[i]);
            return;
          case 'YOUTUBE':
            widgets[i].name = widget.name;
            widgets[i].text = widget.text;
            widgets[i].size = "";
            widgets[i].url = widget.url;
            widgets[i].width = widget.width;
            res.status(200).send(widgets[i]);
            return;
          case 'HTML':
            widgets[i].name = widget.name;
            widgets[i].text = widget.text;
            widgets[i].size = "";
            widgets[i].url = "";
            widgets[i].width = "";
            res.status(200).send(widgets[i]);
            return;
          case 'TEXT':
            widgets[i].name = widget.name;
            widgets[i].text = widget.text;
            widgets[i].size = widget.size;
            widgets[i].url = "";
            widgets[i].width = "";
            res.status(200).send(widgets[i]);
            return;
          default:
            res.status(404).send("widget type not supported");
        }
      }
    }
    res.status(404).send("not found!");  }

  function deleteWidget(req, res) {
    const widgetId = req.params['widgetId'];
    for (const i in widgets) {
      if (widgets[i]._id === widgetId) {
        const j = +i;
        res.json(widgets[i]);
        console.log('delete widget: ' + widgetId);
        widgets.splice(j, 1);
        return;
      }
    }
  }

  function reorderWidgets(req, res) {
    //var pageId = req.params.pageId;
    const startIndex = parseInt(req.query.initial);
    const endIndex = parseInt(req.query.final);
    widgets.splice(endIndex, 0, widgets.splice(startIndex, 1)[0]);
    res.json(200);
  }

  function uploadImage(req, res) {
    const userId = req.body.userId;
    const websiteId = req.body.websiteId;
    const pageId = req.body.pageId;
    const widgetId = req.body.widgetId;
    const width = req.body.width;
    const name = req.body.name;
    const text = req.body.text;

    const myFile = req.file;

    console.log(req.file);

    // const callbackUrl = "http://localhost:3100/user/" + userId + "/website/" + websiteId
    //   + "/page/" + pageId + "/widget";
    const callbackUrl = "https://cs5610-webdev-spring2018.herokuapp.com/user/" + userId + "/website/" + websiteId
      + "/page/" + pageId + "/widget";
    if(myFile == null) {
      res.redirect(callbackUrl + '/' + widgetId);
      return;
    }

    const originalname = myFile.originalname; // file name on user's computer
    const filename = myFile.filename;     // new file name in upload folder
    const path = myFile.path;         // full path of uploaded file
    const destination = myFile.destination;  // folder where file is saved to
    const size = myFile.size;
    const mimetype = myFile.mimetype;

    if (widgetId === '') {
      const widget =
        {_id: '', type: 'IMAGE', pageId: pageId, size: '', text: '', width: '', url: '', name: ''};
      widget._id = (new Date()).getTime().toString();
      widget.url = 'uploads/' + filename;
/*      widget.name = name;
      widget.text = text;
      widget.width = width;*/
      console.log('create new widget: ' + widget._id);
      widgets.push(widget);
      res.redirect(callbackUrl + '/' + widget._id);
      return;
    }

    for (let i = 0; i < widgets.length; i++) {
      if (widgets[i]._id === widgetId) {
        widgets[i].url = 'uploads/' + filename;
/*        widgets[i].name = name;
        widgets[i].text = text;
        widgets[i].width = width;*/
        break;
      }
    }

    res.redirect(callbackUrl + '/' + widgetId);
  }
};
