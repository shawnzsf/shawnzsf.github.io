---
title: Building a Simplified RV32I Emulator in C
date: 2024-08-22
tags: [C, RISC-V, Emulation]
excerpt: Exploring computer architecture by building a simplified RV32I emulator in C — decoding instructions, implementing the execution loop, and understanding the RISC-V ISA.
---

## Why Build an Emulator?

There's no better way to understand an instruction set architecture than to implement it yourself. During the Yishengyizhen Program at the Chinese Academy of Sciences, I built a simplified RV32I emulator in C to solidify my understanding of the RISC-V ISA.

## The RV32I Base Integer Instruction Set

RV32I is the 32-bit base integer instruction set for RISC-V. It has 47 instructions organized into several categories:

- **R-type**: register-register operations (`add`, `sub`, `and`, `or`)
- **I-type**: immediate operations (`addi`, `andi`)
- **S-type**: store operations (`sw`, `sh`, `sb`)
- **B-type**: branch operations (`beq`, `bne`, `blt`)
- **U-type**: upper immediate operations (`lui`, `auipc`)
- **J-type**: jump operations (`jal`, `jalr`)

## Instruction Decoding

Each instruction is 32 bits. The opcode lives in bits [6:0], and the rest of the bits encode operands depending on the type:

```c
typedef struct {
    uint32_t opcode;
    uint32_t rd;
    uint32_t funct3;
    uint32_t rs1;
    uint32_t rs2;
    uint32_t funct7;
    int32_t imm;
} Instruction;

Instruction decode(uint32_t raw) {
    Instruction inst;
    inst.opcode = raw & 0x7f;
    inst.rd = (raw >> 7) & 0x1f;
    inst.funct3 = (raw >> 12) & 0x7;
    inst.rs1 = (raw >> 15) & 0x1f;
    inst.rs2 = (raw >> 20) & 0x1f;
    inst.funct7 = (raw >> 25) & 0x7f;
    // immediate sign-extension depends on type
    return inst;
}
```

## The Execution Loop

The core of the emulator is a fetch-decode-execute cycle:

```c
void run(CPU *cpu) {
    while (1) {
        uint32_t raw = fetch(cpu);
        Instruction inst = decode(raw);
        execute(cpu, inst);
        cpu->pc += 4;  // advance to next instruction
    }
}
```

### Implementing `add`

As a concrete example, the `add` instruction (R-type, opcode `0x33`, funct3 `0x0`, funct7 `0x00`):

```c
case 0x33:  // R-type
    switch (inst.funct3) {
        case 0x0:
            if (inst.funct7 == 0x00)
                cpu->regs[inst.rd] = cpu->regs[inst.rs1] + cpu->regs[inst.rs2];
            else if (inst.funct7 == 0x20)
                cpu->regs[inst.rd] = cpu->regs[inst.rs1] - cpu->regs[inst.rs2];
            break;
        // ... more funct3 cases
    }
    break;
```

## Lessons Learned

1. **Sign extension is tricky** — getting the immediate decoding right took several iterations
2. **Register x0 is hardwired zero** — every write to x0 must be silently ignored
3. **Memory alignment matters** — RISC-V has alignment requirements for word/halfword access
4. **Branches are relative** — branch targets are PC-relative, not absolute

## What's Next

The base integer set is just the beginning. Future extensions to explore:

- **M extension**: multiplication and division
- **F/D extensions**: floating-point arithmetic
- **A extension**: atomic memory operations
- **C extension**: compressed 16-bit instructions

> Building this emulator gave me a much deeper appreciation for the elegance of the RISC-V design philosophy — simplicity as a feature.