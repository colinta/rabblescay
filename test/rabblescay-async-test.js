
var vows = require('vows'),
    assert = require('assert');
var rabblescay = require('../lib/rabblescay.js');

function rabblescayAsyncError(message)
{
  return {
    topic: function()
      {
        var match = this.context.name.match(/for "(.*?)"/);
        if ( ! match )  throw Error('Could not figure out how to test "' + this.context.name + '"');
        var search = match[1];
        return rabblescay(search, "abcdefg".split(''), this.callback);
      },
    'we get an error': function(err, results)
      {
        assert.equal(results, null);
        assert.isTrue(err instanceof Error);
      }
    };
}

function rabblescayAsyncTest(expected)
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

        return rabblescay(search, letters)
      }
  };

  ret['we do not get an error'] = function(err, results)
    {
      if ( err instanceof Error )  assert.equal(err.message, '');
      assert.isFalse(err instanceof Error);
    };
  ret['we get [' + expected_words + ']'] = function(err, results)
    {
      assert.deepEqual(results, expected_words_ary);
    };
  return ret;
}



vows.describe('Performing a rabblescay search').addBatch({
  'when entering a search for ".ur.*", with letters "bruqiye"': rabblescayAsyncTest("bur,burier,burr,burry,bury"),
  'when entering a search for ".+[UYE]P", with letters "BRUQIYE"': rabblescayAsyncTest("rep,yep,yup"),
  'when entering a search for ".?ur.*", with letters "bruqiye"': rabblescayAsyncTest("bur,burier,burr,burry,bury,urb"),
  'when entering a search for ".ake", with letters "bcfgtlm"': rabblescayAsyncTest("bake,cake,fake,lake,make,take"),
  'when entering a search for ".?ace.", with letters "bcfgtld"': rabblescayAsyncTest("aced,faced,facet,laced"),
  'when entering a search for ".ake.", with letters "bcfdtlm"': rabblescayAsyncTest("baked,caked,faked,laked"),
  'when entering a search for "f[ea].t", with letters "aceolin"': rabblescayAsyncTest("fact,feat,felt"),
  'when entering a search for "f.{2}t", with letters "aceolin"': rabblescayAsyncTest("fact,feat,felt,fiat,flat,flit,font"),
  'when entering a search for "f.{5,}", with letters "aceolin"': rabblescayAsyncTest("facile,falcon,fecial,fiance,finale,flacon,folacin"),
  'when entering a search for "f..t", with letters "aceolin"': rabblescayAsyncTest("fact,feat,felt,fiat,flat,flit,font"),
  'when entering a search for ".*[u]r.{2,}", with letters "ziguney"': rabblescayAsyncTest("gurney,urge,urine"),
  'when entering a search for ".a", with letters ""': rabblescayAsyncTest("aa,ba,fa,ha,ka,la,ma,na,pa,ta,ya,za"),
  'when entering a search for "dog", with letters ""': rabblescayAsyncTest('dog'),
  'when entering a search for "dog.y", with letters "*"': rabblescayAsyncTest('dogey,doggy'),
  'when entering a search for "do.*y", with letters "**"': rabblescayAsyncTest('dobby,doby,dodgy,dogey,doggy,dogy,doily,dolly,donsy,doody,dooly,doomy,doozy,dopey,dopy,dorky,dormy,dorty,dory,dotty,doty,dowdy,downy,dowry,doxy,doyly,dozy'),

  // errors
  'when entering a search for "fo{2}t", with letters ""': rabblescayAsyncTest('foot'),
  }).export(module);
