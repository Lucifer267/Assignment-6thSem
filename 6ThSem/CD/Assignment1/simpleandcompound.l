%{
#include <stdio.h>
#include <string.h>
int has_conjunction = 0;
%}

%%
and|but|or|so|for|yet|nor   { has_conjunction = 1; }
[a-zA-Z]+                  { ; }
[ \t\n]+                   { ; }
.                          { ; }
%%

int yywrap(){ return 1; }

int main()
{   
    char buffer[1024];
    while(1) {
        printf("Enter the sentence (or 'quit' to exit): ");
        if (fgets(buffer, sizeof(buffer), stdin) == NULL) break;
        if (strcmp(buffer, "quit\n") == 0 || strcmp(buffer, "quit") == 0) break;
        has_conjunction = 0;
        YY_BUFFER_STATE buf = yy_scan_string(buffer);
        yylex();
        yy_delete_buffer(buf);
        if (has_conjunction) {
            printf("The sentence is compound.\n");
        } else {
            printf("The sentence is simple.\n");
        }
    }
    return 0;
}