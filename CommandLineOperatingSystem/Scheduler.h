#pragma once
#pragma once

#include <memory>
#include <string>
#include "Process.h"

/// Abstract interface: any scheduler that “owns” processes
/// must implement getProcess(name).
class Scheduler {
public:
    virtual ~Scheduler() = default;

    /// Return the shared_ptr for the process named `name`,
    /// or nullptr if not found.
    virtual std::shared_ptr<Process> getProcess(const std::string& name) const = 0;
};
