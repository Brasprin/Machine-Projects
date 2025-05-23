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

    static string formatString(int input, size_t width, bool alignRight = false) {
        return formatString(to_string(input), width, alignRight);
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
    string driverModel;
    string busId;
    string displayActive;
    std::optional<std::string> eccStatus;
    int temperature;
    string perfState;
    int powerUsage;
    int powerLimit;
    int memoryUsed;
    int memoryTotal;
    int gpuUtilization;
    string computeMode;
    std::optional<std::string> migMode;
    vector<Process> processes;
public:
    GPU(int _gpuId, string _name, string _driverVersion, string _cudaVersion,
        string _driverModel, string _busId, string _displayActive, std::optional<std::string> _eccStatus,
        string _perfState, int _temperature, int _powerUsage, int _powerLimit, int _memoryUsed, int _memoryTotal, 
        int _gpuUtilization, string _computeMode, std::optional<std::string> _migMode)
        : gpuId(_gpuId)
        , name(_name)
        , driverVersion(_driverVersion)
        , cudaVersion(_cudaVersion)
        , driverModel(_driverModel)
        , busId(_busId)
        , displayActive(_displayActive)
        , eccStatus(_eccStatus)
        , perfState(_perfState)
        , temperature(_temperature)
        , powerUsage(_powerUsage)
        , powerLimit(_powerLimit)
        , memoryUsed(_memoryUsed)
        , memoryTotal(_memoryTotal)
        , gpuUtilization(_gpuUtilization)
        , computeMode(_computeMode)
        , migMode(_migMode) {}

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
    string getDriverModel() const { return driverModel; }
    string getBusId() const { return busId; }
    string getDisplayActive() const { return displayActive; }
    std::string getEccStatus() const {
        return eccStatus.has_value() ? eccStatus.value() : "N/A";
    }
    std::string getTemperature() const { 
        return std::to_string(temperature) + "C"; 
    }
    string getPerfState() const { return perfState; }
    
    std::string getPowerUsage() const { 
        return std::to_string(powerUsage) + "W"; 
    }
    std::string getPowerLimit() const { 
        return std::to_string(powerLimit) + "W"; 
    }
    std::string getMemoryUsed() const { 
        return std::to_string(memoryUsed) + "MiB"; 
    }
    std::string getMemoryTotal() const { 
        return std::to_string(memoryTotal) + "MiB"; 
    }
    std::string getGpuUtilization() const { 
        return std::to_string(gpuUtilization) + "%"; 
    }
    string getComputeMode() const { return computeMode; }
    std::string getMigMode() const {
        return migMode.has_value() ? migMode.value() : "N/A";
    }
    const vector<Process>& getProcesses() const { return processes; }
};

class NvidiaDisplay {
private:
    GPU gpu;
    Formatter console;
    const string NVIDIA_SMI_VERSION = "572.83";

public:
    NvidiaDisplay(const GPU& _gpu) : gpu(_gpu) {}

    void display() {
        console.clearScreen();
        cout << Formatter::getCurrentDateTime() << endl;
        displayHeader();
        displayGpuInfo();
        displayProcessHeader();
        displayProcessList();
    }

private:
    void displayHeader() {
            cout << "+-----------------------------------------------------------------------------------------+" << endl;
            cout << "| NVIDIA-SMI " << Formatter::formatString(NVIDIA_SMI_VERSION, 23)
                    << "Driver Version: " << Formatter::formatString(gpu.getDriverVersion(), 15) 
                    << "CUDA VERSION: " << Formatter::formatString(gpu.getCudaVersion(), 8) << " |" << endl;
            cout << "|-----------------------------------------+------------------------+----------------------+" << endl;
            cout << "| GPU  Name                  Driver-Model | Bus-Id          Disp.A | Volatile Uncorr. ECC |" << endl;
            cout << "| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |" << endl;
            cout << "|                                         |                        |               MIG M. |" << endl;
            cout << "|=========================================+========================+======================|" << endl;
    }


