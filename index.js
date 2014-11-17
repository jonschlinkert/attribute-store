'use strict';

/**
 * Module dependencies
 */

var cheerio = require('cheerio');
var matter = require('gray-matter');
var _ = require('lodash');

function Store(html) {
  this.html = html;
}

Store.prototype.set = function(id, context) {
  if (typeof id !== 'string') {
    context = id;
    id = null;
  }

  context = context || {};
  id = id || context.id || 'metadata';

  var page = matter(this.html);
  var content = page.content;

  var $ = cheerio.load(content);

  var script = '<script type="text/x-metadata" id="' + id + '"></script>';
  if ($('#' + id).length === 0) {
    if ($('body').length) {
      $('body').append(script);
      content = $.html();
    } else {
      content += script;
    }
  }

  var data = _.merge({}, context, page.data);
  var attr = $('#' + id).attr('data-metadata');
  if (attr) {
    data = _.merge({}, JSON.parse(attr), data);
  }

  $ = cheerio.load(content);
  $('#' + id).attr('data-metadata', JSON.stringify(data));

  this.html = $.html();
};


Store.prototype.get = function(id) {
  var id = id || 'metadata';
  var results = cheerio.load(this.html)('#' + id).data('metadata');
  return results;
};

module.exports = function(html) {
  return new Store(html);
};