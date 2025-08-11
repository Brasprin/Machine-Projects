#include "Console.h"
#include <cstdlib>

#include <sstream> 
#include <iostream>
#include <filesystem> 
#include <cmath>   

using namespace std;


//Handling File of process
const std::string logDir = "processesLogs";
namespace fs = std::filesystem;
std::atomic<bool> disableAutoSpawn = false;

Console::Console() {
  
}

std::string getCurrentTime() {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);
    std::tm tm;
    localtime_s(&tm, &now_time);  // Windows-safe version
    std::stringstream ss;
    ss << std::put_time(&tm, "%m/%d/%Y %I:%M:%S %p");
    return ss.str();
}

void Console::header() {
    string blk = "\033[47m  \033[0m";

    cout << " " + blk + blk + blk + "  " + blk + blk + blk + "   " + blk + blk + blk + "   " + blk + blk + blk + "   " + blk + blk + blk + "  " + blk + blk + blk + "  " + blk + "  " + blk << endl;
    cout << blk + "   " + blk + "  " + blk + "      " + blk + "    " + blk + "  " + blk + "   " + blk + "  " + blk + "      " + blk + "      " + blk + "  " + blk << endl;
    cout << blk + "       " + blk + blk + blk + "  " + blk + "    " + blk + "  " + blk + "   " + blk + "  " + blk + blk + blk + "  " + blk + blk + blk + "   " + blk + blk << endl;
    cout << blk + "   " + blk + "      " + blk + "  " + blk + "    " + blk + "  " + blk + blk + blk + "   " + blk + "          " + blk + "    " + blk << endl;
    cout << " " + blk + blk + blk + "  " + blk + blk + blk + "   " + blk + blk + blk + "   " + blk + "       " + blk + blk + blk + "  " + blk + blk + blk + "    " + blk << endl;

    cout << "----------Operating Systems Command Line Emulator----------" << endl;
    cout << "===========================================================\n" << endl;
    menu();
}

void Console::menu()
{
    cout << "Available commands:" << endl;
    cout << "  initialize     - Initialize system" << endl;
    cout << "  screen -c <name> <memory> \"<instructions>\" - Create a new process with custom instructions" << endl;
    cout << "  screen -r <name> - Display screen for a process" << endl;
    cout << "  screen -s <name> <process_memory_size> - Create a new screen for a process" << endl;
    cout << "  screen -ls       - List system utilization and processes" << endl;
    cout << "  scheduler-start - Start scheduler" << endl;
    cout << "  scheduler-stop - Stop scheduler" << endl;
    cout << "  report-util    - Report system utilization" << endl;
    cout << "  process-smi       - Show summarized memory and CPU usage" << endl;
    cout << "  vmstat            - Show detailed virtual memory stats" << endl;
    cout << "  clear          - Clear screen" << endl;
    cout << "  exit           - Exit application\n\n" << endl;
}

void Console::start() {
 
    string exitInput = "exit";

    while (this->userInput != exitInput) {
        cout << "Enter a command: ";
        getline(cin, this->userInput);
        parseInput(this->userInput);
    }
}

