
## Author
BALDEROSA, CHAN, RAMOS, TAMSE

## Overview
A console-based OS emulator that demonstrates:
- **Command recognition** (`initialize`, `scheduler-start/stop`, `screen`, `report-util`, `exit`, `clear`)
- **Console UI** with ASCII header and redraw
- **Command interpreter** with error messages on invalid input
- **Process representation** (PID, state, PC, memory map, log buffer)
- **Scheduling algorithms**: FCFS and Round-Robin

## Entry Point
- **File:** `src/main.cpp`  
- **Function:** `int main(int argc, char** argv)`

## Prerequisites
- A C++17-capable compiler:
  - **Linux / WSL / MSYS2:** `g++` (with `-pthread`)
  - **Windows:** Visual Studio 2019+ (MSVC)
- A terminal or console window

## Building & Running
In your README (or demo script), you can describe the VS 2022 steps like this:

---

### Building & Running in Visual Studio 2022

1. **Open the solution**
   In File Explorer after gettting the code either by download the zip or using git desktop, double-click **MO1-IRISH.sln**. This will launch Visual Studio 2022 with the project loaded.

2. **Select your configuration**
   At the top toolbar, set the dropdowns to **Debug** and **x64**.

3. **Build & run**
   Click the green ▶ **Local Windows Debugger** button (or press **F5**) in the toolbar:

     This will compile the code, launch the emulator in the integrated console, and attach the debugger so you can interact with the program immediately.




