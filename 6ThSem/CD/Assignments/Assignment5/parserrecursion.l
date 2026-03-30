%{
#include "parserrecursion.tab.h"
#include <ctype.h>
#include <stdlib.h>
#include <string.h>

int yywrap() {
    return 1;
}
%}

%%
"int"|"float"|"char"|"double"  { return TYPE; }
[a-zA-Z_][a-zA-Z0-9_]*         { return ID; }
[0-9]+                         { return NUM; }
"+"                            { return '+'; }
"-"                            { return '-'; }
"*"                            { return '*'; }
"/"                            { return '/'; }
"="                            { return '='; }
";"                            { return ';'; }
"("                            { return '('; }
")"                            { return ')'; }
"{"                            { return '{'; }
"}"                            { return '}'; }
[ \t\n]+                       { /* skip whitespace */ }
.                              { return yytext[0]; }
%%
