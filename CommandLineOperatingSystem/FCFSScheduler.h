#ifndef FCFSSCHEDULER_H
#define FCFSSCHEDULER_H

#include <memory>
#include <vector>
#include <queue>
#include <mutex>
#include <condition_variable>
#include "Process.h"

//NEW
#include "Scheduler.h"
#include "MemoryManager.h"


class FCFSScheduler: public Scheduler {
private:
    int delayPerExecution;
    const int cores;
    std::atomic<bool> scheduler_running;

    std::vector<std::shared_ptr<Process>> processes;
    std::queue<std::shared_ptr<Process>> ready_queue;

    std::vector<std::thread> cpu_threads;
    mutable std::mutex queue_mutex;
    std::condition_variable cv;

    void cpuWorker(int coreId);

    // New
    MemoryManager* memoryManager = nullptr;

public:
    FCFSScheduler(int cores, int delayPerExecution, MemoryManager* memMgr);
    ~FCFSScheduler();

    void start();
    void stop();
    void addProcess(std::shared_ptr<Process> process);
    void displayProcesses() const;
    void displayProcesses(std::ostream& out) const;
    bool allProcessesFinished() const;

    std::shared_ptr<Process> getProcess(const std::string& name) const override;
};

#endif // FCFSSCHEDULER_H