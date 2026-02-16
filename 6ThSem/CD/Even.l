%{
#include <stdio.h>
%}

%%

^(aa|bb|(ab|ba)(aa|bb)*(ab|ba))*$    { printf("Valid\n"); }
^[ab]+$                              { printf("Invalid\n"); }
\n                                    { /* ignore newline */ }
.                                     { /* ignore everything else */ }

%%

int yywrap() { return 1; }

int main() {
    printf("Enter strings (Ctrl+Z to exit):\n");
    while (yylex()) { }
    printf("Exiting...\n");
    return 0;
}
