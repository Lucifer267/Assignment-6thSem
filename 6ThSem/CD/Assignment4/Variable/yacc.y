%{
    #include <stdio.h>
    #include <stdlib.h>

    void yyerror(const char *s);
    int yylex();
%}

%token INT FLOAT DOUBLE CHAR LONG SHORT VOID
%token IDENTIFIER NUMBER

%%

start: declaration
     ;

declaration:
        datatype IDENTIFIER ';'
            { printf("Valid Declaration\n"); }
      | datatype IDENTIFIER '=' NUMBER ';'
            { printf("Valid Initialized Declaration\n"); }
      ;

datatype:
        INT
      | FLOAT
      | DOUBLE
      | CHAR
      | LONG
      | SHORT
      | VOID
      ;

%%

void yyerror(const char *s){
    printf("Invalid Declaration\n");
}

int main(){
    printf("Enter Variable Declaration: ");
    yyparse();
    return 0;
}