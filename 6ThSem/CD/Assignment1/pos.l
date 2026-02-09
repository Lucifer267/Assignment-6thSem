%{
#include <stdio.h>
%}

%%

[a-zA-Z]+ly        { printf("ADVERB : %s\n", yytext); }

(run|eat|play|go|read|write)   { printf("VERB   : %s\n", yytext); }
[a-zA-Z]+ing       { printf("VERB   : %s\n", yytext); }
[a-zA-Z]+ed        { printf("VERB   : %s\n", yytext); }

(dog|cat|book|boy|girl|car|city|teacher|student) { printf("NOUN   : %s\n", yytext); }

[ \t\n]+           ;

[a-zA-Z]+          { printf("UNKNOWN: %s\n", yytext); }

%%

int yywrap(void)
{
    return 1;
}

int main()
{
    yylex();
    return 0;
}
