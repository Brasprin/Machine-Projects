#pragma once

#include "Process.h"

#define BUSY false
#define IDLE true

using namespace std;

class CPU {
private:
	int cpuID;           // id of the CPU
	bool cpuStatus;      // either BUSY or IDLE

public:
	CPU(int cpuID);

	bool runProcess(shared_ptr<Process> process);

	void setStatus(bool cpuStatus);

	bool getStatus();

	int getID() const;
};