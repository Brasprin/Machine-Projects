#pragma once
#include <string>
#include <vector>
#include <mutex>

struct MemoryBlock {
    int start;
    int size;
    bool occupied;
    std::string processName;
};

class MemoryManager {
private:
    int totalMemory;
    int memPerProc;
    std::vector<MemoryBlock> memoryBlocks;
    mutable std::mutex memMutex;

    // Singleton & paging-related
    int frameSizeBytes;
    int totalFrames;
    std::vector<bool> frameInUse;
    std::vector<int> frameOwner;
    std::vector<int>  framePageNum;
    int pageIns = 0;
    int pageOuts = 0;

    const std::string        backingStoreFile = "csopesy-backing-store.txt";

    // nEW

    std::vector<uint64_t> frameLastAccess;  // LRU timestamps
    uint64_t accessCounter = 0;              // Global counter
    int usedMemory = 0;

public:
    MemoryManager(int maxOverallMem, int memPerFrame);

    // Core functions
    bool allocate(const std::string& processName);
    void free(const std::string& processName);
    void reset();
    bool isAllocated(const std::string& processName) const;
    std::vector<MemoryBlock> getBlocksSnapshot() const;
    const std::vector<MemoryBlock>& getBlocks() const;
    int getExternalFragmentation() const;
    int getTotalMemory() const;

    // Paging
    void initialize(int overallMemorySize);
    int  allocatePage(int processId, int pageNum);
    void freeFrames(int processId);
    bool isFrameOccupied(int frameIndex) const;

    // Backing‐store I/O (Phase 1)
    void savePageToBackingStore(int processId, int pageNum);
    void loadPageFromBackingStore(int processId, int pageNum);

    int     getFrameSizeBytes() const;

    int getPageIns() const { return pageIns; }
    int getPageOuts() const { return pageOuts; }
    void setMemPerProc(int size);


};