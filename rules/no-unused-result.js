'use strict';

var _ = require('lodash/fp');
var enhance = require('./core/enhance');

var forEachMethods = ['forEach', 'forEachRight', 'forIn', 'forInRight', 'forOwn', 'forOwnRight'];
var isForEach = _.flow(
  _.get('realName'),
  _.includes(_, forEachMethods)
);

function isMethodCall(info, node) {
  var method = info.helpers.isMethodCall(node);
  if (method) {
    return method;
  }
  if (info.helpers.isCallExpression(node.callee)) {
    return isMethodCall(info, node.callee);
  }
  return false;
}

module.exports = function (context) {
  var info = enhance();

  return info.merge({
    ExpressionStatement: function (node) {
      var method = isMethodCall(info, node.expression);
      if (method && !isForEach(method)) {
        context.report(node, 'Unused expression');
      }
    }
  });
};
