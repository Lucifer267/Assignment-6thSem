%{
#include <stdio.h>
%}

%%

((aa|bb)*(ab|ba)(aa|bb)*) { printf("Valid\n"); }

[ab]+    { printf("Invalid\n"); }

\n       { }

.        { }

%%

int yywrap() { return 1; }

int main() {
    printf("Enter strings (Ctrl+Z to exit):\n");
    yylex();
    return 0;
}