void Console::initialize() {

    if (schedulerRunning) {
        std::cerr << "\033[31m";
        std::cerr << "Error: Cannot re-initialize system while scheduler is running.\n";
        std::cerr << "Stop the scheduler first using 'scheduler-stop'.\n";
        std::cerr << "\033[0m";
        return;
    }

    clear();

    std::ifstream config("config.txt");
    if (!config.is_open()) {
        std::cerr << "Error: Could not open config.txt\n";
        return;
    }


    // Set default values (matches old main.cpp)
    cpuCount = 1;
    timeQuantum = 0;
    batchProcessFreq = 1;
    minInstructions = 1000;
    maxInstructions = 2000;
    delayPerExecution = 0;
    schedulerType = "fcfs";
    memPerProc = 0;
    minMemPerProc = 0;
    maxMemPerProc = 0;

    // Create the directory if it does not exist
    if (!fs::exists(logDir)) {
        fs::create_directory(logDir);
    }

    // Create the directory for Snapshots
    //setupSnapshotDirectory();

    // If it exists and is a directory, delete .txt files
    if (fs::is_directory(logDir)) {
        for (const auto& entry : fs::directory_iterator(logDir)) {
            if (entry.path().extension() == ".txt") {
                fs::remove(entry);
            }
        }

        std::string key, value;
        while (config >> key >> value) {
            // Remove quotes if any
            value.erase(std::remove(value.begin(), value.end(), '\"'), value.end());

            if (key == "scheduler") schedulerType = value;
            else if (key == "num-cpu") cpuCount = std::stoi(value);
            else if (key == "quantum-cycles") timeQuantum = std::stoi(value);
            else if (key == "batch-process-freq") {
                batchProcessFreq = std::stoi(value);
                if (batchProcessFreq < 1) {
                    std::cerr << "\033[31mError: batch-process-freq must be at least 1\033[0m\n";
                    return;
                }
            }
            else if (key == "min-ins") minInstructions = std::stoi(value);
            else if (key == "max-ins") maxInstructions = std::stoi(value);
            else if (key == "delay-per-exec") delayPerExecution = std::stoi(value);
            else if (key == "max-overall-mem") maxOverallMem = std::stoi(value);
            else if (key == "mem-per-frame") memPerFrame = std::stoi(value);
            else if (key == "min-mem-per-proc") {minMemPerProc = std::stoi(value);}
            else if (key == "max-mem-per-proc") {maxMemPerProc = std::stoi(value);}
            else std::cout << "Warning: unknown key \"" << key << "\" skipped\n";
        }
        config.close();
        if (!memoryCheck(maxOverallMem,
            memPerFrame,
            minMemPerProc,
            maxMemPerProc)) {
            return;
        }


        // Initialize Memoery Manager                   
        memoryManager = std::make_unique<MemoryManager>(
            maxOverallMem,
            memPerFrame);

        memoryManager->initialize(maxOverallMem);

        memPerProc = maxMemPerProc;  // Or any value between min-max
        memoryManager->setMemPerProc(memPerProc);
        // Show config summary
        std::cout << "\033[32m";
        std::cout << "===============================\n";
        std::cout << "|    SYSTEM INITIALIZATION    |\n";
        std::cout << "===============================\n";
        std::cout << "\033[0m";

        std::cout << "\033[36m";
        std::cout << "Scheduler: " << schedulerType << "\n";
        std::cout << "CPU Count: " << cpuCount << "\n";

        if (schedulerType == "rr") {
            std::cout << "Quantum: " << timeQuantum << "\n";
        }
        else {
            std::cout << "Quantum: N/A (FCFS)\n";
        }

        std::cout << "Batch Frequency: " << batchProcessFreq << " ticks\n";
        std::cout << "Instructions: " << minInstructions << " to " << maxInstructions << "\n";
        std::cout << "Delay per Exec: " << delayPerExecution << "ms\n";
        std::cout << "Max overall Mem: " << maxOverallMem << " bytes\n";
        std::cout << "Min mem per Frame: " << memPerFrame << " bytes\n";
        std::cout << "Min mem per Proc: " << minMemPerProc << " bytes\n"; 
        std::cout << "Max mem per Proc: " << maxMemPerProc << " bytes\n"; 
        std::cout << "\033[0m";

        processes.clear();
        schedulerRunning = false;

        // Scheduler init
        if (schedulerType == "rr") {
            rrScheduler = std::make_unique<RRScheduler>(cpuCount, timeQuantum, delayPerExecution, memoryManager.get());
        }
        else if (schedulerType == "fcfs") {
            fcfsScheduler = std::make_unique<FCFSScheduler>(cpuCount, delayPerExecution, memoryManager.get());
        }
        else {
            std::cerr << "Error: unknown scheduler type '" << schedulerType << "' in config.txt\n";
        }
    }
}

bool Console:: memoryCheck(int maxMem, int frameSize, int minProcMem, int maxProcMem) {
    auto isPowerOfTwo = [&](int x) {
        return x > 0 && (x & (x - 1)) == 0;
        };

    if (!isPowerOfTwo(maxMem) || !isPowerOfTwo(frameSize)
        || !isPowerOfTwo(minProcMem) || !isPowerOfTwo(maxProcMem)) {
        std::cerr << "\033[31mError: Memory values must be powers of 2\033[0m\n";
        return false;
    }

    //if (minProcMem < 64 || maxProcMem < 64
    //    || minProcMem > 65536 || maxProcMem > 65536) {
    //    std::cerr << "\033[31mError: mem-per-proc values must be in range [64, 65536]\033[0m\n";
    //    return false;
    //}

    if (minProcMem > maxProcMem) {
        std::cerr << "\033[31mError: min-mem-per-proc cannot exceed max-mem-per-proc\033[0m\n";
        return false;
    }

    //if (maxProcMem > maxMem) {
    //    std::cerr << "\033[31mError: max-mem-per-proc exceeds max-overall-mem\033[0m\n";
    //    return false;
    //}

    //if (minProcMem % frameSize != 0 || maxProcMem % frameSize != 0) {
    //    std::cerr << "\033[31mError: mem-per-proc values must be divisible by mem-per-frame\033[0m\n";
    //    return false;
    //}

    return true;
}



