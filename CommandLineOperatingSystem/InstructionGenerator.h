#pragma once
#ifndef INSTRUCTION_GENERATOR_H
#define INSTRUCTION_GENERATOR_H

#include "Instruction.h"
#include <random>
#include <vector>
#include <memory>

#include <cstdint>
#include <sstream>
#include <iomanip>


class InstructionGenerator {
private:
    std::mt19937 rng;
    std::uniform_int_distribution<int> instructionTypeDist;
    std::uniform_int_distribution<uint16_t> valueDist;
    std::uniform_int_distribution<int> sleepDist;
    std::uniform_int_distribution<int> repeatsDist;
    std::uniform_int_distribution<int> forInstructionCountDist;
    std::uniform_int_distribution<uint16_t> addressDist; 

    std::vector<std::string> variableNames = { "x", "y", "z", "a", "b", "c", "counter", "temp", "result", "value" };
    std::uniform_int_distribution<size_t> variableNameDist;

    inline std::shared_ptr<Instruction> generateReadInstruction() {
        std::string var = getRandomVariableName();
        uint16_t addr = (addressDist(rng) / 2) * 2;
        return std::make_shared<ReadInstruction>(var, addr);
    }



    inline std::shared_ptr<Instruction> generateWriteInstruction() {
        std::string var = getRandomVariableName();
        uint16_t addr = (addressDist(rng) / 2) * 2;
        return std::make_shared<WriteInstruction>(addr, var);
    }


public:
    InstructionGenerator()
        : rng(std::random_device{}()),
        instructionTypeDist(0, 7),  // 0=PRINT, 1=DECLARE, 2=ADD, 3=SUBTRACT, 4=SLEEP, 5=FOR READ WRITE NEW
        valueDist(0, 1000),         // Random values 0-1000 for uint16
        sleepDist(1, 10),           // Sleep 1-10 cycles
        repeatsDist(1, 5),          // For loops repeat 1-5 times
        forInstructionCountDist(1, 3), // 1-3 instructions per for loop
        variableNameDist(0, variableNames.size() - 1) {
    }

    std::shared_ptr<Instruction> generateRandomInstruction(const std::string& processName, int nestingLevel = 0) {
        int type = instructionTypeDist(rng);

        // Limit nesting depth for FOR loops (max 3 levels as per spec)
        if (type == 5 && nestingLevel >= 3) {
            type = instructionTypeDist(rng) % 5;  // Choose any other instruction type
        }

        switch (type) {
        case 0: // PRINT
            return generatePrintInstruction(processName);
        case 1: // DECLARE
            return generateDeclareInstruction();
        case 2: // ADD
            return generateAddInstruction();
        case 3: // SUBTRACT
            return generateSubtractInstruction();
        case 4: // SLEEP
            return generateSleepInstruction();
        case 5: // FOR
            return generateForInstruction(processName, nestingLevel + 1);
        case 6: // READ
            return generateReadInstruction();
        case 7: // WRITE
            return generateWriteInstruction();
        default:
            return generatePrintInstruction(processName);
        }
    }

    std::vector<std::shared_ptr<Instruction>> generateInstructionSet(
        const std::string& processName,
        int count,
        uint16_t memorySize)
    {

        // Ensure all READ/WRITE addresses stay within [0, memorySize-1]
        addressDist.param(
            std::uniform_int_distribution<uint16_t>::param_type(
                0,
                memorySize > 1 ? memorySize - 1 : 0
            )
        );


        std::vector<std::shared_ptr<Instruction>> instructions;
        for (int i = 0; i < count; ++i) {
            instructions.push_back(generateRandomInstruction(processName));
        }
        return instructions;
    }

private:
    std::shared_ptr<Instruction> generatePrintInstruction(const std::string& processName) {
        // As per spec: Unless specified in test case, msg should be "Hello world from <process_name>!"
        std::string message = "Hello world from " + processName + "!";

        return std::make_shared<PrintInstruction>(message);


        //// 30% chance to include a variable
        //if (std::uniform_int_distribution<int>(0, 9)(rng) < 3) {
        //    std::string varName = getRandomVariableName();
        //    return std::make_shared<PrintInstruction>("Value from " + processName + ": ", varName);
        //}
        //else {
        //    return std::make_shared<PrintInstruction>(message);
        //}
    }

    std::shared_ptr<Instruction> generateDeclareInstruction() {
        std::string varName = getRandomVariableName();
        uint16_t value = valueDist(rng);
        return std::make_shared<DeclareInstruction>(varName, value);
    }

    std::shared_ptr<Instruction> generateAddInstruction() {
        std::string result = getRandomVariableName();
        std::string op1 = getRandomVariableName();
        std::string op2 = getRandomVariableName();

        // 20% chance to use literal values instead of variables
        bool op1IsLiteral = std::uniform_int_distribution<int>(0, 4)(rng) == 0;
        bool op2IsLiteral = std::uniform_int_distribution<int>(0, 4)(rng) == 0;

        if (op1IsLiteral && op2IsLiteral) {
            return std::make_shared<AddInstruction>(result, valueDist(rng), valueDist(rng));
        }
        else if (op1IsLiteral) {
            return std::make_shared<AddInstruction>(result, valueDist(rng), op2);
        }
        else if (op2IsLiteral) {
            return std::make_shared<AddInstruction>(result, op1, valueDist(rng));
        }
        else {
            return std::make_shared<AddInstruction>(result, op1, op2);
        }
    }

    std::shared_ptr<Instruction> generateSubtractInstruction() {
        std::string result = getRandomVariableName();
        std::string op1 = getRandomVariableName();
        std::string op2 = getRandomVariableName();

        // 20% chance to use literal values instead of variables
        bool op1IsLiteral = std::uniform_int_distribution<int>(0, 4)(rng) == 0;
        bool op2IsLiteral = std::uniform_int_distribution<int>(0, 4)(rng) == 0;

        if (op1IsLiteral && op2IsLiteral) {
            return std::make_shared<SubtractInstruction>(result, valueDist(rng), valueDist(rng));
        }
        else if (op1IsLiteral) {
            return std::make_shared<SubtractInstruction>(result, valueDist(rng), op2);
        }
        else if (op2IsLiteral) {
            return std::make_shared<SubtractInstruction>(result, op1, valueDist(rng));
        }
        else {
            return std::make_shared<SubtractInstruction>(result, op1, op2);
        }
    }

    std::shared_ptr<Instruction> generateSleepInstruction() {
        int tmp = sleepDist(rng);
        uint8_t cycles = static_cast<uint8_t>(tmp);
        return std::make_shared<SleepInstruction>(cycles);
    }

    std::shared_ptr<Instruction> generateForInstruction(const std::string& processName, int nestingLevel) {
        int repeats = repeatsDist(rng);
        int instructionCount = forInstructionCountDist(rng);

        std::vector<std::shared_ptr<Instruction>> forInstructions;
        for (int i = 0; i < instructionCount; i++) {
            forInstructions.push_back(generateRandomInstruction(processName, nestingLevel));
        }

        return std::make_shared<ForInstruction>(forInstructions, repeats);
    }

    std::string getRandomVariableName() {
        return variableNames[variableNameDist(rng)];
    }
};

#endif // INSTRUCTION_GENERATOR_H