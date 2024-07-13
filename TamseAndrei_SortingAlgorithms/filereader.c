#ifndef FILEREADER_C
#define FILEREADER_C

#include <stdio.h>
#include <string.h>
#include "Record.c"

/*
 * This function reads a file from the given path, and
 * saves a list of Record structures representing the
 * data that was read to the `records` parameter. You are
 * NOT allowed to modify this file.
 */
void readFile(Record *records, char path[500])
{
    FILE *fp;
    int n, i;
    int idNumber;
    char name[500];
    fp = fopen(path, "r");
    fscanf(fp, "%d", &n);
    for (i = 0; i < n; i++)
    {
        fscanf(fp, "%d", &idNumber);
        fgets(name, 500, fp);
        name[strcspn(name, "\n")] = 0;

        records[i].idNumber = idNumber;
        strcpy(records[i].name, name);
    }
    fclose(fp);
}

#endif