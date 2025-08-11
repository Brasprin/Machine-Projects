#include "CPUWorker.h"

// CPU Class Constructor: Initializes the CPU ID, and sets CPU initially as `IDLE`
CPU::CPU(int cpuID) : cpuID(cpuID), cpuStatus(IDLE) {}

// Execute a process object in the CPU (see Process class); will decrement process burst time -1
bool CPU::runProcess(shared_ptr<Process> process) {
	process->executeCommand(this->cpuID); // this decrements total burst time of the process -1

	return process->isFinished(); // if finished (executed commands = total commands) then returns true. false if otherwise
}

// Set the status of the CPU (either IDLE or BUSY)
void CPU::setStatus(bool cpuStatus) {
	this->cpuStatus = cpuStatus;
}

// Get the status of the CPU
bool CPU::getStatus() {
	return this->cpuStatus;
}

// Get the CPU ID
int CPU::getID() const {
	return this->cpuID;
}