    void displayGpuInfo() {
    // First line:
    cout << "|" << Formatter::formatString(gpu.getGpuId(), 4, true) 
        <<  Formatter::formatString(gpu.getName(), 28, true) 
        <<  Formatter::formatString(gpu.getDriverModel(), 7, true) 
        << Formatter::formatString("|", 3, true) 
        << Formatter::formatString(gpu.getBusId(), 19, true)
        << Formatter::formatString(gpu.getDisplayActive(), 4, true)
        << Formatter::formatString("|", 2, true) 
        << Formatter::formatString(gpu.getEccStatus(), 21, true) 
        << Formatter::formatString("|", 2, true) 
        << endl;

    // Second linw:
    cout << "|" << Formatter::formatString(gpu.getGpuId(), 4, true) 
        << Formatter::formatString(gpu.getTemperature(), 6, true)
        << Formatter::formatString(gpu.getPerfState(), 6, true)
        << Formatter::formatString(gpu.getPowerUsage(), 16, true)
        << Formatter::formatString("/", 2, true) 
        << Formatter::formatString(gpu.getPowerLimit(), 6, true)
        << Formatter::formatString("|", 2, true) 
        << Formatter::formatString(gpu.getMemoryUsed(), 11, true)
        << Formatter::formatString("/", 2, true) 
        << Formatter::formatString(gpu.getMemoryTotal(), 10, true)
        << Formatter::formatString("|", 2, true) 
        << Formatter::formatString(gpu.getGpuUtilization(), 8, true)
        << Formatter::formatString(gpu.getComputeMode(), 13, true)
        << Formatter::formatString("|", 2, true) 
        << endl;
    // Third line:
    cout << "|" << Formatter::formatString(" ", 40) 
        << Formatter::formatString("|", 2, true) 
        << Formatter::formatString(" ", 23) 
        << Formatter::formatString("|", 2, true) 
        << Formatter::formatString(gpu.getMigMode(), 21, true) 
        << Formatter::formatString("|", 2, true) 
        << endl;

    cout << "+-----------------------------------------------------------------------------------------+" << endl;
    }
   

    void displayProcessHeader() {
        cout << "\n+-----------------------------------------------------------------------------------------+" << endl;
        cout << "| Processes:                                                                              |" << endl;
        cout << "|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |" << endl;
        cout << "|        ID   ID                                                               Usage      |" << endl;
        cout << "|=========================================================================================|" << endl;
    }

    void displayProcessList() {
        for (const auto& process : gpu.getProcesses()) {
            cout << "|" << Formatter::formatString(gpu.getGpuId(), 5, true) 
                << Formatter::formatString(process.getGiIdString(), 6, true) 
                << Formatter::formatString(process.getCiIdString() , 5, true) 
                << Formatter::formatString(process.getPid() , 16, true)
                << Formatter::formatString(process.getType() , 7, true) 
                << setw(35) << Formatter::formatString(process.getName(), 32) 
                << setw(15) << Formatter::formatString(process.getGpuMemoryUsageString(), 10)  
                << "|" << endl;
        }
        cout << "+-----------------------------------------------------------------------------------------+" << endl;
    }
};

int main() {

    GPU gpu(0, "NVIDIA GeForce RTX 3060 Ti", "572.83 ", "12.2", "WDDM","00000000:2B:00.0", "On", 
         std::nullopt, "P5", 45, 220, 320, 2048, 10240, 85, "Default", std::nullopt);
    

    gpu.addProcess(Process(std::nullopt, std::nullopt, 12145, "C+G", "python", std::nullopt));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 23456, "C+G", "jupyter-notebook", 980));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 34567, "C+G", "chrome", 678));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 45678, "C+G", "pytorch_trainer.py", 13200));
    gpu.addProcess(Process(std::nullopt, std::nullopt, 56789, "C+G", "very_long_process_name_that_exceeds_display_width", 998));

    NvidiaDisplay display (gpu);  
    display.display(); 
    return 0;
}