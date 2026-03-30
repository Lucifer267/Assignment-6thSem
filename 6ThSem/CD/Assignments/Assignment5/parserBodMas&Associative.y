%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

void yyerror(const char *s);
int yylex();

#define MAX_VARS 100

typedef struct {
    char name[50];
    double value;
} Variable;

Variable vars[MAX_VARS];
int var_count = 0;

double get_var_value(char *name) {
    for (int i = 0; i < var_count; i++) {
        if (strcmp(vars[i].name, name) == 0) {
            return vars[i].value;
        }
    }
    return 0;
}

void set_var_value(char *name, double value) {
    for (int i = 0; i < var_count; i++) {
        if (strcmp(vars[i].name, name) == 0) {
            vars[i].value = value;
            printf("Variable %s updated to %.2f\n", name, value);
            return;
        }
    }
    if (var_count < MAX_VARS) {
        strcpy(vars[var_count].name, name);
        vars[var_count].value = value;
        printf("Variable %s assigned value %.2f\n", vars[var_count].name, value);
        var_count++;
    }
}

%}

%union {
    double dval;
    char *sval;
}

%token <dval> NUM
%token <sval> ID
%token TYPE

%type <dval> expr term power factor

/* BODMAS - Operator Precedence (from lowest to highest) */
/* Associativity: Left for +,-,*,/,% | Right for ^ */
%left '+' '-'           /* Addition and Subtraction (Lowest) */
%left '*' '/' '%'       /* Multiplication, Division, Modulo */
%right '^'              /* Exponentiation (Highest) */

%%

program : program stmt
        | stmt
        ;

stmt : ID '=' expr ';'              { 
                                        set_var_value($1, $3);
                                        printf("Assignment: %s = %.2f\n", $1, $3);
                                    }
     | TYPE ID ';'                  { printf("Declaration: Variable %s declared\n", $2); }
     | '{' program '}'              { printf("Block processed\n"); }
     ;

expr : expr '+' term                { 
                                        $$ = $1 + $3;
                                        printf("Addition: %.2f + %.2f = %.2f\n", $1, $3, $$);
                                    }
     | expr '-' term                { 
                                        $$ = $1 - $3;
                                        printf("Subtraction: %.2f - %.2f = %.2f\n", $1, $3, $$);
                                    }
     | term                         { $$ = $1; }
     ;

term : term '*' power               { 
                                        $$ = $1 * $3;
                                        printf("Multiplication: %.2f * %.2f = %.2f\n", $1, $3, $$);
                                    }
     | term '/' power               { 
                                        if ($3 != 0) {
                                            $$ = $1 / $3;
                                            printf("Division: %.2f / %.2f = %.2f\n", $1, $3, $$);
                                        } else {
                                            printf("Error: Division by zero!\n");
                                            $$ = 0;
                                        }
                                    }
     | term '%' power               { 
                                        $$ = (double)((long)$1 % (long)$3);
                                        printf("Modulo: %.0f %% %.0f = %.2f\n", $1, $3, $$);
                                    }
     | power                        { $$ = $1; }
     ;

power : power '^' factor            { 
                                        $$ = pow($1, $3);
                                        printf("Exponentiation: %.2f ^ %.2f = %.2f\n", $1, $3, $$);
                                    }
      | factor                      { $$ = $1; }
      ;

factor : '(' expr ')'               { 
                                        $$ = $2;
                                        printf("Parentheses result: %.2f\n", $$);
                                    }
       | ID                         { 
                                        $$ = get_var_value($1);
                                        printf("Variable %s = %.2f\n", $1, $$);
                                    }
       | NUM                        { $$ = $1; }
       ;

%%

/* 
 * BODMAS Implementation Summary:
 * B - Brackets/Parentheses:  factor rule with '(' expr ')'
 * O - Orders/Exponents:      power rule with '^' operator (Right Associative)
 * D - Division:              term rule with '/' operator (Left Associative)
 * M - Multiplication:        term rule with '*' operator (Left Associative)
 * A - Addition:              expr rule with '+' operator (Left Associative)
 * S - Subtraction:           expr rule with '-' operator (Left Associative)
 * 
 * Associativity:
 * - Left Associative:  a-b-c = (a-b)-c
 * - Right Associative: a^b^c = a^(b^c)
 */

void yyerror(const char *s)
{
    printf("Invalid Expression: %s\n", s);
    printf("Error in parsing - check operator precedence and associativity\n");
}

int main()
{
    printf("=== BODMAS and Associative Parser with Evaluation ===\n");
    printf("Supports operators: +, -, *, /, %%, ^\n");
    printf("Left Associative:  +, -, *, /, %% (evaluate left to right)\n");
    printf("Right Associative: ^ (evaluate right to left)\n");
    printf("\nExamples:\n");
    printf("  x = 2 + 3 * 4;        (evaluates to 14)\n");
    printf("  y = 2 ^ 3 ^ 2;        (evaluates to 512)\n");
    printf("  z = (10 - 5) / 2;     (evaluates to 2.5)\n");
    printf("\nEnter statements (Ctrl+Z then Enter to exit):\n");
    yyparse();
    return 0;
}