void Console::schedulerStart() {
    clear();

    if (!fcfsScheduler && !rrScheduler) {
        std::cerr << "\033[31mError: Scheduler not initialized. Please run initialize first.\033[0m\n";
        return;
    }

    if (schedulerRunning) {
        std::cout << "\033[33mWarning: Scheduler is already running!\033[0m\n";
        return;
    }

    if (schedulerThread.joinable()) {
        std::cout << "\033[33mWarning: Scheduler thread is already running!\033[0m\n";
        return;
    }


    schedulerRunning = true;

    // Header depending on scheduler type
    std::cout << "\033[32m";
    std::cout << "=====================================\n";
    std::cout << "|      SCHEDULER START (" << (schedulerType == "rr" ? "RR" : "FCFS") << ")       |\n";
    std::cout << "=====================================\n";
    std::cout << "\033[0m";

    std::cout << "\033[36m";
    if (schedulerType == "rr") {
        std::cout << "Starting Round Robin scheduler with " << cpuCount << " CPUs and time quantum " << timeQuantum << "\n";
        rrScheduler->start();

    }
    else {
        std::cout << "Starting FCFS scheduler with " << cpuCount << " CPUs\n";
        fcfsScheduler->start();
    }
    std::cout << "Process will be generated every " << batchProcessFreq << " ticks\n";
    std::cout << "\033[0m";
    //batchProcessFreq = batchProcessFreq + 100;
    schedulerThread = std::thread([this]() {
        int tick = 0;

        while (schedulerRunning) {
            std::this_thread::sleep_for(std::chrono::milliseconds(delayPerExecution));
            tick++;



            if (!disableAutoSpawn) {
                if (tick % batchProcessFreq == 0) {
                    std::ostringstream nameStream;
                    nameStream << "p" << std::setfill('0') << std::setw(2) << ++pidCounter;
                    std::string name = nameStream.str();
                    int commands = minInstructions + (rand() % (maxInstructions - minInstructions + 1));
                    size_t memory = rollProcessMemory(minMemPerProc, maxMemPerProc);
                    auto process = std::make_shared<Process>(name, commands, memory, memoryManager.get());
                    {
                        std::lock_guard<std::mutex> lock(processesMutex);
                        processes.push_back(process);
                    }
                    if (schedulerType == "rr") {
                        rrScheduler->enqueueProcess(process);
                    }
                    else {
                        fcfsScheduler->addProcess(process);
                    }
                }
            }
        }
        });

    isInitialized = true;
    std::cout << "\033[36mScheduler started successfully.\n\n\033[0m";
}

void Console::createProcessFromCommand(const std::string& procName, int procMem) {
    if (!validateProcessCreation(procName, procMem)) {
        return;
    }

    int commands = minInstructions + (rand() % (maxInstructions - minInstructions + 1));
    size_t memory = procMem;
    auto process = std::make_shared<Process>(
        procName,
        commands,
        memory,
        memoryManager.get()
    );
    {
        std::lock_guard<std::mutex> lock(processesMutex);
        processes.push_back(process);
    }

    {
        if (schedulerType == "rr") {
            rrScheduler->enqueueProcess(process);
        }
        else {
            fcfsScheduler->addProcess(process);
        }

        pidCounter++;
        std::cout << "\033[32mCreated process \"" << procName << "\" with " << commands
            << " instructions and " << memory << " bytes of memory.\033[0m\n";
    }
}

void Console::attachToProcessScreen(const std::string& procName) {
    bool found = false;

    {
        std::lock_guard<std::mutex> lock(processesMutex);
        for (const auto& process : processes) {
            if (process->getName() == procName) {
                found = true;
                break;
            }
        }
    }
    if (!found) {
        std::cerr << "\033[31mError: Process \"" << procName << "\" not found.\033[0m\n";
        return;
    }

    showProcessScreen(procName);
}



void Console::screen() {
    if (userInput.find("-ls") != string::npos) {
        listProcesses();
    }
    else {
        cout << "Usage: screen -ls (to list processes)\n";
    }
}

void Console::showProcessScreen(const std::string& procName) {
    // Case-insensitive lookup
    auto toUpper = [&](std::string s) {
        for (auto& c : s) c = static_cast<char>(::toupper(c));
        return s;
        };
    std::string target = toUpper(procName);
    std::shared_ptr<Process> procPtr;

    for (auto& p : processes) {
        if (toUpper(p->name) == target) {
            procPtr = p;
            break;
        }
    }
    if (!procPtr) {
        std::cout << "\033[31mProcess not found: " << procName << "\033[0m\n";
        return;
    }

    // Clear screen
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif

    // Main loop
    while (true) {
        // A) Header
        std::cout << "Process name: " << procPtr->name << "\n";
        std::cout << "ID:           " << procPtr->process_id << "\n";
        std::cout << "Memory:       " << procPtr->memory << " bytes\n";

        // B) Logs
        std::cout << "Logs:\n";
        for (auto& line : procPtr->getRecentOutputs()) {
            std::cout << line << "\n";
        }
        std::cout << "\n";

        // C) Execution state
        std::cout << "Current instruction line: "
            << procPtr->getCurrentInstructionLine() << "\n";
        std::cout << "Lines of code:           "
            << procPtr->total_commands << "\n";

        // print status (e.g. “Core 0” or “Finished”)
        std::cout << "Status:                  "
            << procPtr->getStatus() << "\n";
               // print the next instruction itself, if not finished
            if (!procPtr->isFinished()) {
            auto & instrs = procPtr->getInstructions();
            int idx = procPtr->getCurrentInstructionLine();
            std::cout << "Current instruction:     "
                 << (idx < (int)instrs.size()
                    ? instrs[idx]->toString()
                    : std::string("<none>"))
                 << "\n";
            
        }
            if (procPtr->isFinished()) {
                if (procPtr->crashedDueToViolation) {
                    bool alreadyPrinted = false;
                    for (auto& line : procPtr->getRecentOutputs()) {
                        if (line.find(procPtr->violationMessage) != std::string::npos) {
                            alreadyPrinted = true;
                            break;
                        }
                    }
                    if (!alreadyPrinted) {
                        std::cout << "\033[31m" << procPtr->violationMessage << "\033[0m\n\n";
                    }
                }
                else {
                    std::cout << "Finished!\n\n";
                }
            }

        // D) Prompt
        while (true) {
            std::cout << "\n";
            std::cout << "(type 'exit' to return or 'process-smi' to refresh) > ";
            std::string cmd;
            std::getline(std::cin, cmd);

            // strip trailing CR/whitespace (so "exit\r" or "exit " still matches)
            while (!cmd.empty() && (cmd.back() == '\r' || std::isspace((unsigned char)cmd.back()))) {
                cmd.pop_back();
            }

            // make uppercase so it's case‐insensitive
            std::transform(cmd.begin(), cmd.end(), cmd.begin(),
                [](unsigned char c) { return std::toupper(c); });

            if (cmd == "EXIT") {
                procPtr->clearRecentOutputs();
                // return out of showProcessScreen entirely
#ifdef _WIN32
                system("cls");
#else
                system("clear");
#endif          
                header();
                return;
            }
            else if (cmd == "PROCESS-SMI") {
                procPtr->clearRecentOutputs();
                // redraw the same screen
                break;
            }
            else {
                std::cout << "Unknown command: " << cmd << "\n";
                // and loop back without leaving
                continue;
            }
        }

        // if we got here, user typed PROCESS-SMI, so we just fall out of
        // the prompt‐loop and the outer while(true) at the top of
        // showProcessScreen will re-draw automatically.

        
    }
}




