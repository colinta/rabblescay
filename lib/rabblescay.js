
/*!
 * Rabblescay
 * Copyright(c) 2011 Colin Thomas-Arnold <colinta@mac.com>
 * MIT Licensed
 */

/**
 * Library version.
 */
var fs = require('fs');

var Rabblescay = function(search, letters, dictionary, callback)
{
  var dictionary = __dirname + '/words.txt';
  if ( callback )
  {
    fs.readFile(dictionary, 'utf8', function(err, data)
    {
      if ( err )  callback(err);
      else
      {
        try
        {
          callback(null, Rabblescay.matchWords(search, letters, data));
        }
        catch( e )
        {
          callback(e);
        }
      }
    });
  }
  else
  {
    var data = fs.readFileSync(dictionary, 'utf8');
    try
    {
      return Rabblescay.matchWords(search, letters, data);
    }
    catch ( e )
    {
      console.error( e.message );
    }
  }
};

Rabblescay.matchWords = function(search, letters, data)
{
  var i;
  var contains_star = false;
  if ( letters && letters.length )
  {
    var regex_letters;
    if ( typeof letters == 'string' )
    {
      letters = letters.split('');
    }

    for ( i = 0 ; i < letters.length ; ++i )
    {
      if ( letters[i] === '*' )
        contains_star = true;
      else
        letters[i] = letters[i].toLowerCase();
    }

    if ( contains_star )
    {
      regex_letters = '[a-z]';
      search = search.replace(/\./g, regex_letters);
    }
    else
    {
      regex_letters = '[' + letters.join('') + ']';
      search = search.replace(/\./g, regex_letters);
    }
  }
  else
  {
    letters = null;
  }

  var regex = new RegExp('^' + search + '$', 'i');

  var words = data.toString().split("\n");
  var ret = [];
  for ( var word_i = 0; word_i < words.length; ++word_i)
  {
    word = words[word_i].toLowerCase();
    var check = false;
    if ( word.match(regex) )
    {
      check = true;

      if ( letters )
      {
        if ( process.env.rabblescay_debug )  console.log(['matchWords('+word+')'], {
          'checking': word
          });
        check = Rabblescay.check(word, search, letters);
      }
    }

    if ( check )
    {
      if ( process.env.rabblescay_debug )  console.log(['matchWords('+word+')'], {
        'adding': word
        });
      ret.push(word);
    }
  }
  if ( process.env.rabblescay_debug )  console.log(['matchWords('+word+')'], {letters:letters, search:search, results: ret});
  return ret;
};


Rabblescay.check = function(word, search, letters)
{
  if ( word.length === 0 )  return true;
  if ( ! word.match(new RegExp('^' + search + '$', 'i')) )
  {
    if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
      'doesnt match': search
    });
    return false;
  }

  var examine = search.match(/^([a-z])|(\[.*?\])(\?|[+*]\??|\{[0-9,]+\})?/i);
  if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
    'search': search,
    'letters': letters,
    'examine': examine
    });
  if ( ! examine )  return false;
  
  if ( examine[1] )
  {
    var letter = examine[1];
    if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
      'letter': letter
      });
    // skip to next letter and continue
    return Rabblescay.check(word.substring(1), search.substring(1), letters);
  }
  else
  {
    var regex = new RegExp('^' + examine[2] + (examine[3] ? examine[3] : ''), 'i');
    var match = word.match(regex);
    if ( ! match )  return false;
    if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
      'regex': regex,
      'match' : match
      });
    var matched = match[0];
    
    for ( var i = matched.length; i > 0; --i )
    {
      var check_part = matched.substring(0, i);
      if ( ! check_part.match(regex) )  continue;
      
      if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
        'check_part': check_part
        });
      // check letters
      var new_letters = Rabblescay.checkLetters(check_part, letters);
      if ( process.env.rabblescay_debug )  console.log(['check('+word+')'], {
        'new_letters': new_letters
        });
      if ( new_letters && Rabblescay.check(word.substring(check_part.length), search.substring(examine[0].length), new_letters) )  return true;
    }
    // check "empty"
    if ( process.env.rabblescay_debug && ''.match(regex) )  console.log(['checkEmpty('+word+')'], {
      'search': search.substring(examine[0].length),
      'letters': letters
      });
    
    if ( ''.match(regex) && Rabblescay.check(word, search.substring(examine[0].length), letters) )  return true;
  }
  return false;
};

Rabblescay.checkLetters = function(check_part, letters)
{
  var check_letters = letters.slice(0);
  var contains_star = false;
  for ( i = 0 ; i < letters.length ; ++i )
  {
    if ( letters[i] === '*' )
    {
      contains_star = true;
      break;
    }
  }
  
  for ( i = 0; i < check_part.length; ++i )
  {
    var eatup_letter = check_part[i];

    var check_index = check_letters.indexOf(eatup_letter);
    if ( check_index === -1 && contains_star )  check_index = check_letters.indexOf('*');

    if ( check_index !== -1 )
    {
      if ( process.env.rabblescay_debug )  console.log(['checkLetters('+check_part+')'], {
        'removing': eatup_letter + ' (' + check_letters[check_index] + ')'
        });
      delete check_letters[check_index];
    }
    else
    {
      if ( process.env.rabblescay_debug )  console.log(['checkLetters('+check_part+')'], {
        'not found': eatup_letter
        });
      return false;
    }
  }
  if ( process.env.rabblescay_debug )  console.log(['checkLetters('+check_part+')'], {
    'returning': check_letters
    });
  return check_letters;
};

Rabblescay.version = '0.0.1';

module.exports = Rabblescay;
