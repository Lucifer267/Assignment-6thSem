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

program : stmt program           { printf("Processing next statement recursively\n"); }
        | stmt                      { printf("End of program\n"); }
        ;

stmt : ID '=' expr ';'              { printf("Valid Assignment Expression\n"); }
     | TYPE ID ';'                  { printf("Valid Declaration\n"); }
     | '{' block '}'                { printf("Valid Block Statement\n"); }
     | compound_stmt                { printf("Compound statement processed\n"); }
     ;

block : stmt block                  { printf("Block continues recursively\n"); }
      | stmt                        { printf("Block ends\n"); }
      ;

compound_stmt : compound_stmt stmt  { printf("Compound continues recursively\n"); }
              | stmt                { printf("Single statement in compound\n"); }
              ;

expr : expr '+' term
     | expr '-' term
     | term
     ;

term : term '*' factor
     | term '/' factor
     | factor
     ;

factor : '(' expr ')'               { printf("Expression in parentheses\n"); }
       | ID                          { printf("Identifier found\n"); }
       | NUM                         { printf("Number found\n"); }
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