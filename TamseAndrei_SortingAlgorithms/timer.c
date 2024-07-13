#ifndef TIMER_C
#define TIMER_C

#include <sys/time.h>

/**
* This is a helper function to get the current time in
* milliseconds. You are NOT allowed to modify this class.
* Source: https://stackoverflow.com/questions/10098441/get-the-current-time-in-milliseconds-in-c 
*/
long currentTimeMillis() {
    struct timeval time;
    gettimeofday(&time, NULL);
    long s1 = (long)(time.tv_sec) * 1000;
    long s2 = (time.tv_usec / 1000);
    return s1 + s2;
}

#endif
