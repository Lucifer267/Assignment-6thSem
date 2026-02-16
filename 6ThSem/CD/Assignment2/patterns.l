%{
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int choice = 0;

/* Function to display the menu */
void print_menu() {
    printf("\n================================================");
    printf("\n COMPILER DESIGN - LEXICAL ANALYZER SCENARIOS");
    printf("\n================================================");
    printf("\n1. Vowels in Order (a-e-i-o-u)");
    printf("\n2. At most one repeated digit");
    printf("\n3. a/b Logic (Even/Odd, Substring, Subsequence)");
    printf("\n4. Exit");
    printf("\nChoose Scenario (1-4): ");
}
%}

/* Definitions of States */
%s VOWEL_STATE DIGIT_STATE AB_STATE

%%

    /* --- SCENARIO 1: Vowels in Order --- */
<VOWEL_STATE>^[a-z]*a[a-z]*e[a-z]*i[a-z]*o[a-z]*u[a-z]*$ { 
    printf("\n[RESULT] '%s': ACCEPTED (Vowels in order)\n", yytext); 
}
<VOWEL_STATE>^[a-z]+$ { o
    printf("\n[RESULT] '%s': REJECTED (Vowels missing or out of order)\n", yytext); 
}

    /* --- SCENARIO 2: At most one repeated digit --- */
<DIGIT_STATE>^[0-9]+$ {
    int d_count[10] = {0}, repeated_digits = 0;
    for(int i=0; i<yyleng; i++) {
        d_count[yytext[i]-'0']++;
    }
    for(int i=0; i<10; i++) {
        if(d_count[i] > 1) repeated_digits++;
    }
    
    if(repeated_digits <= 1) 
        printf("\n[RESULT] '%s': ACCEPTED (Repeated digits: %d)\n", yytext, repeated_digits);
    else 
        printf("\n[RESULT] '%s': REJECTED (%d digits are repeated)\n", yytext, repeated_digits);
}

    /* --- SCENARIO 3: a/b Logic --- */
<AB_STATE>^[ab]+$ {
    int ca = 0, cb = 0, b_after_a = 0, found_a = 0;
    // Check for substring 'abb' using C string library
    int has_substring_abb = (strstr(yytext, "abb") != NULL);

    for(int i=0; i<yyleng; i++) {
        if(yytext[i] == 'a') { 
            ca++; 
            found_a = 1; 
        } else { 
            cb++; 
            if(found_a) b_after_a++; 
        }
    }

    printf("\n--- Analysis for '%s' ---", yytext);
    printf("\n- Even 'a' & Odd 'b':   %s", (ca % 2 == 0 && cb % 2 != 0) ? "PASS" : "FAIL");
    printf("\n- No Substring 'abb':  %s", (!has_substring_abb) ? "PASS" : "FAIL");
    printf("\n- No Subsequence 'abb': %s", (b_after_a < 2) ? "PASS" : "FAIL");
    printf("\n----------------------------\n");
}

    /* Handle invalid characters within scenarios */
<VOWEL_STATE,DIGIT_STATE,AB_STATE>. { 
    printf("\n[ERROR] Invalid character '%s' for this scenario.\n", yytext); 
}

    /* Return to main menu on newline */
<VOWEL_STATE,DIGIT_STATE,AB_STATE>\n { return 0; }

.|\n ; /* Ignore everything else */

%%

int yywrap() { return 1; }

int main() {
    char input_choice[10];
    int c;

    while(1) {
        print_menu();
        
        if (scanf("%s", input_choice) != 1) break;
        choice = atoi(input_choice);

        if(choice == 4) {
            printf("Exiting...\n");
            break;
        }

        /* The Buffer Fix: Clear the newline from scanf so yylex doesn't skip */
        while ((c = getchar()) != '\n' && c != EOF); 

        if(choice == 1) BEGIN(VOWEL_STATE);
        else if(choice == 2) BEGIN(DIGIT_STATE);
        else if(choice == 3) BEGIN(AB_STATE);
        else { 
            printf("Invalid choice! Please enter 1, 2, 3, or 4.\n"); 
            continue; 
        }

        printf("Enter the string to test: ");
        yylex(); // Enter the Flex scanner
    }
    return 0;
}