void Console::printUtilization(std::ostream* out) const {
    std::ostream& o = out ? *out : std::cout;

    // Count how many processes are currently assigned to a core
    int coresUsed = 0;
    for (const auto& p : processes) {
        if (!p->isFinished() && p->core_id != -1) {
            coresUsed++;
        }
    }

    int coresAvail = cpuCount - coresUsed;
    double utilization = (double)coresUsed / cpuCount * 100.0;

    o << "CPU utilization: "
        << std::fixed << std::setprecision(0)
        << utilization << "%\n";
    o << "Cores used:       " << coresUsed << "\n";
    o << "Cores available:  " << coresAvail << "\n";
    o << "----------------------------------------\n";
}



void Console::listProcesses() {
    system("cls");// remove past DELETE

    if (processes.empty()) {
        clear();
        std::cout << "\033[93m"; // Light yellow
        std::cout << "No processes available.\n";
        std::cout << "\033[0m";
        return;
    }

    header();

    // Green header and lines
    std::cout << "\033[32m";
    std::cout << "\n\nList of processes (Refreshed at " << getCurrentTime() << "):\n";
    std::cout << "=====================================================================\n";
    std::cout << "\033[0m";

    // CPU summary: light yellow (optional, you can keep default if preferred)
    std::cout << "\033[93m";
    printUtilization(nullptr);
    std::cout << "\033[0m";

    // Column headers: cyan
    std::cout << "\033[36m";
    std::cout << std::left << std::setw(10) << "Name"
        << std::setw(25) << "Start Time"
        << std::setw(15) << "Status"
        << std::setw(15) << "Progress"
        << std::setw(10) << "Memory"
        << "Core Assignment\n";
    std::cout << "\033[0m";

    // Green divider
    std::cout << "\033[32m";
    std::cout << "=====================================================================\n\n";
    std::cout << "\033[0m";

    // Light yellow for process rows
    std::cout << "\033[93m";
    if (schedulerType == "rr") {
        rrScheduler->displayProcesses(); // implemented RR version for displayProcesses()
    }
    else {
        fcfsScheduler->displayProcesses();
    }

    std::cout << "\033[0m";

    std::cout << "\033[32m";
    std::cout << "=====================================================================\n";
    std::cout << "\033[0m";
}



