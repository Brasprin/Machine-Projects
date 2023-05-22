#include <stdio.h>
#include <stdlib.h>
#include <time.h>

/*
    Description: This game is called Minipoly. Minipoly is a shorter version of 
    the popular game Monopoly with the same basic rules. Two players alternate 
    turns when playing this game.
    Programmed by: <Andrei Tamse> <S21-B>
    Last modified: <December 4, 2022>
    Version: 1.0.1
*/

// Function Prototype
void game(int mode);
void title();
int intro(int mode);
int modeAndDice(int roll);
void board(char position[], char property[]);
int rotation(int playerPosition, int roll, float *balance);
void printPosition(float balP1, float balP2, int playerTurn, int roll, char *location[], int playerPosition);
int buyProperty(int choice, int *position, float *balance, int *jailTurn, char *emptyJail);
void propertyPrice(int playerPosition, int *tileCost, int *rent);
void checkWinner(float balP1, float balP2);

// Main Function
int main()
{
    // Variable Declaration
    int mode = 0;
    char position[22] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
    char property[22] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
    
    // Introduction
    title();
    board(position, property);
    // Choose mode of the game
    mode = intro(mode);
    system("clear ||  cls");

    if (mode == 1 || mode == 2)
    {
        game(mode);
    }
    else if (mode == 3)
    {
        printf("Program Terminated.");
        return 0;
    }
}

