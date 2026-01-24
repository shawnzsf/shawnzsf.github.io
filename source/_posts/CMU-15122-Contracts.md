---
title: 'CMU 15122: Contracts'
date: 2024-06-27 14:52:18
tags: Course Notes
categories: Computer Science
abbrlink: cmu15122note1
description: Content about general contract design of CMU 15-122 Principle of imeprative computation
---

CMU15122开头部分讲的内容都是关于如何编写Contracts来保证程序的正确性和安全性，以及利用Contract对程序进行验证。本文简单梳理其中引出的概念。

## Contract

c0中有四种Contract：

~~~
- //@requires exp; checked before function execution
- //@ensures exp; checked function returns
- //@assert exp; checked wherever it is
- //@loop_invariant exp; checked before the loop guard
~~~

其中@requires旨在检查函数的precondition是否满足，@ensures旨在检查postcondition是否满足。其中@ensures中可以使用\result来表示函数返回值。@loop_invariant通常检查的是循环中几个变量构成的常量表达式，其在每轮iteration检查循环条件是否满足时被检查，并且只能在循环开头写。@assert即在程序任意位置检查附上表达式的真假。

## Proving Function Correctness

- INITialization：证明loop invariant在进入循环之前满足条件。允许使用循环前的代码以及preconditions进行证明。

- PREServation：证明任意循环后loop invariant的表达式都为真。可以使用循环内部代码，loop invariant(因为INIT已经验证了进入循环时表达式为真，因此可以假设循环开始时为真)，以及loop guard。

- EXIT：证明经过循环postcondition为真。可以使用loop guard，loop invariant以及循环之后的代码进行证明。需要注意的是虽然可使用loop guard以及loop invariant，但无法使用循环内部代码。

- TERMination：证明循环可终止。Operational reasoning(Expression strictly decreases at each iteration of the loop and can never become smaller than the constant)。

### Template

Loop invariant/... on line x (...):
    Assume: 
    To show: 
    A.       by
    B.       by
    C.       by
    D.       by

## Point-to Reasoning

Point-to Reasoning is drawing conclusions about what we know to be true by pointing to specific lines of code that justify them. 

Examples: 
- Boolean conditions
    - condition of an if statement in the “then” branch
    - negation of the condition of an if statement in the “else” branch
    - loop guard inside the body of a loop
    - negation of the loop guard after the loop
- Contract annotations
    - preconditions of the current function
    - postconditions of a function just called
    - loop invariant inside the loop body
    - loop invariant after the loop
    - earlier fully justified assertions
- Math
    - laws of logic
    - some laws of arithmetic
- Value of variables right after an assignment