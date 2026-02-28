%{
    #include "y.tab.h"
%}

%option noyywrap

%%

int             { return INT; }
float           { return FLOAT; }
double          { return DOUBLE; }
char            { return CHAR; }
long            { return LONG; }
short           { return SHORT; }
void            { return VOID; }

[a-zA-Z_][a-zA-Z0-9_]*    { return IDENTIFIER; }

[0-9]+(\.[0-9]+)?        { return NUMBER; }

[ \t\n]                   { ; }

.                         { return yytext[0]; }

%%