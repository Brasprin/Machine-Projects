#include "MemoryManager.h"
#include <iostream>
#include <fstream>
#include <random>

static MemoryManager* singletonInstance = nullptr;

MemoryManager::MemoryManager(int maxMem, int frameSizeBytes)
    : totalMemory(maxMem),
    frameSizeBytes(frameSizeBytes),
    memPerProc(0)            
{
    // Initialize your contiguous-memory blocks
    memoryBlocks.push_back({ 0, totalMemory, false, "" });

    totalFrames = totalMemory / frameSizeBytes;
    frameInUse.resize(totalFrames, false);
    frameOwner.resize(totalFrames, -1);
    framePageNum.resize(totalFrames, -1);

    frameLastAccess.resize(totalFrames, 0);

    
}



// First-fit memory allocation
bool MemoryManager::allocate(const std::string& processName) {
    std::lock_guard<std::mutex> guard(memMutex);

    for (auto it = memoryBlocks.begin(); it != memoryBlocks.end(); ++it) {
        if (!it->occupied && it->size >= memPerProc) {
            int remaining = it->size - memPerProc;

            // Occupy this block
            it->occupied = true;
            it->size = memPerProc;
            it->processName = processName;

            // Split remaining space into new free block
            if (remaining > 0) {
                memoryBlocks.insert(it + 1, {
                    it->start + memPerProc, remaining, false, ""
                    });
            }
            return true;
        }
    }
    return false; // Not enough space
}

// Free memory used by a process
void MemoryManager::free(const std::string& processName) {
    std::lock_guard<std::mutex> guard(memMutex);

    for (auto& block : memoryBlocks) {
        if (block.occupied && block.processName == processName) {
            block.occupied = false;
            block.processName = "";
        }
    }

    // Merge adjacent free blocks
    for (size_t i = 0; i + 1 < memoryBlocks.size(); ) {
        if (!memoryBlocks[i].occupied && !memoryBlocks[i + 1].occupied) {
            memoryBlocks[i].size += memoryBlocks[i + 1].size;
            memoryBlocks.erase(memoryBlocks.begin() + i + 1);
        }
        else {
            ++i;
        }
    }
}

// Reset all memory blocks to default state
void MemoryManager::reset() {
    std::lock_guard<std::mutex> guard(memMutex);
    memoryBlocks.clear();
    memoryBlocks.push_back({ 0, totalMemory, false, "" });
}

// Check if a process already has memory
bool MemoryManager::isAllocated(const std::string& processName) const {
    std::lock_guard<std::mutex> guard(memMutex);
    for (const auto& block : memoryBlocks) {
        if (block.occupied && block.processName == processName) {
            return true;
        }
    }
    return false;
}

// Snapshot of memory layout
std::vector<MemoryBlock> MemoryManager::getBlocksSnapshot() const {
    std::lock_guard<std::mutex> guard(memMutex);
    return memoryBlocks;
}

// External fragmentation (sum of all free block sizes)
int MemoryManager::getExternalFragmentation() const {
    std::lock_guard<std::mutex> guard(memMutex);
    int sum = 0;
    for (const auto& block : memoryBlocks) {
        if (!block.occupied) sum += block.size;
    }
    return sum;
}

const std::vector<MemoryBlock>& MemoryManager::getBlocks() const {
    return memoryBlocks;
}

int MemoryManager::getTotalMemory() const {
    std::lock_guard<std::mutex> guard(memMutex);
    return totalMemory;
}

// Paging support

void MemoryManager::initialize(int overallMemorySize) {
    std::lock_guard<std::mutex> guard(memMutex);

    // (Existing frame setup…)
    totalFrames = overallMemorySize / frameSizeBytes;
    frameInUse.assign(totalFrames, false);
    frameOwner.assign(totalFrames, -1);
    framePageNum.assign(totalFrames, -1);

    // <<< Add this block >>>
    // Create or truncate the backing-store so it exists for loadPageFromBackingStore
    {
        std::ofstream ofs(backingStoreFile, std::ios::trunc);
        if (!ofs) {
            std::cerr << "Error: could not create backing-store file\n";
        }
        else {
            ofs << "=== EVICTION LOG ===\n";
            ofs << "     PID Page\n";
            ofs << "---------------\n";
        }
        ofs.close(); // Explicitly close the file
    }
}


