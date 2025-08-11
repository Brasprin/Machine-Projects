#pragma once
#ifndef INSTRUCTION_H
#define INSTRUCTION_H

#include <string>
#include <memory>
#include <unordered_map>
#include <vector>
#include <cstdint>
#include <unordered_set>
#include <sstream>
#include <iostream>

#include "MemoryManager.h" 

// Forward declaration
class ProcessContext;

// Base instruction interface
class Instruction {
public:
    virtual ~Instruction() = default;
    virtual bool execute(ProcessContext& context) = 0;  // Returns true if instruction completed
    virtual std::string toString() const = 0;
    virtual int getExecutionCycles() const { return 1; }  // Default: 1 cycle per instruction
};

// Process context to hold variables and state
class ProcessContext {
private:
    std::unordered_map<std::string, uint16_t> variables;
    std::string processName;
    int currentCycle;
    int sleepCycles;
    std::vector<std::string> outputBuffer;  // To store PRINT outputs

    // NEW
    size_t memorySize = 4096;  // default, but will be overwritten

    std::unordered_map<uint16_t, uint16_t> pageTable;  // key: page number, value: frame number
    std::unordered_set<uint16_t> allocatedPages;       // which pages are currently loaded

    int processId = -1;
    MemoryManager* memoryManager = nullptr;

    static constexpr size_t SYMBOL_TABLE_BYTES = 64;
    static constexpr size_t VAR_SIZE_BYTES = sizeof(uint16_t);           // 2 bytes
    static constexpr size_t MAX_SYMBOL_VARS = SYMBOL_TABLE_BYTES / VAR_SIZE_BYTES; // 32

    size_t symbolVarCount = 0;  // how many distinct vars declared so far
public:
    ProcessContext(const std::string& name, int pid, MemoryManager* mm)
        : processName(name), processId(pid), memoryManager(mm),
        currentCycle(0), sleepCycles(0) {
    }

    // NEW – enforces 32-variable (64 B) cap
    uint16_t getVariable(const std::string& name) {
        auto it = variables.find(name);
        if (it != variables.end()) {
            return it->second;
        }
        // Implicit DECLARE via READ only if under cap
        if (symbolVarCount < MAX_SYMBOL_VARS) {
            variables[name] = 0;
            ++symbolVarCount;
            return 0;
        }
        // Cap reached: return 0 without declaring new var
        return 0;
    }


    void setVariable(const std::string& name, uint16_t value) {
        auto it = variables.find(name);
        if (it != variables.end()) {
            // Overwrite existing variable
            it->second = value;
        }
        else if (symbolVarCount < MAX_SYMBOL_VARS) {
            // New var under cap
            variables[name] = value;
            ++symbolVarCount;
        }
        // Else: cap reached → silently ignore new declaration
    }

    // Sleep management
    void setSleep(int cycles) { sleepCycles = cycles; }
    bool isSleeping() const { return sleepCycles > 0; }
    void decrementSleep() { if (sleepCycles > 0) sleepCycles--; }

    // Output management
    void addOutput(const std::string& output) { outputBuffer.push_back(output); }
    const std::vector<std::string>& getOutputBuffer() const { return outputBuffer; }
    void clearOutputBuffer() { outputBuffer.clear(); }

    // Getters
    const std::string& getProcessName() const { return processName; }
    int getCurrentCycle() const { return currentCycle; }
    void incrementCycle() { currentCycle++; }

    // NEW

    void setMemorySize(size_t size) { memorySize = size; }

    void writeMemory(uint16_t address, uint16_t value) {
        if (static_cast<size_t>(address) >= memorySize)
            throw std::runtime_error("ACCESS_VIOLATION at 0x" + int_to_hex(address));


        uint16_t page = address / memoryManager->getFrameSizeBytes();

        // 2) On a page fault...
        if (!isPageAllocated(page)) {
            // 2a) Try to reload any previously‐evicted content
            memoryManager->loadPageFromBackingStore(processId, page);

            // 2b) Allocate a physical frame 
            int frame = memoryManager->allocatePage(processId, page);
            if (frame == -1)
                throw std::runtime_error("ACCESS_VIOLATION at 0x" + int_to_hex(address));

            mapPageToFrame(page, frame);
        }

        //std::cerr << "[DEBUG] Writing " << value << " to address 0x"
        //    << std::hex << address << std::endl;


        // 3) Now “store” the value in your simulated memory (stubbed for now)
    }

