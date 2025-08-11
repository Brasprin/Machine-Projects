#ifndef PROCESS_H
#define PROCESS_H

#include <string>
#include <fstream>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <atomic>
#include <mutex>
#include <memory>
#include <vector>
#include "Instruction.h"


class Process {
private:
    static std::atomic<int> next_process_id;
    static std::mutex id_mutex;
    std::string log_file_path;
    static std::mutex log_mutex;

    bool debug = true;  // toggle debug on/off

    // Instruction-related members
    std::vector<std::shared_ptr<Instruction>> instructions;

    std::unique_ptr<ProcessContext> context;

    int current_instruction;

    // ——— Rolling PRINT/debug buffer ———
    static constexpr size_t MAX_BUFFER_LINES = 10;
    std::vector<std::string> outputBuffer;



public:
    std::string name;
    int total_commands;
    std::atomic<int> executed_commands;
    std::chrono::time_point<std::chrono::system_clock> start_time;
    std::atomic<int> core_id;
    int process_id;
    size_t memory;


    // NEW
    bool crashedDueToViolation = false;
    std::string violationMessage = "";

    Process(const std::string& pname,
        int commands,
        size_t memory,
        MemoryManager* mm);

    Process(const std::string& pname,
        const std::vector<std::shared_ptr<Instruction>>& instrs,
        size_t memory,
        MemoryManager* mm);

    ~Process();

    Process(const Process&) = delete;
    Process& operator=(const Process&) = delete;

    // Original methods
    std::string getFormattedTime() const;
    std::string getStatus() const;
    std::string getName() const;
    void displayProcess() const;
    bool isFinished() const;
    std::string getCoreAssignment() const;

    // Updated execution method
    void executeCommand(int coreId);

    // Instruction-set management
    void setInstructions(const std::vector<std::shared_ptr<Instruction>>& instrs);
    const std::vector<std::shared_ptr<Instruction>>& getInstructions() const {
        return instructions;
    }


    /// Returns the zero-based index of the next instruction to execute. NEW
    int getCurrentInstructionLine() const {
        return current_instruction;
    }





    // Methods for screen command support
    void displayProcessInfo() const;
    void displayProcess(std::ostream& out) const;

    // ——— Rolling buffer API ———
        /// Append one line to our in-memory buffer (auto-trims to last N)
    void addOutput(const std::string& line) {
        outputBuffer.push_back(line);
        if (outputBuffer.size() > MAX_BUFFER_LINES) {
            outputBuffer.erase(outputBuffer.begin());
        }
    }
    /// Get a copy of buffered lines
    std::vector<std::string> getRecentOutputs() const {
        return outputBuffer;
    }
    /// Clear the buffer
    void clearRecentOutputs() {
        outputBuffer.clear();
    }
};

#endif // PROCESS_H
