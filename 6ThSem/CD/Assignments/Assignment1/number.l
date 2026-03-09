%{
#include <stdio.h>
int yywrap();
int yylex();
%}

%%

[0-9]+     { printf("NUMBER\n"); }
[a-zA-Z]+  { printf("NOT A NUMBER\n"); }
.          { printf("INVALID\n"); }

%%

int main() {
    yylex();
    return 0;
}

int yywrap() {
    return 1;
}