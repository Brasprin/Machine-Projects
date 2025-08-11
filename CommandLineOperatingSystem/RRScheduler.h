#pragma once

#include <iostream>
#include <thread>
#include <mutex>
#include <atomic>
#include <queue>
#include <condition_variable>
#include <chrono>
#include "Process.h"
#include "Scheduler.h"
#include "MemoryManager.h"

using namespace std;
using namespace chrono;
using namespace this_thread;

class RRScheduler: public Scheduler {
private:
	const int cores;                                  // number of CPUs, constant -> fixed by default
	const int delayPerExecution;
	const int quantum;                                // time quantum, also fixed
	queue<shared_ptr<Process>> readyQueue;            // ready queue (uses shared pointers for Process objects)
	queue<shared_ptr<Process>> tempQueue;
	vector<shared_ptr<Process>> processes;            // ensure you track all procs here
	vector<thread> cpuThreads;                        // container of CPU threads
	mutable mutex queue_mutex;
	condition_variable cv;
	bool verbose = false;
	atomic<bool> scheduler_running;                          // marker for ending threads (atomic, so it's thread-safe)

	void scheduleCPU(int coreId);

	// New
	MemoryManager* memoryManager = nullptr;

public:
	RRScheduler(int cores, int quantum, int delayPerExecution, MemoryManager* memMgr);

	~RRScheduler();

	void enqueueProcess(shared_ptr<Process> process);
	void start();
	void stop();
	void setVerbose(bool v) { verbose = v; }
	void displayProcesses() const;
	void displayProcesses(std::ostream& out) const;
	bool allProcessesFinished() const;

	//new
	std::shared_ptr<Process> getProcess(const std::string& name) const override;

};