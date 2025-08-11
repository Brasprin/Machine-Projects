#ifndef CONSOLE_H
#define CONSOLE_H

#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <memory>
#include <thread>
#include <atomic>
#include <chrono>
#include <sstream>
#include <fstream>
#include <algorithm>

#include "Process.h"
#include "RRScheduler.h"
#include "FCFSScheduler.h"
#include "Scheduler.h"
#include "MemoryManager.h"

class Console {
private:
    std::string userInput;
    std::vector<std::shared_ptr<Process>> processes;

    std::unique_ptr<RRScheduler> rrScheduler;
    std::unique_ptr<FCFSScheduler> fcfsScheduler;

    bool isInitialized = false;
    std::mutex processesMutex;
    std::thread schedulerThread;

    std::atomic<bool> schedulerRunning = false;
    std::atomic<bool> testModeRunning = false;

    std::atomic<int> pidCounter{ 0 };
    int cpuCount = 0;
    int timeQuantum = 0;
    int batchProcessFreq = 0;
    int minInstructions = 0;
    int maxInstructions = 0;
    int delayPerExecution = 0;
    int maxOverallMem = 0;
    int memPerFrame = 0;
    int memPerProc = 0;          
    int minMemPerProc = 0;          
    int maxMemPerProc = 0;           
    std::string schedulerType;

    // Private functions
    void displayContinuousUpdates();
    void showProcessScreen(const std::string& procName);
    void printUtilization(std::ostream* out = nullptr) const;
    void listProcesses();

    // New
    std::unique_ptr<MemoryManager> memoryManager;

public:
    Console(); // Default constructor

    // Core commands
    void header();
    void menu();
    void start();
    void createProcessFromCommand(const std::string& procName, int procMem);
    void attachToProcessScreen(const std::string& procName);
    void initialize();
    void clear();
    void screen();
    void schedulerStart();
    void schedulerStop();
    void schedulerTest();
    void reportUtil();
    void parseInput(std::string userInput);

    // NEW
    bool memoryCheck(int maxMem, int frameSize, int minProcMem, int maxProcMem); 
    bool isValidProcessMemory(int procMem);
    bool validateProcessCreation(const std::string& procName, int procMem);
    void createProcessWithInstructions(const std::string& procName, int procMem, const std::string& rawInstructionString);
    void handlePrintInstruction(const std::string& line, std::vector<std::shared_ptr<Instruction>>& parsedInstructions);

    static int rollProcessMemory(int minMem, int maxMem);  

    void reportProcessSMI();
    void reportVMStat();
};

#endif
