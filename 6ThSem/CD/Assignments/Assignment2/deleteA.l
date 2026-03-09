%{
#include <stdio.h>

FILE *out;
%}

%%
^[ \t]*[aA].*(\n|$)        { fprintf(out, "%s\n", yytext); }   /* starts with A/a */
.*[aA][ \t]*(\n|$)         { fprintf(out, "%s\n", yytext); }   /* ends with A/a */
.*(\n|$)                   ;                                  /* ignore rest */
%%

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        printf("Usage: %s <input_file>\n", argv[0]);
        return 1;
    }

    yyin = fopen(argv[1], "r");
    if (!yyin)
    {
        printf("Error: Cannot open input file.\n");
        return 1;
    }

    out = fopen("Check.txt", "w");
    if (!out)
    {
        printf("Error: Cannot create Check.txt\n");
        return 1;
    }

    yylex();

    fclose(yyin);
    fclose(out);

    printf("Matching lines copied to Check.txt successfully.\n");
    return 0;
}

int yywrap()
{
    return 1;
}
