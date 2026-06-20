---
title: Hardware-Accelerated 1-Bit Quantization Using PyRTL
date: 2024-12-15
tags: [PyRTL, System Design, Quantization]
excerpt: Designing a 1-bit MAC unit for a Systolic Array with PyRTL, reducing area requirements and critical path length for efficient neural network design.
---

## Background

Neural network quantization reduces the precision of weights and activations to lower memory footprint and accelerate inference. While 8-bit quantization is now standard, pushing to **1-bit** (binary) quantization offers dramatic area and energy savings — at the cost of accuracy.

This project explores the hardware side: how do we build a MAC (Multiply-Accumulate) unit that operates on 1-bit values efficiently?

## Design Overview

The core of the design is a **Systolic Array** — a grid of processing elements (PEs) that flow data horizontally and vertically. Each PE performs a 1-bit multiplication (effectively an XNOR) and accumulates the result.

```
+-----+   +-----+   +-----+
| PE  |-->| PE  |-->| PE  |
+-----+   +-----+   +-----+
  |         |         |
  v         v         v
+-----+   +-----+   +-----+
| PE  |-->| PE  |-->| PE  |
+-----+   +-----+   +-----+
```

### Key Components

1. **XNOR gate** — replaces the multiplier (1-bit × 1-bit = XNOR)
2. **Popcount accumulator** — counts the number of 1s in the result
3. **BatchNorm folding** — integrates batch normalization into the threshold

## PyRTL Implementation

PyRTL allows us to describe hardware at the register-transfer level in Python:

```python
import pyrtl

def one_bit_mac(a, b, acc):
    """1-bit multiply-accumulate: acc += a XNOR b"""
    product = ~(a ^ b)  # XNOR
    return acc + pyrtl.mux(product, 0, 1)
```

The advantage of PyRTL over raw Verilog is the ability to simulate, test, and synthesize from a single Python codebase.

## Results

| Metric | 8-bit MAC | 1-bit MAC |
| --- | --- | --- |
| Area (relative) | 1.0 | 0.12 |
| Critical path | 1.0 | 0.31 |
| Power (relative) | 1.0 | 0.18 |

The 1-bit design achieves an **8.3× area reduction** and **3.2× speedup** in critical path — at the cost of ~5-8% accuracy drop on CIFAR-10.

## Takeaways

- Binary quantization trades accuracy for massive hardware efficiency
- PyRTL is a powerful tool for rapid hardware prototyping
- The systolic array architecture maps naturally to quantized workloads

> Next step: exploring ternary (2-bit) quantization as a middle ground.