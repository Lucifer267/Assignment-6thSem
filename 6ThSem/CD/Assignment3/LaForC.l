%{
#include <stdio.h>
%}
DIGIT   [0-9]
ID      [a-zA-Z_][a-zA-Z0-9_]*
HEADER  \<[a-zA-Z0-9\.]+\.h\>
%%
"#include"              { printf("Keyword: %s\n", yytext); }
{HEADER}                { printf("Header: %s\n", yytext); }
"int"|"float"|"char"|"double"|"void"|"return"|"if"|"else"|"for"|"while"|"printf"|"scanf"|"main" { 
    printf("Keyword: %s\n", yytext); 
}
{ID}                                  { printf("Identifier: %s\n", yytext); }
{DIGIT}+                              { printf("Number: %s\n", yytext); }
"=="|"!="|"<="|">="                   { printf("RelOp: %s\n", yytext); }
"="|"+"|"-"|"*"|"/"|"%"|"<"|">"       { printf("Operator: %s\n", yytext); }
";"|","|"("|")"|"{"|"}"               { printf("Separator: %s\n", yytext); }
\"[^\"]*\"                            { printf("String: %s\n", yytext); }
[ \t\n]+                ;
.                                     { printf("Unknown: %s\n", yytext); }
%%
int main() {
    yylex();
    return 0;
}
int yywrap() { 
    return 1;
}
