#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>


extern void asmCalculateDistance(float *x1, float *x2, float *y1, float *y2, int n);




float cCalculateDistance(float x1, float x2, float y1, float y2)
{
    float dx = x1 - x2;
    float dy = y1 - y2;
    return sqrtf(dx * dx + dy * dy);
}

void populateVector(float vector[], int n, float max)
{
    for (int i = 0; i < n; i++) {
        float value = ((float)rand() / RAND_MAX) * max;

        vector[i] = roundf(value * 2.0f) / 2.0f;
    }
    
}



void performKernelTest(int vectorSize, int numberOfRuns)
{
    float *x1 = malloc(vectorSize * sizeof(float));
    float *x1Temp = malloc(vectorSize * sizeof(float));
    float *x2 = malloc(vectorSize * sizeof(float));
    float *y1 = malloc(vectorSize * sizeof(float));
    float *y2 = malloc(vectorSize * sizeof(float));
    float *z_c = malloc(vectorSize * sizeof(float));
    float *z_asm = malloc(vectorSize * sizeof(float));
    

    populateVector(x1, vectorSize, 50.0);
    populateVector(x2, vectorSize, 50.0);
    populateVector(y1, vectorSize, 50.0);
    populateVector(y2, vectorSize, 50.0);



    // C Kernel Computation
    for (int i = 0; i < vectorSize; i++) {
        z_c[i] = cCalculateDistance(x1[i], x2[i], y1[i], y2[i]);
    }

    // Assembly Kernel Computation
    x1Temp = x1;
    asmCalculateDistance(x1Temp, x2, y1, y2,vectorSize);


    printf("Verification Sample (first 10 elements):\n");
    printf("Index\tX1\tX2\tY1\tY2\tC Result\tASM Result\n");
    for (int i = 0; i < 10; i++) {
        if (i >= vectorSize) {
            break;
        }
        printf("%d\t%.2f\t%.2f\t%.2f\t%.2f\t%.6f\t%.6f\n", 
            i, x1[i], x2[i], y1[i], y2[i], 
            z_c[i], x1Temp[i]);
        }

    // C Kernel Performance Test
    clock_t cTotalTime = 0;
    for (int run = 0; run < numberOfRuns; run++)
    {
        clock_t start = clock();
        
        // C Kernel Computation
        for (int i = 0; i < vectorSize; i++) {
            z_c[i] = cCalculateDistance(x1[i], x2[i], y1[i], y2[i]);
        }
        
        clock_t end = clock();
        cTotalTime += (end - start);
    }
    double cAveTime = ((double)cTotalTime / numberOfRuns) / CLOCKS_PER_SEC;

    x1Temp = x1;
    // Assembly Kernel Performance Test
    clock_t asmTotalTime = 0;
    for (int run = 0; run < numberOfRuns; run++)
    {
        clock_t start = clock();
        
        // Assembly Kernel Computation
        asmCalculateDistance(x1, x2, y1, y2,vectorSize);
        
        clock_t end = clock();
        asmTotalTime += (end - start);
    }
    double asmAveTime = ((double)asmTotalTime / numberOfRuns) / CLOCKS_PER_SEC;

    printf("\nVector Size: %d\n", vectorSize);
    printf("C Kernel - Average Execution Time: %f seconds\n", cAveTime);
    printf("Assembly Kernel - Average Execution Time: %f seconds\n\n", asmAveTime);

    free(x1);
    free(x2);
    free(y1);
    free(y2);
    free(z_c);
    free(z_asm);
}

int main()
{

    int numberOfRuns = 30;


    int vectorSizes[] = { 1 << 20,1 << 24,  1 << 28  };
    int numSize = sizeof(vectorSizes) / sizeof(int);    // Get array size

    for (int i = 0; i < numSize; i++)
    {
        performKernelTest(vectorSizes[i], numberOfRuns);
    }



    return 0;
}
