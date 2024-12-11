section .data

   

section .text
global asmCalculateDistance


asmCalculateDistance:
    push rsi
    push rbp
    mov rbp, rsp
    add rbp, 16
    
    mov r15,[rbp+40]
    
    .loop:
    test r15, r15
    jz .end
   
    movss xmm0, [rcx]
    movss xmm1, [rdx]
    movss xmm2, [r8]    
    movss xmm3, [r9]
    subss xmm0, xmm1    ; (x1 - x2)
    subss xmm2, xmm3    ; (y1 - y2)
    
    movss xmm1, xmm0
    mulss xmm0, xmm1    ; (x1 - x2)^2
    
    movss xmm3, xmm2
    mulss xmm2, xmm3    ; (y1 - y2)^2
    
    
    addss xmm0, xmm2    ; ((x1 - x2)^2) +((y1 - y2)^2)
    
    sqrtss xmm0, xmm0   ; sqrt(((x1 - x2)^2) +((y1 - y2)^2))
    movss [rcx], xmm0
    
    add rcx,4
    add rdx,4
    add r8,4
    add r9,4

    dec r15
    jmp .loop
    
    
    .end:
        pop rbp
        pop rsi
        xor rax,rax
        ret
        