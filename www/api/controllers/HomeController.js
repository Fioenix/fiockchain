/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: function(req, res) {
    return res.view("pages/home", {
      blockchain: JSON.stringify(sails.config.fiockchain, null, 3)
    });
  },
  add: function(req, res){

    let data = req.body;
    let result = sails.config.fiockchain.add(data.text);

    return result ? res.ok() : res.serverError();
  }
};
