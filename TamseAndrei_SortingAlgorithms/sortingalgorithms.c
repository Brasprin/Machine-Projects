/**
 * CCDSALG (Data Structures and Algorithms)
 * Major Course Output 1: Sorting Algorithms
 *
 * Section : S18
 *
 * @author Andrei Tamse
 *
 * @version 1.0
 */

#ifndef SORTINGALGORITHMS_C
#define SORTINGALGORITHMS_C

#include <stdio.h>
#include <stdlib.h>
#include "record.c"

/**
 * insertionSort Sorts an array of Record struct using the insertion sort algorithm.
 *
 * @param arr Records
 * @param n   Data Size
 */
void insertionSort(Record *arr, int n)
{
    // TODO: Implement this sorting algorithm here.
    int i, j;
    Record temp;

    for (i = 1; i < n; i++)
    {
        temp = arr[i];
        j = i - 1; // 'j' is use as index to compare element on the left of the current element 'i'.

        while (j >= 0 && arr[j].idNumber > temp.idNumber)
        {
            arr[j + 1] = arr[j]; // Moves the previous element one position to the right.
            j = j - 1;           // Decrement index j to compare its element to the left.
        }
        arr[j + 1] = temp; // Insert the current element to the right to be in a sorted position.
    }
}
/**
 * selectionSort Sorts an array of Record struct using the selection sort algorithm.
 *
 * @param arr Records
 * @param n   Data Size
 */
void selectionSort(Record *arr, int n)
{
    // TODO: Implement this sorting algorithm here.

    int i, j;
    Record temp;

    for (i = 0; i < n - 1; i++)
    {
        int minIndex = i; // Assume the current element is the minimum.

        // Find the minimum element in the remaining unsorted part of the array.
        for (j = i + 1; j < n; j++)
            if (arr[j].idNumber < arr[minIndex].idNumber)
                minIndex = j; // Update the index of the minimum element.

        // Swap the minimum element with the current element.
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
}
/**
 * mergeSortHelper Sorts the sub portion by merging it until array is sorted
 *
 * @param arr Records
 * @param start Start Index
 * @param mid Mid Index
 * @param end End Index
 */
void mergeSortHelper(Record *arr, int start, int mid, int end)
{
    int lengthLeft = mid - start + 1; // Length of the left portion.
    int lengthRight = end - mid;      // Length of the right portion.

    Record *tempLeft = malloc(lengthLeft * sizeof(Record));   // Temporary array for the left portion.
    Record *tempRight = malloc(lengthRight * sizeof(Record)); // Temporary array for the right portion.

    int i, j, k;

    for (i = 0; i < lengthLeft; i++) // Copy elements from the left portion of the array.
        tempLeft[i] = arr[start + i];

    for (i = 0; i < lengthRight; i++) // Copy elements from the right portion of the array.
        tempRight[i] = arr[mid + 1 + i];

    /* i: index of tempLeft.
     * j: index of tempRight.
     * k: index of the main array.
     */
    for (i = 0, j = 0, k = start; k <= end; k++)
    {
        if ((i < lengthLeft) && (j >= lengthRight || tempLeft[i].idNumber <= tempRight[j].idNumber))
        {
            arr[k] = tempLeft[i]; // Place the smaller element from the left portion into the main array.
            i++;
        }
        else
        {
            arr[k] = tempRight[j]; // Place the smaller element from the right portion into the main array.
            j++;
        }
    }

    free(tempLeft);
    free(tempRight);
}
/**
 * mergeSort Divides arrays into smaller sub portion recursively until the subportion is one element.
 *
 * @param arr Records
 * @param p Lower index
 * @param r Upper Index
 */
void mergeSort(Record *arr, int p, int r)
{
    // TODO: Implement this sorting algorithm here.

    if (p < r)
    {
        int m = p + (r - p) / 2; // Calculate the middle index of the array.

        mergeSort(arr, p, m);     // Recursively sort the left portion of the array.
        mergeSort(arr, m + 1, r); // Recursively sort the right portion of the array.

        mergeSortHelper(arr, p, m, r); // Merge the sorted left and right portions.
    }
}

/**
 * Sorts an array of Record struct using the shell sort algorithm.
 *
 * @param arr Records
 * @param n   Data Size
 */
void shellSort(Record *arr, int n)
{
    int i, j;
    int gap;
    Record temp;

    // Start with a large gap, then reduce the gap until it becomes 1
    for (gap = n / 2; gap > 0; gap /= 2)
    {
        // Perform insertion sort on each sublist defined by the gap
        for (i = gap; i < n; i++)
        {
            temp = arr[i];
            j = i;

            // Shift elements that are greater than the current element to the right
            while (j >= gap && arr[j - gap].idNumber > temp.idNumber)
            {
                arr[j] = arr[j - gap];
                j -= gap;
            }

            // Place the current element at its correct position
            arr[j] = temp;
        }
    }
}

#endif