%{
#include <stdio.h>
#include <stdlib.h>

void yyerror(const char *s);
int yylex();
%}

%token ID NUM TYPE
%left '+' '-'
%left '*' '/'

%%

program : program stmt
        | stmt
        ;

stmt : ID '=' expr ';'      { printf("Valid Assignment Expression\n"); }
     | TYPE ID ';'          { printf("Valid Declaration\n"); }
     ;

expr : expr '+' expr
     | expr '-' expr
     | expr '*' expr
     | expr '/' expr
     | '(' expr ')'
     | ID
     | NUM
     ;

%%

void yyerror(const char *s)
{
    printf("Invalid Expression\n");
}

int main()
{
    printf("Enter statements:\n");
    yyparse();
    return 0;
}