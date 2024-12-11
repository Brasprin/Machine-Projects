nasm -f win64 MP2A.asm
gcc -c MP2C.c -o MP2C.obj -m64
gcc MP2C.obj MP2A.obj -o run.exe -m64
run