module.exports = function (app) {

  const pageModel = require("../models/page/page.model.server");
  const widgetModel = require("../models/widget/widget.model.server");

  app.post("/api/website/:websiteId/page", createPage);
  app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
  app.get("/api/page/:pageId", findPageById);
  app.put("/api/page/:pageId", updatePage);
  app.delete("/api/page/:pageId", deletePage);

  function createPage(req, res) {
    const websiteId = req.params.websiteId;
    const page = req.body;
    page._websiteId = websiteId;
    pageModel.createPage(websiteId, page).then(function(page) {
      // console.log('created page: ' + page);
      pageModel.findAllPagesForWebsite(websiteId).then(function(pages) {
        res.status(200).json(pages);
      })
    }, function(err){
      console.log(err);
      res.status(500).send(err);
    });
  }

  function findAllPagesForWebsite(req, res) {
    const websiteId = req.params['websiteId'];
    pageModel.findAllPagesForWebsite(websiteId)
      .then(function(pages) {
        // console.log('found all pages for website: ' + pages);
        res.status(200).json(pages);
      }, function(err) {
        console.log(err);
        res.status(500).send(err);
      });
  }

  function findPageById(req, res) {
    const pageId = req.params['pageId'];
    pageModel.findPageById(pageId)
      .then(function(page) {
        // console.log('found page by id: ' + page);
        res.status(200).json(page);
      }, function(err) {
        console.log(err);
        res.status(500);
    });
  }

  function updatePage(req, res) {
    const pageId = req.params['pageId'];
    const page = req.body;
    pageModel.updatePage(pageId, page)
      .then(function(response) {
        // console.log('updated page: pageId = ' + pageId);
        res.status(200).json({});
      }, function(err) {
        console.log(err);
        res.status(500).send(err);
      });
  }

  function deletePage(req, res) {
    const pageId = req.params['pageId'];
    pageModel.deletePage(pageId)
      .then(function(response){
        widgetModel.findAllWidgetsForPage(pageId)
          .then(function(widgets) {
            widgets.forEach(function(widget) {
              widgetModel.deleteWidget(widget._id);
            })
          });
        // console.log('deleted page: pageId = ' + pageId);
        res.status(200).json({});
      }, function(err) {
        console.log(err);
        res.status(500).send(err);
      });
  }
};
