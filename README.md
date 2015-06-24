
# Rabblescay

  Uses regex-based (simpler, for non-programmers) search patterns to help find... words

## Installation

    npm install rabblescay

## Usage

    > rabblescay ".{1,2}oat.?"
    bloat
    bloats
    boat
    boats
    coat
    coati
    coats
    doat
    doats
    float
    floats
    floaty
    gloat
    gloats
    goat
    goats
    groat
    groats
    loath
    moat
    moats
    shoat
    shoats
    stoat
    stoats

But if you want to give it your letters, it will use those (and be smart about it!)

    > rabblescay ".{1,2}oat.?" bfsl
    bloat
    bloats
    boat
    boats
    float
    floats

*Notice*: It included words with *one* `s`, but not words with *two* `s`s.

To indicate a blank tile, use '*' in your letters.

    > rabblescay ".{1,2}oat.?" bfs*
    bloat
    bloats
    boat
    boats
    coat
    coats
    doat
    doats
    float
    floats
    goat
    goats
    moat
    moats
    shoat
    stoat

## Test

    > vows
    ································ ······
      ✓ OK » 38 honored (1.670s)

## License

(The MIT License)

Copyright (c) 2011 Colin Thomas-Arnold <colinta@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