int MemoryManager::allocatePage(int processId, int pageNum) {
    std::lock_guard<std::mutex> guard(memMutex);

    for (int i = 0; i < totalFrames; ++i) {
        if (!frameInUse[i]) {
           /* std::cerr << "[DEBUG] Free frame found: " << i << std::endl;*/
            frameInUse[i] = true;
            frameOwner[i] = processId;
            framePageNum[i] = pageNum;
            frameLastAccess[i] = ++accessCounter;
            pageIns++;
            return i;
        }
    }

    // No free frames - eviction required
    //std::cerr << "[DEBUG] No free frames! Eviction required!" << std::endl;


    // LRU Victim — must NOT be owned by same process
    int victim = -1;
    uint64_t oldest = std::numeric_limits<uint64_t>::max();
    for (int i = 0; i < totalFrames; ++i) {
        if (frameOwner[i] != processId && frameLastAccess[i] < oldest) {
            oldest = frameLastAccess[i];
            victim = i;
        }
    }

    // If no valid victim, return -1 to signal failure (can't allocate)
    if (victim == -1) {
        return -1;
    }

    int oldOwner = frameOwner[victim];
    int oldPageNum = framePageNum[victim];

  /*  std::cerr << "[DEBUG] Evicting frame " << victim << " owned by process "
        << oldOwner << ", page " << oldPageNum << std::endl;*/

    savePageToBackingStore(oldOwner, oldPageNum);
    pageOuts++;

    frameOwner[victim] = processId;
    framePageNum[victim] = pageNum;

    frameLastAccess[victim] = ++accessCounter;
    pageIns++;
    return victim;
}


void MemoryManager::freeFrames(int processId) {
    std::lock_guard<std::mutex> guard(memMutex);
    for (int i = 0; i < totalFrames; ++i) {
        //std::cerr << "[DEBUG] frame[" << i << "] inUse=" << frameInUse[i]
        //    << " owner=" << frameOwner[i]
        //    << " page=" << framePageNum[i] << "\n";
        if (frameOwner[i] == processId) {
            frameInUse[i] = false;
            frameOwner[i] = -1;
            framePageNum[i] = -1;
        }
    }
}

bool MemoryManager::isFrameOccupied(int frameIndex) const {
    if (frameIndex < 0 || frameIndex >= totalFrames) return false;
    return frameInUse[frameIndex];
}

void MemoryManager::savePageToBackingStore(int processId, int pageNum) {
    // IMMEDIATE LOG to confirm we got here at all
    //std::cerr << "[BackingStore] SAVE called for pid="
    //    << processId << ", page=" << pageNum << "\n";

    std::ofstream ofs(backingStoreFile, std::ios::app);
    if (!ofs.is_open()) {
        std::cerr << "Error: couldn’t open “"
            << backingStoreFile
            << "” for append\n";
        return;
    }

    ofs << "EVICT " << processId << ' ' << pageNum << '\n';
    ofs.flush();
    if (!ofs.good()) {
        std::cerr << "Error: write to backing store failed\n";
    }
}

void MemoryManager::loadPageFromBackingStore(int processId, int pageNum) {
    std::lock_guard<std::mutex> guard(memMutex);

    std::ifstream ifs(backingStoreFile);
    if (!ifs) {
        std::cerr << "Error: could not open backing store for read\n";
        return;
    }

    std::string tag;
    int pid, pg;
    std::streampos lastPos = -1;
    std::string line;
    while (ifs >> tag >> pid >> pg) {
        std::streampos pos = ifs.tellg();
        std::getline(ifs, line);
        if (tag == "EVICT" && pid == processId && pg == pageNum) {
            lastPos = pos;
        }
    }

    // Only if we found at least one eviction record do we “reload”
    if (lastPos != -1) {
        ifs.clear();
        ifs.seekg(lastPos);
        ifs >> tag >> pid >> pg;
        // DEBUG: log only when we actually reload
        std::cerr << "[BackingStore] LOAD called for pid=" 
                  << processId << ", page=" << pageNum << "\n";
        // Here you’d deserialize the real bytes into the frame
    }
    // else: no eviction record—this is first‐time fault, so do nothing
}

int MemoryManager::getFrameSizeBytes() const {
    return frameSizeBytes;
}


void MemoryManager::setMemPerProc(int size) {
    memPerProc = size;
}