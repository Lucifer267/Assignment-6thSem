%{
    #include<stdio.h>
    void yyerror();
    int yylex();
%}
%token NOUN VERB ADVERB
%%
start: sentence;
sentence: NOUN VERB { printf("Valid Sentence (Simple NOUN VERB)\n"); }
        | NOUN ADVERB VERB { printf("Valid Sentence (NOUN ADVERB VERB)\n"); }
        ;
%%

void yyerror(char *s){
    printf("Invalid Sentence\n");
}

int main(){
    printf("Enter English Language Sentence:");
    yyparse();
    return 0;
}