# Spelling-flexible-page-find
Chrome extension to find items on a page within a bound of Levenshtein edit distance. It's available at https://chrome.google.com/webstore/detail/spelling-flexible-find/laaabbefkghdmbmpaiddindkppmacaol?utm_source=gmail.

You can also install it locally by downloading the directory, going to chrome://extensions, loading unpacked directory, and choosing this directory. 

Spelling flexible find allows you to find results on a web page within a bound of spelling differences (levenshtein-edit distance). 

This can be useful to find results on the page even if they're mizzpelled, to find results if you're unsure how a word is spelled, or a combination of the two. 

I recommend setting a shortcut to spelling flexible find under control-shift. 

Usage:

Spelling flexible find is meant to find single words. It use space, exclamation marks, periods, commas, colons, and semi-colons as regex to indicate a new word. For a detailed explanation, see the bottom of this description. 
Spelling flexible find uses many of the same controls as the chrome page find, so it should be intuitive. 

Enter: go to next result
Shift-enter: go to previous result 

Click on the plus and minus buttons to edit the allowed distance of spelling differences. Plus is more lenient, and minus is less. 0 indicates that a word must be the same exact string you have searched for, or your string must be a prefix to that word.

Clicking on the web page will hide this extension, and keep the current highlighting. If you wish to remove the highlighting, first clear the search bar, then continue. 

Why does it only find a single word ?

If the extension doesn't use delimiting characters, then any subsection of any text is potentially a word. With 100 characters, there are 5050 different possible strings. Put more generally, for an n length string there are O(n^2) different possible words. Because we are randomly going across different words, most of these strings will be distinct. By using delimitting characters, we limit the number of strings to check to the number of distinct words on a page.

Further, finding the Levenshtein distance between two words is computationally intensive (O(n^2)). Not computationally intensive enough to make this extension infeasible, but infeasible enough that performing on all possible word combinations in a string would be infeasible (and O(n^3)). 

You can enter multiple words, and that string will be searched the same, but the text candidates to match it up against will not contain any of the delimiting characters. 

TODOS: 
If the user enters a string with delmitting characters, use straightford regex matching instead of lev-edit (Maybe?).
Use runtime connect instead of message passing.
Use something other than bootstrap for styling.