    uint16_t readMemory(uint16_t address) {
        // 0) Bounds‐check
        if (static_cast<size_t>(address) >= memorySize)
            throw std::runtime_error("ACCESS_VIOLATION at 0x" + int_to_hex(address));

        // 1) Compute page number
        uint16_t page = address / memoryManager->getFrameSizeBytes();  // swap out 16→frameSizeBytes later

        // 2) Page‐fault handling
        if (!isPageAllocated(page)) {
            // 2a) Reload from backing store if available
            memoryManager->loadPageFromBackingStore(processId, page);

            // 2b) Allocate a frame (evicts someone else via savePageToBackingStore)
            int frame = memoryManager->allocatePage(processId, page);
            if (frame == -1)
                throw std::runtime_error("ACCESS_VIOLATION at 0x" + int_to_hex(address));

            // 2c) Map it
            mapPageToFrame(page, frame);
        }

        // 3) “Read” the value (stubbed to return 0)
        return 0;
    }

    std::string int_to_hex(uint16_t address) {
        std::stringstream ss;
        ss << std::hex << std::uppercase << address;
        return ss.str();
    }

    bool isPageAllocated(uint16_t pageNumber) const {
        return allocatedPages.count(pageNumber) > 0;
    }

    void mapPageToFrame(uint16_t pageNumber, uint16_t frameNumber) {
        pageTable[pageNumber] = frameNumber;
        allocatedPages.insert(pageNumber);
    }

    int getMappedFrame(uint16_t pageNumber) const {
        auto it = pageTable.find(pageNumber);
        if (it != pageTable.end()) return it->second;
        return -1; // Not mapped
    }

    void reset() {
        currentCycle = 0;
        sleepCycles = 0;
        outputBuffer.clear();
        variables.clear();
        pageTable.clear();
        allocatedPages.clear();
    }

    MemoryManager* getMemoryManager() const {
        return memoryManager;
    }

};

// PRINT instruction
class PrintInstruction : public Instruction {
private:
    std::string message;
    std::string variable;  // Optional variable to print
    bool hasVariable;

public:
    PrintInstruction(const std::string& msg) : message(msg), hasVariable(false) {}
    PrintInstruction(const std::string& msg, const std::string& var)
        : message(msg), variable(var), hasVariable(true) {
    }

    bool execute(ProcessContext& context) override {
        std::string output;
        if (hasVariable) {
            uint16_t value = context.getVariable(variable);
            output = message + std::to_string(value);
        }
        else {
            output = message;
        }
        context.addOutput(output);
        return true;  // Always completes in one cycle
    }

    std::string toString() const override {
        if (hasVariable) {
            return "PRINT(\"" + message + "\" + " + variable + ")";
        }
        return "PRINT(\"" + message + "\")";
    }
};

// DECLARE instruction
class DeclareInstruction : public Instruction {
private:
    std::string variableName;
    uint16_t value;

public:
    DeclareInstruction(const std::string& var, uint16_t val)
        : variableName(var), value(val) {
    }

    bool execute(ProcessContext& context) override {
        context.setVariable(variableName, value);
        return true;
    }

    std::string toString() const override {
        return "DECLARE(" + variableName + ", " + std::to_string(value) + ")";
    }
};

// ADD instruction
class AddInstruction : public Instruction {
private:
    std::string result;
    std::string operand1;
    std::string operand2;
    bool op1IsValue;
    bool op2IsValue;
    uint16_t op1Value;
    uint16_t op2Value;

public:
    AddInstruction(const std::string& res, const std::string& op1, const std::string& op2)
        : result(res), operand1(op1), operand2(op2), op1IsValue(false), op2IsValue(false) {
    }

    AddInstruction(const std::string& res, const std::string& op1, uint16_t op2)
        : result(res), operand1(op1), op2Value(op2), op1IsValue(false), op2IsValue(true) {
    }

    AddInstruction(const std::string& res, uint16_t op1, const std::string& op2)
        : result(res), operand2(op2), op1Value(op1), op1IsValue(true), op2IsValue(false) {
    }

    AddInstruction(const std::string& res, uint16_t op1, uint16_t op2)
        : result(res), op1Value(op1), op2Value(op2), op1IsValue(true), op2IsValue(true) {
    }

    bool execute(ProcessContext& context) override {
        uint16_t val1 = op1IsValue ? op1Value : context.getVariable(operand1);
        uint16_t val2 = op2IsValue ? op2Value : context.getVariable(operand2);

        // Perform addition with overflow protection
        uint32_t sum = static_cast<uint32_t>(val1) + static_cast<uint32_t>(val2);
        uint16_t resultValue = (sum > UINT16_MAX) ? UINT16_MAX : static_cast<uint16_t>(sum);

        context.setVariable(result, resultValue);

        // NEW: Log to output
        std::stringstream ss;
        ss << "[ADD] " << result << " = " << val1 << " + " << val2 << " = " << resultValue;
        context.addOutput(ss.str());
        return true;
    }

    std::string toString() const override {
        std::string op1Str = op1IsValue ? std::to_string(op1Value) : operand1;
        std::string op2Str = op2IsValue ? std::to_string(op2Value) : operand2;
        return "ADD(" + result + ", " + op1Str + ", " + op2Str + ")";
    }
};

