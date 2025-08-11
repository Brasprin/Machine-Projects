#include "Process.h"
#include "InstructionGenerator.h"
#include <iostream>
#include <vector>
#include "MemoryManager.h"

using namespace std;
using namespace std::chrono;

// Initialize static members
atomic<int> Process::next_process_id = 0;
mutex Process::id_mutex;
mutex Process::log_mutex;


// In Process.cpp

Process::Process(const std::string& pname,
    int commands,
    size_t memory,
    MemoryManager* mm)
    : name(pname), total_commands(commands), executed_commands(0),
    core_id(-1), memory(memory), start_time(system_clock::now()),
    current_instruction(0)
{
    lock_guard<mutex> lock(id_mutex);
    process_id = next_process_id++;

    context = make_unique<ProcessContext>(pname, process_id, mm);
    context->setMemorySize(memory);

    InstructionGenerator generator;
    instructions = generator.generateInstructionSet(
        pname, commands, static_cast<uint16_t>(memory)
    );

    log_file_path = "processesLogs/" + name + ".txt";
    ofstream log_file(log_file_path, ios::out | ios::trunc);
    if (log_file) {
        log_file << "Process: " << name << "\nLogs:\nInstructions to execute:\n";
        for (size_t i = 0; i < instructions.size(); ++i) {
            log_file << "[" << i << "] " << instructions[i]->toString() << "\n";
        }
        log_file << "Execution log:\n";
    }
}

// Constructor with provided instructions
Process::Process(const std::string& pname,
    const vector<shared_ptr<Instruction>>& instrs,
    size_t memory,
    MemoryManager* mm)
    : name(pname), total_commands((int)instrs.size()), executed_commands(0),
    core_id(-1), memory(memory), start_time(system_clock::now()),
    current_instruction(0), instructions(instrs)
{
    lock_guard<mutex> lock(id_mutex);
    process_id = next_process_id++;

    context = make_unique<ProcessContext>(pname, process_id, mm);
    context->setMemorySize(memory);

    log_file_path = "processesLogs/" + name + ".txt";
    ofstream log_file(log_file_path, ios::out | ios::trunc);
    if (log_file) {
        log_file << "Process: " << name << "\nLogs:\nInstructions to execute:\n";
        for (size_t i = 0; i < instructions.size(); ++i) {
            log_file << "[" << i << "] " << instructions[i]->toString() << "\n";
        }
        log_file << "Execution log:\n";
    }
}


Process::~Process() {
    if (context) {
        auto* mm = context->getMemoryManager();
        if (mm) mm->freeFrames(process_id);
    }
}

string Process::getFormattedTime() const {
    time_t st = system_clock::to_time_t(start_time);
    struct tm timeinfo;
    localtime_s(&timeinfo, &st);
    stringstream ss;
    ss << put_time(&timeinfo, "%m/%d/%Y %I:%M:%S %p");
    return ss.str();
}

std::string Process::getStatus() const {
    if (crashedDueToViolation) {
        return "Terminated";
    }
    if (executed_commands.load() == total_commands) {
        return "Finished";
    }

    return getCoreAssignment();
}
std::string Process::getName() const {
    return name;
}


void Process::displayProcess(std::ostream& out) const {
    int exec = executed_commands.load();
    int total = total_commands;
    std::string status = getStatus();
    std::string coreInfo = (status != "Finished") ? " (Core " + std::to_string(core_id.load()) + ")" : "";

    out << std::left << std::setw(10) << name
        << std::setw(25) << ("(" + getFormattedTime() + ")")
        << std::setw(15) << status
        << std::setw(15) << (std::to_string(exec) + "/" + std::to_string(total))
        << std::setw(10) << ("[" + std::to_string(memory) + " B]")
        << coreInfo
        << "\n";
}

void Process::displayProcess() const {
    displayProcess(std::cout);
}

void Process::executeCommand(int coreId) {
    if (isFinished()) return;

    core_id = coreId;
    context->incrementCycle();

    auto now = system_clock::now();
    time_t t = system_clock::to_time_t(now);
    tm timeinfo;
    localtime_s(&timeinfo, &t);

    lock_guard<mutex> lock(log_mutex);
    ofstream log_file(log_file_path, ios::app);

    if (!log_file) {
        cerr << "Failed to open log file: " << log_file_path << "\n";
        return;
    }

    if (context->isSleeping()) {
        context->decrementSleep();
        log_file << "(" << put_time(&timeinfo, "%m/%d/%Y %I:%M:%S %p") << ") "
            << "Core:" << coreId << " Process sleeping...\n";
        return;
    }

    if (current_instruction < instructions.size()) {
        bool done = false;

        try {
            done = instructions[current_instruction]->execute(*context);
        }
        catch (const runtime_error& ex) {
            ostringstream ts;
            ts << put_time(&timeinfo, "%m/%d/%Y %I:%M:%S %p");
            violationMessage = "Process " + name + " shut down due to memory access violation error at "
                + ts.str() + ". " + ex.what() + " invalid.";
            crashedDueToViolation = true;

            log_file << violationMessage << "\n";
            addOutput("\033[31m" + violationMessage + "\033[0m");
            current_instruction = (int)instructions.size();
            return;
        }
        std::ostringstream screenLog;
        screenLog << "(" << put_time(&timeinfo, "%m/%d/%Y %I:%M:%S %p") << ") Core:" << coreId
            << " Executing: " << instructions[current_instruction]->toString();
        addOutput(screenLog.str());

        for (const auto& msg : context->getOutputBuffer()) {
            log_file << "    Output: \"" << msg << "\"\n";
            addOutput(msg);
        }
        context->clearOutputBuffer();

        if (done) {
            executed_commands++;
            current_instruction++;
        }
    }
} // log_file closes here



bool Process::isFinished() const {
    return current_instruction >= instructions.size() && !context->isSleeping();
}

string Process::getCoreAssignment() const {
    int core = core_id.load();
    if (core >= 0) {
        return "Core " + to_string(core);
    }
    return "Not assigned";
}

void Process::setInstructions(const std::vector<std::shared_ptr<Instruction>>& instrs) {
    instructions = instrs;
    total_commands = static_cast<int>(instrs.size());
    current_instruction = 0;
    executed_commands = 0;
}

void Process::displayProcessInfo() const {
    cout << "Process: " << name << endl;
    cout << "ID: " << process_id << endl;
    cout << "Memory: " << memory << " bytes" << endl;
    cout << "Current instruction line: " << current_instruction << endl;
    cout << "Lines of code: " << total_commands << endl;

    if (isFinished()) {
        if (crashedDueToViolation) {
            cout << "Status: Terminated (Memory Access Violation)" << endl;
        }
        else {
            cout << "Status: Finished" << endl;
        }
    }
    else {
        cout << "Status: " << getStatus() << endl;

        if (current_instruction < instructions.size()) {
            cout << "Current instruction: " << instructions[current_instruction]->toString() << endl;
        }
    }
    cout << endl;
}
