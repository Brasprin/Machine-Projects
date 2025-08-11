#include "FCFSScheduler.h"
#include <iostream>
#include <chrono>
#include "Header.h"


FCFSScheduler::FCFSScheduler(int cores, int delayPerExecution, MemoryManager* memMgr)
    : cores(cores), delayPerExecution(delayPerExecution), scheduler_running(false), memoryManager(memMgr) {
}

FCFSScheduler::~FCFSScheduler() {
    stop();
}

void FCFSScheduler::start() {
    if (scheduler_running) return;

    scheduler_running = true;
    for (int i = 0; i < cores; ++i) {
        cpu_threads.emplace_back([this, i] { cpuWorker(i); });
    }
}

void FCFSScheduler::stop() {
    scheduler_running = false;
    cv.notify_all();

    for (auto& thread : cpu_threads) {
        if (thread.joinable()) thread.join();
    }
    cpu_threads.clear();
}

void FCFSScheduler::addProcess(std::shared_ptr<Process> process) {
    {
        std::lock_guard<std::mutex> lock(queue_mutex);
        ready_queue.push(process);
    }
    processes.push_back(process);
    cv.notify_one();
}

void FCFSScheduler::cpuWorker(int coreId) {
    while (scheduler_running) {
        std::shared_ptr<Process> process;
        {   // Dequeue (or wait)
            std::unique_lock<std::mutex> lock(queue_mutex);

            if (ready_queue.empty()) {
                cpuIdleTicks++;
                cv.wait_for(lock, std::chrono::milliseconds(delayPerExecution));
                continue;
            }

            if (!scheduler_running) break;

            process = ready_queue.front();
            ready_queue.pop();
        }

        if (!process || process->isFinished()) continue;

        // Only try to allocate once per process
        if (memoryManager && !memoryManager->isAllocated(process->getName())) {
            if (!memoryManager->allocate(process->getName())) {
                // No room—push back to tail and retry later
                std::lock_guard<std::mutex> lock(queue_mutex);
                ready_queue.push(process);
                cv.notify_one();
                continue;
            }
        }

        // Run to completion 
        process->core_id = coreId;
        while (!process->isFinished()) {
            int before = process->executed_commands;
            process->executeCommand(coreId);
            if (process->executed_commands > before) {
                cpuActiveTicks++;  // Only count if actual instruction executed
            }
        }
        process->core_id = -1;

        std::this_thread::sleep_for(std::chrono::milliseconds(delayPerExecution));
        // Free memory when done
        if (memoryManager) {
            memoryManager->free(process->getName());
        }
    }
}


void FCFSScheduler::displayProcesses() const {
    std::lock_guard<std::mutex> lock(queue_mutex);

    std::cout << "Active processes:\n";
    for (const auto& p : processes) {
        if (!p->isFinished()) {
            p->displayProcess();
        }
    }

    std::cout << "Completed processes:\n";
    for (const auto& p : processes) {
        if (p->isFinished()) {
            p->displayProcess();
        }
    }
}

void FCFSScheduler::displayProcesses(std::ostream& out) const {
    std::lock_guard<std::mutex> lock(queue_mutex);

    out << "Active processes:\n";
    for (const auto& p : processes) {
        if (!p->isFinished()) {
            p->displayProcess(out);  // this is the overloaded one
        }
    }

    out << "Completed processes:\n";
    for (const auto& p : processes) {
        if (p->isFinished()) {
            p->displayProcess(out);
        }
    }
}



bool FCFSScheduler::allProcessesFinished() const {
    std::lock_guard<std::mutex> lock(queue_mutex);
    for (const auto& p : processes) {
        if (!p->isFinished()) return false;
    }
    return true;
}

std::shared_ptr<Process> FCFSScheduler::getProcess(const std::string& name) const {
    for (auto& p : processes) {
        if (p->name == name) return p;
    }
    return nullptr;
}