// SUBTRACT instruction
class SubtractInstruction : public Instruction {
private:
    std::string result;
    std::string operand1;
    std::string operand2;
    bool op1IsValue;
    bool op2IsValue;
    uint16_t op1Value;
    uint16_t op2Value;

public:
    SubtractInstruction(const std::string& res, const std::string& op1, const std::string& op2)
        : result(res), operand1(op1), operand2(op2), op1IsValue(false), op2IsValue(false) {
    }

    SubtractInstruction(const std::string& res, const std::string& op1, uint16_t op2)
        : result(res), operand1(op1), op2Value(op2), op1IsValue(false), op2IsValue(true) {
    }

    SubtractInstruction(const std::string& res, uint16_t op1, const std::string& op2)
        : result(res), operand2(op2), op1Value(op1), op1IsValue(true), op2IsValue(false) {
    }

    SubtractInstruction(const std::string& res, uint16_t op1, uint16_t op2)
        : result(res), op1Value(op1), op2Value(op2), op1IsValue(true), op2IsValue(true) {
    }

    bool execute(ProcessContext& context) override {
        uint16_t val1 = op1IsValue ? op1Value : context.getVariable(operand1);
        uint16_t val2 = op2IsValue ? op2Value : context.getVariable(operand2);

        // Perform subtraction with underflow protection (clamp to 0)
        uint16_t resultValue = (val1 >= val2) ? (val1 - val2) : 0;

        context.setVariable(result, resultValue);

        // NEW: Log to output
        std::stringstream ss;
        ss << "[SUB] " << result << " = " << val1 << " - " << val2 << " = " << resultValue;
        context.addOutput(ss.str());
        return true;
    }

    std::string toString() const override {
        std::string op1Str = op1IsValue ? std::to_string(op1Value) : operand1;
        std::string op2Str = op2IsValue ? std::to_string(op2Value) : operand2;
        return "SUBTRACT(" + result + ", " + op1Str + ", " + op2Str + ")";
    }
};

// SLEEP instruction
class SleepInstruction : public Instruction {
private:
    uint8_t cycles;

public:
    SleepInstruction(uint8_t c) : cycles(c) {}

    bool execute(ProcessContext& context) override {
        context.setSleep(cycles);
        return true;  // Sleep instruction itself completes immediately
    }

    std::string toString() const override {
        return "SLEEP(" + std::to_string(cycles) + ")";
    }

    int getExecutionCycles() const override { return cycles; }
};

// FOR instruction
class ForInstruction : public Instruction {
private:
    std::vector<std::shared_ptr<Instruction>> instructions;
    int repeats;
    mutable int currentIteration;
    mutable int currentInstructionIndex;

public:
    ForInstruction(const std::vector<std::shared_ptr<Instruction>>& instrs, int reps)
        : instructions(instrs), repeats(reps), currentIteration(0), currentInstructionIndex(0) {
    }

    bool execute(ProcessContext& context) override {
        if (currentIteration >= repeats) {
            return true;  // For loop completed
        }

        if (currentInstructionIndex >= instructions.size()) {
            // Finished current iteration
            currentIteration++;
            currentInstructionIndex = 0;

            if (currentIteration >= repeats) {
                return true;  // All iterations complete
            }
        }

        // Execute current instruction
        if (currentInstructionIndex < instructions.size()) {
            bool instructionComplete = instructions[currentInstructionIndex]->execute(context);
            if (instructionComplete) {
                currentInstructionIndex++;
            }
        }

        return false;  // For loop not yet complete
    }

    std::string toString() const override {
        return "FOR([" + std::to_string(instructions.size()) + " instructions], " + std::to_string(repeats) + ")";
    }
};

// NEW

// WRITE(address, variable)
class WriteInstruction : public Instruction {
private:
    uint16_t address;
    std::string variable;

public:
    WriteInstruction(uint16_t addr, const std::string& var)
        : address(addr), variable(var) {
    }

    bool execute(ProcessContext& context) override {
        uint16_t value = context.getVariable(variable);
        context.writeMemory(address, value);
        return true;
    }

    std::string toString() const override {
        std::stringstream ss;
        ss << "WRITE(0x" << std::hex << address << ", " << variable << ")";
        return ss.str();
    }
};

// READ(variable, address)
class ReadInstruction : public Instruction {
private:
    std::string variable;
    uint16_t address;

public:
    ReadInstruction(const std::string& var, uint16_t addr)
        : variable(var), address(addr) {
    }

    bool execute(ProcessContext& context) override {
        uint16_t value = context.readMemory(address);
        context.setVariable(variable, value);
        return true;
    }

    std::string toString() const override {
        std::stringstream ss;
        ss << "READ(" << variable << ", 0x" << std::hex << address << ")";
        return ss.str();
    }
};
#endif // INSTRUCTION_H