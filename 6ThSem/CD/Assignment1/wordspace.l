%{
#include <stdio.h>

int noun_count = 0;
int verb_count = 0;
int adverb_count = 0;
int prep_count = 0;
int pronoun_count = 0;
int whitespace_count = 0;
int newline_count = 0;
%}

%%

(I|you|he|she|we|they) {
    printf("PRONOUN: %s (%d)\n", yytext, ++pronoun_count);
}

(is|am|are|was|were|eat|go|play|run|like) {
    printf("VERB: %s (%d)\n", yytext, ++verb_count);
}

(quickly|slowly|fastly|carefully|gracefully) {
    printf("ADVERB: %s (%d)\n", yytext, ++adverb_count);
}

(in|on|at|with|to|from|by) {
    printf("PREPOSITION: %s (%d)\n", yytext, ++prep_count);
}


[ \t]+ {
    whitespace_count += yyleng;
}

\n {
    newline_count++;
}


[a-zA-Z]+ {
    printf("NOUN: %s (%d)\n", yytext, ++noun_count);
}

[ \t\n]+   ;
.          ;

%%

int yywrap(void) {
    return 1;
}

int main(void) {
    printf("Enter a sentence:\n");
    yylex();

    printf("\n--- COUNT ---\n");
    printf("Nouns        : %d\n", noun_count);
    printf("Verbs        : %d\n", verb_count);
    printf("Adverbs      : %d\n", adverb_count);
    printf("Prepositions : %d\n", prep_count);
    printf("Pronouns     : %d\n", pronoun_count);
    printf("Whitespaces : %d\n", whitespace_count);
    printf("Newlines    : %d\n", newline_count);


    return 0;
}