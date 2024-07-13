/**
 * CCDSALG (Data Structures and Algorithms)
 * Major Course Output 1: Sorting Algorithms
 *
 * Section : S18
 *
 * @author Mark Ang
 * @author Aaron Diego Roa
 * @author Andrei Tamse
 *
 * @version 1.0
 */

#include "record.c"
#include "sortingalgorithms.c"
#include "filereader.c"
#include "timer.c"
#include <stdio.h>
#include <stdlib.h>

typedef char str500[500];
typedef char str30[30];

// Function Prototypes
int getDataSize(str500 fileLocation);
void displayResult(long start, long end, long duration);
void printFileResult(Record *list, int dataSize);
void filePath(str500 *fileLocation);

int main()
{
    int dataSize, choice = 0;
    str500 path;
    long startTime = 0, endTime = 0, executionTime = 0;

    // Input path
    filePath(&path);

    // Get size of the Data
    dataSize = getDataSize(path);

    Record *list = malloc(dataSize * sizeof(Record));
    readFile(list, path);

    choice = 0;
    printf("\nChoose Sorting Algorithm: \n");
    printf("[1] Insertion Sort\n");
    printf("[2] Selection Sort\n");
    printf("[3] Merge Sort\n");
    printf("[4] Shell Sort\n");
    printf("Choice: ");
    scanf("%d", &choice);

    // Record Time
    if (choice == 1)
    {
        startTime = currentTimeMillis();
        insertionSort(list, dataSize);
        endTime = currentTimeMillis();
        executionTime = endTime - startTime;
    }
    else if (choice == 2)
    {
        startTime = currentTimeMillis();
        selectionSort(list, dataSize);
        endTime = currentTimeMillis();
        executionTime = endTime - startTime;
    }
    else if (choice == 3)
    {
        startTime = currentTimeMillis();
        mergeSort(list, 0, dataSize - 1);
        endTime = currentTimeMillis();
        executionTime = endTime - startTime;
    }
    else if (choice == 4)
    {
        startTime = currentTimeMillis();
        shellSort(list, dataSize);
        endTime = currentTimeMillis();
        executionTime = endTime - startTime;
    }

    displayResult(startTime, endTime, executionTime);
    printFileResult(list, dataSize);
    free(list); // Free dynamically allocated memory

    return 0;
}

/*
    Function GetDataSize - Open the location of the specific .txt file to get the
    number of data inside the specific .txt file

    @param fileLocation - Path of the file to be open.
    @return size - number of data in the .txt file.
*/
int getDataSize(str500 fileLocation)
{
    FILE *fp;
    int size;

    fp = fopen(fileLocation, "r");
    fscanf(fp, "%d", &size);

    fclose(fp);

    return size;
}

/*
    Function displayResult - Displays the time needed when testing the algorithms.

    @param start - StartTime of the sorting.
    @param end - EndTime of the sorting.
    @param duration - Total duration of the sorting.
*/
void displayResult(long start, long end, long duration)
{
    printf("\nStart Time: %ld\n", start);
    printf("End Time: %ld\n", end);
    printf("Duration (Milliseconds): %ld\n", duration);

    int milliseconds = duration % 1000;
    long totalSeconds = duration / 1000;
    int seconds = totalSeconds % 60;
    long totalMinutes = totalSeconds / 60;
    int minutes = totalMinutes % 60;
    int hours = totalMinutes / 60;

    printf("Duration: %02d:%02d:%02d:%03d\n", hours, minutes, seconds, milliseconds);
}

/*
    Function printFileResult - Writes the sorted records to a file.

    @param list - Pointer to the list of records.
    @param dataSize - Size of the list.
*/
void printFileResult(Record *list, int dataSize)
{
    FILE *fp;

    fp = fopen("result.txt", "w");
    for (int i = 0; i < dataSize; i++)
        fprintf(fp, "%d %s\n", list[i].idNumber, list[i].name);

    fclose(fp);
}

/*
    Function filePath - Generate the file path of data to be sorted.

    @param *fileLocation - Location of the file.
*/
void filePath(str500 *fileLocation)
{
    int choice = 0;

    strcpy(*fileLocation, "/Users/andrei/Downloads/starter_code_c/data/"); // change path
    printf("\nChoice File Name To Test: \n");
    printf("[1] almostsorted.txt\n");
    printf("[2] random100.txt\n");
    printf("[3] random25000.txt\n");
    printf("[4] random50000.txt\n");
    printf("[5] random75000.txt\n");
    printf("[6] random100000.txt\n");
    printf("[7] totallyreversed.txt\n");
    printf("Choice: ");
    scanf("%d", &choice);

    if (choice == 1)
        strcat(*fileLocation, "almostsorted");
    else if (choice == 2)
        strcat(*fileLocation, "random100");
    else if (choice == 3)
        strcat(*fileLocation, "random25000");
    else if (choice == 4)
        strcat(*fileLocation, "random50000");
    else if (choice == 5)
        strcat(*fileLocation, "random75000");
    else if (choice == 6)
        strcat(*fileLocation, "random100000");
    else if (choice == 7)
        strcat(*fileLocation, "totallyreversed");

    strcat(*fileLocation, ".txt");
}
