; Andrei G. Tamse S19

%include "io64.inc"

section .bss
    k resq 1
    firstTerm resq 1
    secondTerm resq 1
    counter resq 1
    numList resq 11
      
    
    
section .text
global main
main:
    mov rbp, rsp; for correct debugging
    
    ; Get inputs
    GET_DEC 8, rax
    MOV [k], rax
    GET_DEC 8, r8
    MOV [firstTerm], r8
    GET_DEC 8, r9
    MOV [secondTerm], r9
    GET_DEC 8, rcx
    MOV [counter], rcx
    
    ; Initialize the numLis
    mov [numList], r8
    mov [numList + 8], r9  
    
    
    mov rbx, 2   ;Starting numListIndex
    
    generate_sequence:
        cmp rbx, [counter]
        je print_loop

        
        xor rsi, rsi           ; Running sum initialize to 0
        mov rdi, rbx           ; Destination ndex position
        
    
        ; Sum the previous term using k as how many terms left
        mov rcx, [k]    
        cmp rcx, rbx
        jle sum_terms
        mov rcx, rbx    ; Update counter to current index for sum terms
 
    sum_terms:
        cmp rcx, 0               ; Check if there are terms to add
        je store_result  
        
        dec rdi                   ; Decrement destination index
        mov rax, [numList + rdi*8] 
        add rsi, rax           
        
        dec rcx                   
        jmp sum_terms             ; Repeat until rcx is zero
        
   
    store_result:
        mov [numList + rbx*8], rsi    ; Store sum using main index rbx
        inc rbx
        jmp generate_sequence

 
    print_loop:
        cmp rcx, [counter] 
        je end_program
        
        mov rax, [numList + rcx*8]
        PRINT_DEC 8, rax
        PRINT_CHAR ' '
        
        inc rcx
        jmp print_loop
        
        
    end_program:
        xor rax, rax
        ret