/*  This function contains the main program of the game.
    @param mode - Run the chosen mode of the player.
*/
void game(int mode)
{
    // Game variable declaration
    int choice = 0;
    int roll = 0;
    char position[22] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
    char property[22] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};
    char *location[22] = {"Go (G) tile", "Property a", "Property b", "Property c",
                          "Property d", "Just Visiting (V) tile", "Property e", "Property f",
                          "Property g", "Property h", "Free Parking (P) tile", "Property i",
                          "Property j", "Property k", "Property l", "Go To Jail (J) tile", "Property m",
                          "Property n", "Luxury Tax (T) tile", "Property o"};
    int p1Position = 0;
    int p2Position = 0;
    float balP1 = 10000000;
    float balP2 = 10000000;
    int tileCost = 0;
    int rent = 0;
    int jailP1 = 0;
    int jailP2 = 0;

    // Main game
    do
    {
        /* --------------------------Player 1 turn ------------------------- */

        // Run this program if there is no jailtime for player 1
        if (jailP1 == 0)
        {
            roll = modeAndDice(mode);
            printf("\n\n\n-------------------PLAYER 1 TURN-------------------\n\n");
            // Rotates the player 1 and 2 in the board
            // Empty the last position of player 1.
            position[p1Position] = ' ';
            // Leaves player 2 if player 1 moves away from 3.
            if (p1Position == p2Position)
            {
                position[p2Position] = '2';
            }
            // Determine if the roll is past tile 19.
            p1Position = rotation(p1Position, roll, &balP1);
            position[p1Position] = '1';
            // If player 1 and player 2 is in same position, displays 3.
            if (p1Position == p2Position)
            {
                position[p1Position] = '3';
            }
            // Display result of the turn
            board(position, property);
            printPosition(balP1, balP2, 1, roll, location, p1Position);
            // Check  if property is available
            if (property[p1Position] == ' ')
            {
                choice = buyProperty(choice, &p1Position, &balP1, &jailP1, position);
                // Return player 1 to Just Visiting tile from Jail Tile.
                position[p1Position] = '1';
            }

            /* Check if property is already owned by player 2
            and pays rent if it is already owned by player 2.  */
            if (property[p1Position] == 'Y')
            {
                propertyPrice(p1Position, &tileCost, &rent);
                // Add rent money to player2 and deduct rent money from player 1.
                balP2 += rent;
                balP1 -= rent;
                system("clear ||  cls");
                // Reprint the board to display money that is paid to player 2.
                printf("\n\n\n-------------------PLAYER 1 TURN-------------------\n\n");
                board(position, property);
                printPosition(balP1, balP2, 1, roll, location, p1Position);
                printf("- paid %d.00 to player 2", rent);
                printf("\n\nEnter any number to continue:  ");
                scanf("%d", &choice);
                choice = 2;
            }
            // Property buy if choice is 1.
            if (choice == 1)
            {
                propertyPrice(p1Position, &tileCost, &rent);
                if (balP1 > tileCost)
                {
                    property[p1Position] = 'X';
                    balP1 -= tileCost;
                    system("clear ||  cls");
                    // Reprint the board to display property bought by player 1.
                    printf("\n\n\n-------------------PLAYER 1 TURN-------------------\n\n");
                    board(position, property);
                    printPosition(balP1, balP2, 1, roll, location, p1Position);
                    printf("- player 1 bought %s", location[p1Position]);
                }
                // If player 1 balance is lower than tile cost.
                else if (balP1 <= tileCost)
                {
                    printf("\nNOT ENOUGH MONEY!!!");
                }
            }
        }
        // Decrement jail time until 0.
        else
        {
            jailP1--;
        }

        /* --------------------------Player 2 turn ------------------------- */

        // Check if player 1 has balance, if not it will now display the winner.
        if (balP1 > 0)
        {
            // Run this program if there is no jailtime for player 2.
            if (jailP2 == 0)
            {
                roll = modeAndDice(mode);
                printf("\n\n\n-------------------PLAYER 2 TURN-------------------\n\n");
                // Rotates the player 1 and 2 in the board
                 // Empty the last position of player 2.
                position[p2Position] = ' ';
                // Leaves player 1 if player 2 moves away from 3.
                if (p1Position == p2Position)
                {
                    position[p1Position] = '1';
                }
                // Determine if the roll is past tile 19.
                p2Position = rotation(p2Position, roll, &balP2);
                position[p2Position] = '2';
                // If player 1 and player 2 is in same position, displays 3.
                if (p1Position == p2Position)
                {
                    position[p2Position] = '3';
                }
                // Display result of the turn
                board(position, property);
                printPosition(balP1, balP2, 2, roll, location, p2Position);
                // check  if property is available
                if (property[p2Position] == ' ')
                {
                    choice = buyProperty(choice, &p2Position, &balP2, &jailP2, position);
                    // Return player 2 to Just Visiting tile from Jail Tile.
                    position[p2Position] = '2';
                }

                /* Check if property is already owned by player 1
                and pays rent if it is already owned by player 1.  */
                if (property[p2Position] == 'X')
                {
                    propertyPrice(p2Position, &tileCost, &rent);
                    // Add rent money to player1 and deduct rent money from player 2.
                    balP1 += rent;
                    balP2 -= rent;
                    system("clear ||  cls");
                    // Reprint the board to display money that is paid to player 1.;
                    printf("\n\n\n-------------------PLAYER 2 TURN-------------------\n\n");
                    board(position, property);
                    printPosition(balP1, balP2, 2, roll, location, p2Position);
                    printf("- paid %d.00 to player 1", rent);
                    printf("\n\nEnter any number to continue:  ");
                    scanf("%d", &choice);
                    choice = 2;
                }
                // Property buy if choice is 1.
                if (choice == 1)
                {
                    propertyPrice(p2Position, &tileCost, &rent);
                    if (balP2 > tileCost)
                    {
                        property[p2Position] = 'Y';
                        balP2 -= tileCost;
                        system("clear ||  cls");
                        // Reprint the board to display property bought by player 2.
                        printf("\n\n\n-------------------PLAYER 2 TURN-------------------\n\n");
                        board(position, property);
                        printPosition(balP1, balP2, 2, roll, location, p2Position);
                        printf("- player 2 bought %s", location[p2Position]);
                    }
                    // If player 2 balance is lower than tile cost.
                    else if (balP2 <= tileCost)
                    {
                        printf("\nNOT ENOUGH MONEY!!!");
                    }
                }
            }
            // Decrement jail time until 0.
            else
            {
                jailP2--;
            }
        }
    } while (balP1 > 0 && balP2 > 0);

    // When do-while loop condition is met, the program will display the winner.
    system("clear ||  cls");
    board(position, property);
    checkWinner(balP1, balP2);
    title();

}

