%{
#include <stdio.h>
%}

%%
[ \t]+        ;
IS|AM|are     { printf("%s is a verb\n", yytext); }
[a-zA-Z]+    { printf("%s is an invalid token\n", yytext); }
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