void Console::displayContinuousUpdates() {
    while (schedulerRunning) {
        header();
        listProcesses();
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}

void Console::schedulerTest() {
    if (processes.empty()) {
        std::cout << "No processes to schedule. Use 'scheduler-start' first.\n";
        return;
    }

    // Clear screen and show test header
    clear();
    std::cout << "========================================\n";
    std::cout << "|        SCHEDULER TEST MODE          |\n";
    std::cout << "========================================\n";
    std::cout << (schedulerType == "rr"
        ? "Round Robin | CPUs: " + std::to_string(cpuCount) + " | Quantum: " + std::to_string(timeQuantum) + "\n"
        : "FCFS | CPUs: " + std::to_string(cpuCount) + "\n");
    std::cout << "----------------------------------------\n";
    std::cout << "Valid commands:\n";
    std::cout << "  stop      - Terminate all processes\n";
    std::cout << "  pause     - Pause execution\n";
    std::cout << "  continue  - Resume execution\n";
    std::cout << "  exit-test - Exit test mode\n";
    std::cout << "----------------------------------------\n\n";

    schedulerRunning = true;
    std::atomic<bool> paused{ false };
    std::atomic<bool> shouldStop{ false };
    std::atomic<bool> exitTest{ false };

    // Input handling thread
    std::thread inputThread([&]() {
        std::string cmd;
        while (schedulerRunning && !exitTest) {
            std::cout << "test> ";
            std::getline(std::cin, cmd);

            // Convert to lowercase and trim whitespace
            cmd.erase(remove_if(cmd.begin(), cmd.end(), ::isspace), cmd.end());
            transform(cmd.begin(), cmd.end(), cmd.begin(), ::tolower);

            if (cmd == "stop") {
                shouldStop = true;
                schedulerRunning = false;
                std::cout << "\033[31mTerminating all processes...\033[0m\n";
            }
            else if (cmd == "pause") {
                paused = true;
                std::cout << "\033[33mTest paused. Type 'continue' to resume.\033[0m\n";
            }
            else if (cmd == "continue") {
                paused = false;
                std::cout << "\033[32mResuming test...\033[0m\n";
            }
            else if (cmd == "exit-test") {
                exitTest = true;
                std::cout << "\033[36mExiting test mode...\033[0m\n";
            }
            else {
                std::cout << "\033[31mInvalid command in test mode.\033[0m Valid commands: "
                    << "\033[36mstop, pause, continue, exit-test\033[0m\n";
            }

        }
        });

    // Scheduler thread
    std::thread schedulerThread([this, &paused, &shouldStop, &exitTest]() {
        if (schedulerType == "rr") {
            rrScheduler->start();
        }
        else {
            fcfsScheduler->start();
        }

        while (schedulerRunning && !exitTest) {
            if (paused) {
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                continue;
            }

            // Check if all processes are finished
            bool allFinished = true;
            {
                std::lock_guard<std::mutex> lock(processesMutex);
                for (const auto& p : processes) {
                    if (!p->isFinished()) {
                        allFinished = false;
                        break;
                    }
                }
            }

            if (allFinished) {
                std::cout << "\nAll processes completed.\n";
                schedulerRunning = false;
                break;
            }

            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }

        // Cleanup
        if (shouldStop) {
            // Force terminate all processes
            std::lock_guard<std::mutex> lock(processesMutex);
            for (auto& p : processes) {
                if (!p->isFinished()) {
                    p->core_id = -1;
                    p->executed_commands = p->total_commands; // Mark as finished
                }
            }
        }

        if (schedulerType == "rr") {
            rrScheduler->stop();
        }
        else {
            fcfsScheduler->stop();
        }
        });

    // Display thread
    std::thread displayThread([this, &paused, &exitTest]() {
        while (schedulerRunning && !exitTest) {
            if (paused) {
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                continue;
            }

            system("cls");
            header();
            listProcesses();
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
        }
        });

    // Wait for threads
    if (schedulerThread.joinable()) schedulerThread.join();
    if (displayThread.joinable()) displayThread.join();
    if (inputThread.joinable()) inputThread.join();

    // Clear and return to main menu
    if (exitTest) {
        clear();
        header();
    }
    else {
        std::cout << "\nTest completed. Press any key to continue...\n";
        std::cin.ignore();
        clear();
        header();
    }
}

void Console::schedulerStop() {
    if (schedulerRunning) {
        schedulerRunning = false; // Stop adding new processes only

        if (schedulerThread.joinable()) {
            schedulerThread.join();
        }
        std::cout << "\033[31m";
        std::cout << "==============================\n";
        std::cout << "|    PROCESS FEED STOPPED    |\n";
        std::cout << "==============================\n";
        std::cout << "\033[0m";
    }
    else {
        std::cout << "Scheduler is not currently accepting new processes.\n";
    }
}


void Console::reportUtil() {
    std::ofstream file("csopesy-log.txt");
    if (!file.is_open()) {
        std::cerr << "Error: Could not open csopesy-log.txt for writing.\n";

        std::cout << "Current directory: " << std::filesystem::current_path() << '\n';
        return;
    }

    if (processes.empty()) {
        file << "No processes available.\n";
        file.close();
        return;
    }

    // Timestamp
    file << "List of processes (Saved at " << getCurrentTime() << "):\n";
    file << "=====================================================================\n";

    printUtilization(&file);  

    // Column headers
    file << std::left << std::setw(10) << "Name"
        << std::setw(25) << "Start Time"
        << std::setw(15) << "Status"
        << std::setw(15) << "Progress"
        << std::setw(10) << "Memory"
        << "Core Assignment\n";

    file << "=====================================================================\n\n";

    if (schedulerType == "rr") {
        rrScheduler->displayProcesses(file); // implemented displayProcess(file) version for RR
                                             // for uniformity and avoid access to destroyed process objects
    }
    else {
        fcfsScheduler->displayProcesses(file);  // also overloaded
    }


    file << "=====================================================================\n";
    file.close();

    std::cout << "Report generated at ./Debug/csopesy-log.txt!\n\n";
}


void Console::clear() {
    system("cls");
    header();
}




void Console::parseInput(std::string userInput) {
    std::string originalInput = userInput;
    

    std::string loweredInput = userInput;
    std::transform(loweredInput.begin(), loweredInput.end(), loweredInput.begin(), ::tolower);

    std::istringstream iss(loweredInput);
    std::vector<std::string> args;
    std::string token;

    while (iss >> token) {
        args.push_back(token);
    }

    if (args.empty()) return;

    if (args[0] == "exit") {
        std::_Exit(EXIT_SUCCESS);
    }
    else if (args[0] == "initialize") {
        initialize();
    }
    else if (args[0] == "screen" && args.size() == 2 && args[1] == "-ls") {
        screen();
    }
    else if (args[0] == "scheduler-start") {
        schedulerStart();
    }
    else if (args[0] == "scheduler-test") {
        schedulerTest();
    }
    else if (args[0] == "scheduler-stop") {
        schedulerStop();
    }
    else if (args[0] == "report-util") {
        reportUtil();
    }
    else if (args[0] == "clear") {
        clear();
    }
    // NEW: screen -s <process_name> <process_memory_size>
    else if (args[0] == "screen" && args.size() == 4 && args[1] == "-s") {
        std::string procName = args[2];
        try {
            int procMem = std::stoi(args[3]);
            createProcessFromCommand(procName, procMem);
        }
        catch (...) {
            std::cerr << "Error: Memory size must be a valid integer.\n";
        }
    }
    // screen -r <process_name>
    else if (args[0] == "screen" && args.size() == 3 && args[1] == "-r") {
        std::string procName = args[2];
        attachToProcessScreen(procName);
    }
    else if (args[0] == "screen" && args.size() >= 5 && args[1] == "-c") {
        std::string procName = args[2];

        int memSize;
        try {
            memSize = std::stoi(args[3]);
        }
        catch (...) {
            std::cerr << "\033[31mError: Memory size must be a valid integer.\033[0m\n";
            return;
        }

        size_t firstQuote = originalInput.find('"');
        size_t lastQuote = originalInput.rfind('"');
        if (firstQuote == std::string::npos || lastQuote == std::string::npos || lastQuote <= firstQuote) {
            std::cerr << "\033[31mError: Instruction string must be wrapped in double quotes.\033[0m\n";
            return;
        }

        std::string instructionStr = originalInput.substr(firstQuote + 1, lastQuote - firstQuote - 1);

        createProcessWithInstructions(procName, memSize, instructionStr);
    }
    else if (args[0] == "process-smi") {
        reportProcessSMI();
    }
    else if (args[0] == "vmstat") {
        reportVMStat();
    }
    else if (args[0] == "disable-autospawn") {
        disableAutoSpawn = true;
        std::cout << "[INFO] Auto-process spawning disabled.\n";
    }
    else if (args[0] == "enable-autospawn") {
        disableAutoSpawn = false;
        std::cout << "[INFO] Auto-process spawning enabled.\n";
    }
    else {
        std::cout << "Unknown command: " << userInput << "\n";
    }
}

// New

bool Console::isValidProcessMemory(int procMem) {
    auto isPowerOfTwo = [](int x) {
        return x > 0 && (x & (x - 1)) == 0;
        };

    if (!isPowerOfTwo(procMem)) {
        std::cerr << "\033[31mInvalid memory allocation: Not a power of 2\033[0m\n";
        return false;
    }

    if (procMem < 64 || procMem > 65536) {
        std::cerr << "\033[31mInvalid memory allocation: Must be in range [64, 65536]\033[0m\n";
        return false;
    }

    return true;
}

bool Console::validateProcessCreation(const std::string& procName, int procMem) {
    clear();
    if (procName.empty()) {
        std::cout << "\033[33mWarning: Process name required.\033[0m\n";
        return false;
    }

    if (!isValidProcessMemory(procMem)) {
        return false;
    }

    if (!fcfsScheduler && !rrScheduler) {
        std::cerr << "\033[31mError: Scheduler not initialized. Please run initialize first.\033[0m\n";
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(processesMutex);
        for (const auto& p : processes) {
            if (p->getName() == procName) {
                std::cout << "\033[33mWarning: Process \"" << procName << "\" already exists.\033[0m\n";
                return false;
            }
        }
    }

    return true;
}

void Console::createProcessWithInstructions(const std::string& procName, int procMem, const std::string& instructionStr) {
    // Validate process creation
    if (!validateProcessCreation(procName, procMem)) {
        return;
    }

    std::cout << "[INFO] Creating process: " << procName << "\n";
    std::cout << "[INFO] Memory size: " << procMem << " bytes\n";
    std::cout << "[INFO] Raw instruction input: " << instructionStr << "\n";

    std::vector<std::shared_ptr<Instruction>> parsedInstructions;

    // Step 1: Split raw input into instruction lines (handle quoted PRINTs)
    std::vector<std::string> instructionLines;
    std::string current;
    bool insideQuote = false;

    for (char ch : instructionStr) {
        if (ch == '"') insideQuote = !insideQuote;
        if (ch == ';' && !insideQuote) {
            if (!current.empty()) {
                instructionLines.push_back(current);
                current.clear();
            }
        }
        else {
            current += ch;
        }
    }

    if (!current.empty()) instructionLines.push_back(current);

    std::cout << "[INFO] Parsed instructions:\n";

    for (auto& line : instructionLines) {
        // Trim leading/trailing whitespace
        line.erase(0, line.find_first_not_of(" \t\r\n"));
        line.erase(line.find_last_not_of(" \t\r\n") + 1);
        if (line.empty()) continue;

        std::cout << " - " << line << "\n";

        std::stringstream ss(line);

        std::string keyword;
        size_t keywordEnd = 0;
        while (keywordEnd < line.length() && std::isalnum(line[keywordEnd])) {
            keywordEnd++;
        }
        keyword = line.substr(0, keywordEnd);

        // Lowercase keyword
        std::transform(keyword.begin(), keyword.end(), keyword.begin(), [](unsigned char c) {
            return std::tolower(c);
            });

        if (keyword == "declare") {
            std::istringstream args(line.substr(keywordEnd));
            std::string var;
            int value;
            args >> var >> value;
            parsedInstructions.push_back(std::make_shared<DeclareInstruction>(var, static_cast<uint16_t>(value)));
        }
        else if (keyword == "add") {
            std::string argsLine = line.substr(keywordEnd);
            argsLine.erase(0, argsLine.find_first_not_of(" \t\r\n"));

            std::istringstream args(argsLine);
            std::string target, op1, op2;
            args >> target >> op1 >> op2;

            std::cout << "   → Parsed ADD: " << target << ", " << op1 << ", " << op2 << "\n";

            parsedInstructions.push_back(std::make_shared<AddInstruction>(target, op1, op2));
        }
        else if (keyword == "sub") {
            std::string argsLine = line.substr(keywordEnd);
            argsLine.erase(0, argsLine.find_first_not_of(" \t\r\n"));

            std::istringstream args(argsLine);
            std::string target, op1, op2;
            args >> target >> op1 >> op2;

            parsedInstructions.push_back(std::make_shared<SubtractInstruction>(target, op1, op2));
        }
        else if (keyword == "write") {
            std::string skip, addrStr, var;
            ss >> skip >> addrStr >> var;
            try {
                int addr = std::stoi(addrStr, nullptr, 16);
                parsedInstructions.push_back(std::make_shared<WriteInstruction>(addr, var));
            }
            catch (...) {
                std::cerr << "[ERROR] Invalid WRITE address format: " << addrStr << "\n";
            }
        }
        else if (keyword == "read") {
            std::string skip, var, addrStr;
            ss >> skip >> var >> addrStr;
            try {
                int addr = std::stoi(addrStr, nullptr, 16);
                parsedInstructions.push_back(std::make_shared<ReadInstruction>(var, addr));
            }
            catch (...) {
                std::cerr << "[ERROR] Invalid READ address format: " << addrStr << "\n";
            }
        }
        else if (keyword == "print") {
            handlePrintInstruction(line, parsedInstructions);
        }
        else {
            std::cerr << "[WARNING] Unknown instruction: " << keyword << "\n";
        }
    }

    if (parsedInstructions.empty()) {
        std::cerr << "[ERROR] No valid instructions found. Process not created.\n";
        return;
    }

    // Step 2: Create and queue process
    auto process = std::make_shared<Process>(
        procName,
        parsedInstructions,
        procMem,
        memoryManager.get()
    );

    {
        std::lock_guard<std::mutex> lock(processesMutex);
        processes.push_back(process);
    }


    if (schedulerType == "rr") {
        rrScheduler->enqueueProcess(process);
    }
    else {
        fcfsScheduler->addProcess(process);
    }

    std::cout << "[SUCCESS] Process " << procName << " created with " << parsedInstructions.size()
        << " instruction(s) and queued.\n";
}


void Console::handlePrintInstruction(const std::string& line, std::vector<std::shared_ptr<Instruction>>& parsedInstructions) {
    std::string message_content = "";
    std::string variable_name = "";
    bool has_var = false;

    size_t open_paren = line.find('(');
    size_t close_paren = line.rfind(')');

    if (open_paren != std::string::npos && close_paren != std::string::npos && close_paren > open_paren) {
        std::string args_content = line.substr(open_paren + 1, close_paren - open_paren - 1);

        size_t start_quote = args_content.find('\"');
        if (start_quote != std::string::npos) {
            size_t end_quote = args_content.find('\"', start_quote + 1);
            if (end_quote != std::string::npos) {
                message_content = args_content.substr(start_quote + 1, end_quote - start_quote - 1);
                message_content.erase(std::remove(message_content.begin(), message_content.end(), '\\'), message_content.end());


                size_t plus_position = args_content.find('+', end_quote);
                if (plus_position != std::string::npos) {
                    has_var = true;
                    variable_name = args_content.substr(plus_position + 1);

                    // Clean leading/trailing whitespace
                    variable_name.erase(0, variable_name.find_first_not_of(" \t"));
                    variable_name.erase(variable_name.find_last_not_of(" \t") + 1);

                    if (variable_name.empty()) {
                        has_var = false;
                    }
                }
            }
        }
    }

    if (has_var && !variable_name.empty())
        parsedInstructions.push_back(std::make_shared<PrintInstruction>(message_content, variable_name));
    else
        parsedInstructions.push_back(std::make_shared<PrintInstruction>(message_content));
}

int Console::rollProcessMemory(int minMem, int maxMem) {  
    if (minMem == maxMem) {
        return minMem;
    }
    int expMin = static_cast<int>(std::log2(minMem));
    int expMax = static_cast<int>(std::log2(maxMem));
    int e = expMin + (std::rand() % (expMax - expMin + 1));
    return (1 << e);
}

std::string padLine(const std::string& content, int width = 60) {
    std::ostringstream oss;
    oss << "| " << std::left << std::setw(width - 1) << content << "|";
    return oss.str();
}

void Console::reportProcessSMI() {

    clear();
    if (!memoryManager) {
        std::cerr << "System not initialized.\n";
        return;
    }

    // Frame & memory calculation
    int frameSize = memoryManager->getFrameSizeBytes();
    int totalMem = memoryManager->getTotalMemory();  // Get from MemoryManager
    int totalFrames = totalMem / frameSize;

    int usedFrames = 0;
    for (int i = 0; i < totalFrames; ++i) {
        if (memoryManager->isFrameOccupied(i)) ++usedFrames;
    }

    int usedMem = usedFrames * frameSize;
    double memUtil = (double)usedMem / (double)totalMem * 100.0;
    int cpuUtil = 100;  // Placeholder for now

    // Header output
    std::cout << "+------------------------------------------------------------+\n";
    std::cout << "|  PROCESS-SMI  V01.00       Driver Version: 01.00           |\n";
    std::cout << "+------------------------------------------------------------+\n";
    std::cout << padLine("CPU Utilization:   " + std::to_string(cpuUtil) + "%") << "\n";

    std::ostringstream memUsageLine;
    memUsageLine << "Memory Usage:      " << usedMem << " B / " << totalMem << " B";
    std::cout << padLine(memUsageLine.str()) << "\n";

    std::ostringstream memUtilLine;
    memUtilLine << "Memory Util:       " << std::fixed << std::setprecision(1) << memUtil << "%";
    std::cout << padLine(memUtilLine.str()) << "\n";
    std::cout << "+------------------------------------------------------------+\n";
    std::cout << "| Running Processes and Page Usage:                          |\n";
    std::cout << "|------------------------------------------------------------|\n";
    std::cout << "| " << std::left
        << std::setw(13) << "Process"
        << std::setw(10) << "PID"
        << std::setw(12) << "Mem (B)"
        << std::setw(24) << "Pages Referenced"
        << std::right << "|\n";
    std::cout << "|------------------------------------------------------------|\n";

    // Process listing
    std::lock_guard<std::mutex> lock(processesMutex);
    for (const auto& p : processes) {
        std::unordered_set<uint16_t> pageSet;
        const auto& instrs = p->getInstructions();

        for (const auto& instr : instrs) {
            auto str = instr->toString();
            if (str.find("READ") != std::string::npos ||
                str.find("WRITE") != std::string::npos) {
                size_t addrPos = str.find("0x");
                if (addrPos != std::string::npos) {
                    std::stringstream ss;
                    ss << std::hex << str.substr(addrPos + 2, 4);
                    uint16_t addr;
                    ss >> addr;
                    uint16_t page = addr / frameSize;
                    pageSet.insert(page);
                }
            }
        }

        std::stringstream pageList;
        for (auto page : pageSet) {
            pageList << page << " ";
        }

        std::cout << "| " << std::left
            << std::setw(13) << p->getName()
            << std::setw(10) << p->process_id
            << std::setw(12) << p->memory
            << std::setw(24) << pageList.str()
            << std::right << "|\n";
    }

    std::cout << "+------------------------------------------------------------+\n\n";
}
void Console::reportVMStat() {
    if (!memoryManager) {
        std::cerr << "System not initialized.\n";
        return;
    }

    int frameSize = memoryManager->getFrameSizeBytes();
    int totalMem = memoryManager->getTotalMemory();
    int totalFrames = totalMem / frameSize;

    int usedFrames = 0;
    for (int i = 0; i < totalFrames; ++i) {
        if (memoryManager->isFrameOccupied(i)) ++usedFrames;
    }

    int usedMem = usedFrames * frameSize;
    int freeMem = totalMem - usedMem;

    // Placeholder values
    int pageIns = memoryManager->getPageIns();
    int pageOuts = memoryManager->getPageOuts();
    extern int cpuActiveTicks;
    extern int cpuIdleTicks;

    auto line = [](const std::string& left, int val, const std::string& unit = "bytes") {
        std::ostringstream oss;
        oss << "| " << std::left << std::setw(22) << (left + ":")
            << std::setw(6) << val << " " << std::setw(30) << unit << "|\n";
        return oss.str();
        };

    auto row2 = [](const std::string& l1, int v1, const std::string& l2, int v2, const std::string& u1 = "", const std::string& u2 = "") {
        std::ostringstream oss;
        oss << "| " << std::left
            << std::setw(21) << (l1 + ":") << std::setw(5) << v1
            << "    " << std::setw(22) << (l2 + ":") << std::setw(7) << v2
            << "|\n";
        return oss.str();
        };

    std::cout << "+------------------------------------------------------------+\n";
    std::cout << "|  VMSTAT  V01.00               Memory Monitor Report        |\n";
    std::cout << "+------------------------------------------------------------+\n";

    std::cout << line("Total Memory", totalMem);
    std::cout << line("Used Memory", usedMem);
    std::cout << line("Free Memory", freeMem);
    std::cout << "|                                                            |\n";

    std::cout << row2("Used Frames", usedFrames, "Free Frames", totalFrames - usedFrames);
    std::cout << row2("Page-ins", pageIns, "Page-outs", pageOuts);
    std::cout << row2("CPU Active Time", cpuActiveTicks, "CPU Idle Time", cpuIdleTicks, "ticks", "ticks");

    std::cout << "+------------------------------------------------------------+\n\n";
}