// This function displays the title of the program.
void title()
{
    printf("\n\n\n");
    printf("\t\t   M I N I P O L Y\n");
    printf("\t\t    Version 1.0.1\n");
    printf("\t\t   Andrei G. Tamse\n");
    printf("\t\t       <S21B>\n\n");
}

/*  This function displays the introduction of the program and ask the players
    chosen mode.
    @param mode - Gets the chosen mode of the player.
    @return - Returns the mode chosen by the player.
*/
int intro(int mode)
{
    printf("\nAccount Balance: \n");
    printf("Player 1:  10000000.00\n");
    printf("Player 2:  10000000.00\n\n\n");
    printf("Please choose your game mode.\n");
    printf("[1] Play Mode\n");
    printf("[2] Debug Mode\n");
    printf("[3] Exit Program\n");
    printf("Choice: ");
    scanf("%d", &mode);

    return mode;
}

/*  This function runs the chosen mode of the player and generates a random
    number roll between 1-6 to determine the number of the moves of the
    current player.
    @param mode - Chosen mode of the player.
    @return - Returns the value of roll.

*/
int modeAndDice(int mode)
{
    int roll = 0;

    if (mode == 1)
    {
        srand(time(0));
        roll = (rand() % 6) + 1;
    }
    else if (mode == 2)
    {
        printf("\n\nManual input values (1-20):  ");
        scanf("%d", &roll);
    }

    return roll;
}

/*  This function prints the board of the game including the position and
    property bought by the players.
    @param position[] - Display the current position of the player.
    @param property[] - Display the property bought by the player on the board
*/
void board(char position[], char property[])
{
    printf("\n\n");
    printf("             e       f       g       h             \n");
    printf(" + - - - + - - - + - - - + - - - + - - - + - - - + \n");
    printf(" |%c    V |%c    %c |%c    %c |%c    %c |%c    %c |%c    P | \n", position[5], position[6], property[6], position[7], property[7], position[8], property[8], position[9], property[9], position[10]);
    printf(" + - - - + - - - + - - - + - - - + - - - + - - - + \n");
    printf("d|%c    %c |                               |%c    %c |i\n", position[4], property[4], position[11], property[11]);
    printf(" + - - - +                               + - - - + \n");
    printf("c|%c    %c |                               |%c    %c |j\n", position[3], property[3], position[12], property[12]);
    printf(" + - - - +                               + - - - + \n");
    printf("b|%c    %c |                               |%c    %c |k\n", position[2], property[2], position[13], property[13]);
    printf(" + - - - +                               + - - - + \n");
    printf("a|%c    %c |                               |%c    %c |l\n", position[1], property[1], position[14], property[14]);
    printf(" + - - - + - - - + - - - + - - - + - - - + - - - + \n");
    printf(" |%c    G |%c    %c |%c    T |%c    %c |%c    %c |%c    J | \n", position[0], position[19], property[19], position[18], position[17], property[17], position[16], property[16], position[15]);
    printf(" + - - - + - - - + - - - + - - - + - - - + - - - + \n");
    printf("             o               n       m             \n");
}

/*  This function checks if the playerPosition is more than 19 (tileSize),
    If yes, deducts  20 to the current playerPosition and deducts the roll and
    convert it to absolute value (positive) which results to the latestPosition
    of the player. Also if playerPosition is more than 19 (tileSize), extra 1000000
    money will add up to the balance of the player based on mechanics of the game.
    If not more than 19, playerPosition runs as default.
    @param playerPosition - Position of the player called.
    @param roll - Access roll of the dice.
    @param *balance - Give 1000000 extra balance to the player called.
    @return - Returns the current playerPosition of the player.

*/
int rotation(int playerPosition, int roll, float *balance)
{
    if (playerPosition + roll > 19)
    {
        playerPosition = abs((20 - playerPosition) - roll);
        *balance += 1000000;
    }
    else
    {
        playerPosition += roll;
    }
    return playerPosition;
}

