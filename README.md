# Vocabulary gradient

`Vocabulary gradient` is a small javascript application which analyzes a given text and tell you how often each word is use in the general vocabulary.

The word frequency list is based off wiktionary list of the 40000 most frequently used words in the Project Gutenberg library (the frequency list as of 2006-04-16).

## Getting started

Simply open `index.html` in your browser and paste a text you would like to analyze. When you submit the form, the text you submitted will appear below and display the the index of the word (in subscript) based on its frequency. In other word, the closer you are to zero, the more frequently this word is used.

Some words may not be found in the word frequency list and they will be highlighted in yellow and will display an index value of "?".

## Sources

* https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/1-10000
* https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/10001-20000
* https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/20001-30000
* https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/30001-40000

## License

The code is licensed under the [MIT license](http://choosealicense.com/licenses/mit/). See [LICENSE](LICENSE).
