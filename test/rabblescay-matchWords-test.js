
var vows = require('vows'),
    assert = require('assert');
var rabblescay = require('../lib/rabblescay.js');

// Fake words, so we know we're using this data source
var data = "aake,dake,eake,gake,iake,kake,nake,oake,pake,qake,uake,vake,xake,yake,zake";
data += "\naaked,dakee,eakeg,gakei,iakek,kaken,nakeo,oakep,pakeq,qakeu,uakev,vakex,xakey,yakez,zakea";
data = data.replace(/,/g, "\n");

function matchWordsError(message)
{
  return {
    topic: function()
      {
        var match = this.context.name.match(/for "(.*?)"/);
        if ( ! match )  throw Error('Could not figure out how to test "' + this.context.name + '"');
        var search = match[1];
        try
        {
          return rabblescay.matchWords(search, "abcdefg".split(''), data);
        }
        catch ( e )
        {
          return e;
        }
      },
    'we get an error': function(ret)
      {
        assert.isTrue(ret instanceof Error);
        if ( message )  assert.equal(message, ret.message);
      }
    };
}

function matchWordsTest(expected)
{
  var expected_words_ary, expected_words;
  if ( typeof expected == "string" )
  {
    expected_words = expected;
    expected_words_ary = expected.split(',');
  }
  else
  {
    expected_words = expected.join(',');
    expected_words_ary = expected;
  }

  var ret = {
    topic: function()
      {
        var match = this.context.name.match(/for "(.*?)".*letters "([a-zA-Z*]*)"/);
        if ( ! match )  throw Error('Could not figure out how to test "' + this.context.name + '"');
        var search = match[1];
        var letters = match[2].split('');

        try
        {
          return rabblescay.matchWords(search, letters, data);
        }
        catch ( e )
        {
          return e;
        }
      }
  };
  
  ret['we do not get an error'] = function(ret)
    {
      assert.isFalse(ret instanceof Error);
    };
  ret['we get [' + expected_words + ']'] = function(ret)
    {
      assert.deepEqual(ret, expected_words_ary);
    };
  return ret;
}

vows.describe('Matching words using Rabblescay.matchWords').addBatch({
  'when using data': {
      topic: data,
      'our data is what we expected': function(topic) {
        assert.equal(topic, "aake\ndake\neake\ngake\niake\nkake\nnake\noake\npake\nqake\nuake\nvake\nxake\nyake\nzake\naaked\ndakee\neakeg\ngakei\niakek\nkaken\nnakeo\noakep\npakeq\nqakeu\nuakev\nvakex\nxakey\nyakez\nzakea");
      }
    },
  'when searching for ".ake", with letters "abcdefg"': matchWordsTest("aake,dake,eake,gake"),
  'when searching for ".ake.", with letters "abcdefg"': matchWordsTest("aaked,dakee,eakeg"),
  'when searching for ".ake.[", with letters "abcdefg", error': matchWordsError()
  }).export(module);
