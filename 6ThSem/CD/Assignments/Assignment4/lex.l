%{
    #include "y.tab.h"
%}

%option noyywrap

%%

RAM             { return NOUN; }
SAM             { return NOUN; }
RAN             { return VERB; }
SANG            { return VERB; }
Well            { return ADVERB; }
QUICKLY         { return ADVERB; }
[ \t\n]         { ; }
.               { return yytext[0]; }

%%
