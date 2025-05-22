#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <ctime>
#include <windows.h>
#include <optional>

using namespace std;

class Formatter{
private:
    HANDLE stdHandle;

public:
    Formatter() {
        stdHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    }

    void clearScreen() {
        CONSOLE_SCREEN_BUFFER_INFO csbi;
        DWORD consoleSize;
        DWORD charsWritten;
        COORD topLeft = { 0, 0 };

        // console screen buffer 
        GetConsoleScreenBufferInfo(stdHandle, &csbi);

        // size of the console 
        consoleSize = csbi.dwSize.X * csbi.dwSize.Y;

        // fill the screen with spaces
        FillConsoleOutputCharacter(
            stdHandle,
            ' ',
            consoleSize,
            topLeft,
            &charsWritten
        );

        // retain current attributes 
        FillConsoleOutputAttribute(
            stdHandle,
            csbi.wAttributes,
            consoleSize,
            topLeft,
            &charsWritten
        );

        // reset cursor position
        SetConsoleCursorPosition(stdHandle, topLeft);
    }

    static string formatString(const string& input, size_t width, bool alignRight = false) {
        if (input.length() > width) {
            return "..." + input.substr(input.length() - (width - 3));
        } else {
            if (alignRight) {
                return string(width - input.length(), ' ') + input;
            } else {
                return input + string(width - input.length(), ' ');
            }
        }
    }

    static string getCurrentDateTime() {
        time_t now = time(0);
        struct tm* timeinfo = localtime(&now);
        char buffer[80];
        strftime(buffer, 80, "%a %b %d %H:%M:%S %Y", timeinfo);
        return string(buffer);
    }
};

class Process {
private:
    int pid;
    std::optional<int> giId;
    std::optional<int> ciId;
    string type;
    string name;
    std::optional<int> gpuMemoryUsage;

public:
    Process(std::optional<int> _giId, std::optional<int> _ciId, 
            int _pid, string _type, string _name, std::optional<int> _gpuMemoryUsage)
        : giId(_giId), ciId(_ciId), pid(_pid), type(_type), name(_name), gpuMemoryUsage(_gpuMemoryUsage) {}

    int getPid() const { return pid; }
    string getType() const { return type; }
    string getName() const { return name; }
    
    string getGiIdString() const {
        return giId.has_value() ? std::to_string(giId.value()) : "N/A";
    }
    
    string getCiIdString() const {
        return ciId.has_value() ? std::to_string(ciId.value()) : "N/A";
    }
    
    string getGpuMemoryUsageString() const {
        if (gpuMemoryUsage.has_value()) {
            return std::to_string(gpuMemoryUsage.value()) + "MiB";
        }
        return "N/A";
    }
    
    bool hasGpuMemoryUsage() const { return gpuMemoryUsage.has_value(); }
    int getGpuMemoryUsage() const { return gpuMemoryUsage.value_or(0); }
};

class GPU{
private:
    int gpuId;
    string name;
    string driverVersion;
    string cudaVersion;
    int temperature;
    int powerUsage;
    int powerLimit;
    int memoryUsed;
    int memoryTotal;
    int gpuUtilization;
    int memoryUtilization;
    vector<Process> processes;
public:
    GPU(int _gpuId, string _name, string _driverVersion, string _cudaVersion,
        int _temperature, int _powerUsage, int _powerLimit,
        int _memoryUsed, int _memoryTotal, int _gpuUtilization, int _memoryUtilization)
        : gpuId(_gpuId)
        , name(_name)
        , driverVersion(_driverVersion)
        , cudaVersion(_cudaVersion)
        , temperature(_temperature)
        , powerUsage(_powerUsage)
        , powerLimit(_powerLimit)
        , memoryUsed(_memoryUsed)
        , memoryTotal(_memoryTotal)
        , gpuUtilization(_gpuUtilization)
        , memoryUtilization(_memoryUtilization){}

    void addProcess(const Process& process) {
        // sort order by PID
        auto iter = processes.begin();
        while (iter != processes.end() && iter->getPid() < process.getPid()) {
            ++iter;
        }
        processes.insert(iter, process);
    }

    int getGpuId() const { return gpuId; }
    string getName() const { return name; }
    string getDriverVersion() const { return driverVersion; }
    string getCudaVersion() const { return cudaVersion; }
    int getTemperature() const { return temperature; }
    int getPowerUsage() const { return powerUsage; }
    int getPowerLimit() const { return powerLimit; }
    int getMemoryUsed() const { return memoryUsed; }
    int getMemoryTotal() const { return memoryTotal; }
    int getGpuUtilization() const { return gpuUtilization; }
    int getMemoryUtilization() const { return memoryUtilization; }
    const vector<Process>& getProcesses() const { return processes; }
};

class NvidiaDisplay {
private:
    GPU gpu;
    Formatter console;

public:
    NvidiaDisplay(const GPU& _gpu) : gpu(_gpu) {}

    void display() {
        console.clearScreen();
        cout << Formatter::getCurrentDateTime() << endl;
        // displayHeader();
        displayProcessHeader();
        displayProcessList(gpu);
    }

private:
    // void displayHeader() {
    //         cout << "+-----------------------------------------------------------------------------+" << endl;
    //         cout << "| NVIDIA-SMI " <<  
    //                 << "            Driver Version: " << Formatter::formatString(gpu.getDriverVersion(), 10) 
    //                 << "   CUDA: " << Formatter::formatString(gpu.getCudaVersion(), 5) << " |" << endl;
    //         cout << "|-------------------------------+----------------------+----------------------|" << endl;
    //         cout << "| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |" << endl;
    //         cout << "| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |" << endl;
    //         cout << "|                               |                      |               MIG M. |" << endl;
    //         cout << "|===============================+======================+======================|" << endl;
    // }




    void displayProcessHeader() {
        cout << "+-----------------------------------------------------------------------------+" << endl;
        cout << "| Processes:                                                                  |" << endl;
        cout << "|  GPU   GI   CI        PID   Type    Process name                 GPU Memory |" << endl;
        cout << "|        ID   ID                                                   Usage      |" << endl;
        cout << "|=============================================================================|" << endl;
    }

    void displayProcessList(const GPU& gpu) {
        for (const auto& process : gpu.getProcesses()) {
            cout << "|" << setw(5) << gpu.getGpuId()
                << setw(6) << process.getGiIdString() 
                << setw(6) << process.getCiIdString() 
                << setw(10) << process.getPid() << "   " 
                << Formatter::formatString(process.getType(), 4) 
                << "   " << Formatter::formatString(process.getName(), 28) 
                << "    " << setw(10) << process.getGpuMemoryUsageString() << " |" << endl;
        }
        cout << "+-----------------------------------------------------------------------------+" << endl;
    }
};

int main() {

    GPU gpu(0, "NVIDIA GeForce RTX 3080", "535.104.05", "12.2", 45, 220, 320, 2048, 10240, 85, 70);
    

    gpu.addProcess(Process(std::nullopt, std::nullopt, 12145, "C", "python", std::nullopt));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 23456, "C+", "jupyter-notebook", 980));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 34567, "G", "chrome", 678));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 45678, "C", "pytorch_trainer.py", 1320));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 56789, "C+", "very_long_process_name_that_exceeds_display_width", 998));

    NvidiaDisplay display (gpu);  
    display.display(); 
    return 0;
}