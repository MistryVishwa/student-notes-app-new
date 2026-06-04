#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    // Seed the random number generator using the current system time
    srand(time(0)); 
    
    // Generate a random number between 1 and 100
    int secret_number = (rand() % 100) + 1; 
    
    printf("Random Number: %d", secret_number);
    return 0;
}