/*  This function displays the account balance, turns, dice roll, and landed
    location of the players in the game.
    @param balP1 - Displays the balance of player 1.
    @param balP2 - Displays the balance of player 2.
    @param playerTurn - Displays which player turn is.
    @param roll - Displays the roll of the value of the players.
    @param location - Access and display the location of the player.
    @param playerPosition - Current position of the player for location value.
*/
void printPosition(float balP1, float balP2, int playerTurn, int roll, char *location[], int playerPosition)
{
    printf("\nAccount Balance: \n");
    printf("Player 1:  %.2f\n", balP1);
    printf("Player 2:  %.2f\n", balP2);
    printf("\nPlayer %d turn:\n", playerTurn);
    printf("- rolled a %d\n", roll);
    printf("- landed on %s\n", location[playerPosition]);
}

/*  This function determines if the position of the player landed on a default
    marker (G,V,P,J,T) or propertyTiles.
    If landed on default markers, current player will be asked any numbers to
    review the result and continue the game.
    If landed on propertyTiles, the current player will be asked if he/she is buying
    the property or declining.
    @param choice - Gets the choice of the current player.
    @param *position - Determine the position of the player.
    @param *balance - Deducts 1000000 to the player if landed on luxury tax.
    @param *jailTurn - Gives jail turn to the player .
    @param *emptyJail - Removes the current player to jail for transfer.
    @return - Returns the choice  = 1 if player is buying property, else, always
    return choice = 2.

*/
int buyProperty(int choice, int *position, float *balance, int *jailTurn, char *emptyJail)
{

    if (*position == 0 || *position == 5 || *position == 10)
    {
        printf("- nothing happens \n");
        printf("\n\nEnter any number to continue:  ");
        scanf("%d", &choice);
    }
    else if (*position == 15)
    {
        printf("- transferred to Just Visiting(J)\n  tile and shall skip two (2) turns");
        printf("\n\nEnter any number to continue:  ");
        scanf("%d", &choice);
        *jailTurn = 2;
        emptyJail[*position] = ' ';
        *position = 5;
    }
    else if (*position == 18)
    {
        printf("- luxury tax of 1000000.00 wil be deducted!");
        printf("\n\nEnter any number to continue:  ");
        scanf("%d", &choice);
        *balance -= 1000000;
    }
    else
    {
        printf("\n(1) Buy Property\n");
        printf("(2) Decline Property\n");
        printf("Choice: ");
        scanf("%d", &choice);
        return choice;
    }
    return choice = 2;
}

/*  This function determines the  price of the property either the tileCost
    (propertycost) or the rent (rentcost)  depending on the playerPosition.
    Pre-condition: If choice = 1 /  buy property.
    @param playerPosition - Determines the current position of the player used
    for switch cases.
    @param playerPosition - Determines the position of the current player.
    @param *tileCost - Gets the value of the property / tile.
    @param *rent - Gets the renting value of the property / tile.
*/
void propertyPrice(int playerPosition, int *tileCost, int *rent)
{

    switch (playerPosition)
    {
    case 1:
    case 2:
    case 3:
    case 4:
        *tileCost = 2000000;
        *rent = 300000;
        break;
    case 6:
    case 7:
    case 8:
    case 9:
        *tileCost = 4000000;
        *rent = 500000;
        break;
    case 11:
    case 12:
    case 13:
    case 14:
        *tileCost = 6000000;
        *rent = 1000000;
        break;
    case 16:
    case 17:
    case 19:
        *tileCost = 8000000;
        *rent = 2000000;
        break;
    }
}

/*  This function displays the balance results and checks the winner of the game.
    Pre-condition: If balance is less  than  or equal 0.
    @param balP1 - Checks the balancce of player the 1 if it is less than zero.
    @param balP2 - Checks the balancce of player the 2 if it is less than zero.
*/
void checkWinner(float balP1, float balP2)
{
    if (balP1 <= 0)
    {
        printf("\nAccount Balance: \n");
        printf("Player 1:  %.2f\n", balP1);
        printf("Player 2:  %.2f\n", balP2);
        printf("\n\n    CONGRATULATIONS PLAYER 2! YOU WON THE GAME!!!");
    }
    else if (balP2 <= 0)
    {
        printf("\nAccount Balance: \n");
        printf("Player 1:  %.2f\n", balP1);
        printf("Player 2:  %.2f\n", balP2);
        printf("\n\n     CONGRATULATIONS PLAYER 1! YOU WON THE GAME!!!");
    }
}
