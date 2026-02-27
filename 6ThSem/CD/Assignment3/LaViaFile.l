%{
#include <stdio.h>
#include <stdlib.h>
%}

DIGIT       [0-9]
HEXDIGIT    [0-9a-fA-F]
ID          [a-zA-Z_][a-zA-Z0-9_]*
HEADER      \<[a-zA-Z0-9\.]+\.h\>
FLOAT       [0-9]+\.[0-9]+
HEXNUM      0x[0-9a-fA-F]+

%%

"#include"                          { printf("Preprocessor: %s\n", yytext); }
{HEADER}                            { printf("Header: %s\n", yytext); }
"int"|"float"|"char"|"double"       { printf("DataType: %s\n", yytext); }
"void"                              { printf("Keyword: %s\n", yytext); }
"main"|"return"                     { printf("FunctionKeyword: %s\n", yytext); }
"printf"|"scanf"                    { printf("IOKeyword: %s\n", yytext); }
"if"|"else"                         { printf("Conditional: %s\n", yytext); }
"for"|"while"                       { printf("Loop: %s\n", yytext); }
"do"|"switch"|"case"|"break"|"continue" { printf("ControlKeyword: %s\n", yytext); }
"struct"|"typedef"|"unsigned"|"signed" { printf("TypeKeyword: %s\n", yytext); }
"&&"|"||"                           { printf("LogicalOp: %s\n", yytext); }
"!"                                 { printf("LogicalNot: %s\n", yytext); }
"&"|"|"|"^"                         { printf("BitwiseOp: %s\n", yytext); }
"~"|"<<"|">>"                       { printf("BitwiseShift: %s\n", yytext); }
"+="|"-="|"*="|"/="|"%="            { printf("CompoundAssign: %s\n", yytext); }
"++"|"--"                           { printf("IncrementDecrement: %s\n", yytext); }
"="                                 { printf("Assignment: %s\n", yytext); }
"+"|"-"|"*"|"/"|"%"                 { printf("ArithmeticOp: %s\n", yytext); }
"=="|"!="                           { printf("EqualityOp: %s\n", yytext); }
"<"|">"|"<="|">="                   { printf("ComparisonOp: %s\n", yytext); }
"//".*                              { printf("Comment: %s\n", yytext); }
"/*"                                { printf("CommentBlock: %s\n", yytext); }
{FLOAT}                             { printf("FloatNumber: %s\n", yytext); }
{HEXNUM}                            { printf("HexNumber: %s\n", yytext); }
{DIGIT}+                            { printf("Number: %s\n", yytext); }
'.'                                 { printf("CharLiteral: %s\n", yytext); }
\"[^\"]*\"                          { printf("String: %s\n", yytext); }
{ID}                                { printf("Identifier: %s\n", yytext); }
";"                                 { printf("Terminator: %s\n", yytext); }
","                                 { printf("Comma: %s\n", yytext); }
"("|")"                             { printf("Parenthesis: %s\n", yytext); }
"{"|"}"                             { printf("Brace: %s\n", yytext); }
"["|"]"                             { printf("Bracket: %s\n", yytext); }
"->"                                { printf("Arrow: %s\n", yytext); }
[ \t\n\r]+                          ;
.                                   { printf("Unknown: %s\n", yytext); }

%%

int main(int argc, char *argv[]) {
    FILE *file;
    const char *filename = "input.txt";
    
    if (argc > 1) {
        filename = argv[1];
    }
    
    file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "Error: Cannot open file '%s'\n", filename);
        return 1;
    }
    
    yyin = file;
    yylex();
    fclose(file);
    return 0;
}

int yywrap() { 
    return 1;
}
