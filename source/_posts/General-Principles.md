---
title: General Principles
tags: IB Computer Science
abbrlink: 3273f0a5
date: 2023-08-10 15:39:51
---

# Thinking procedurally

## 4.1.1 Procedure appropriate to solving a problem

我们通常需要指定有效的方法或流程来解决某一个特定问题，而解决问题的步骤顺序十分重要。

## 4.1.2 Order of activities and required outcome

活动进行的步骤十分重要。先分析问题再解决问题，先解决而不分析问题本身会导致人力和财力的损失。

## 4.1.3 The role of sub-procedures in solving a problem

解决复杂问题的有效方法之一就是将大问题转化成小问题，因为攻克小问题要比解决大问题更加简单。而拆分出的小问题可以进一步的划分为更小的问题，直到可以被单独解决。这样的策略被叫做自顶向下设计(top-down design)或者逐步细化(stepwise refinement)。

通过自顶向下设计可以将问题细化，而为某一个小问题编写的解决过程就叫做模块化编程(modular programming approach)。

## 4.1.4 Decision-making in a specified situation

分支逻辑，有些代码是顺序执行，而有些代码是对于某些条件进行判断后再进行特定操作。

## 4.1.5 Decisions required for the solution to a specified problem

在真实场景中我们会对多个条件进行判断再采取对应的流程进行应对。

## 4.1.6 Iteration associated with a given decision in a specified problem

迭代(Iteration)是重复一系列指令的过程。在重复算法中的某个部分是十分有用。

## 4.1.7 Decisions and conditional statements

条件语句根据布尔测试返回的值执行相对应的指令。

## 4.1.8 Logical rules for real-world

编程和算法思维将逻辑规则或者推理规则转换为算法，将逻辑与知识结合起来。

# Thinking ahead

## 4.1.9 Inputs and outputs required in a solution

输入是输入到程序中的东西，而输出是程序经过处理后产生的东西。

## 4.1.10 Pre-planning in a suggested problem and solution

预计划(Pre-planning)是提前计划某事的过程。作者举了两个例子来说明，预取(Prefetching)是在实际需要数据或指令之前，将它们从内存中获取到缓存中。当程序请求先前预取的数据时，就可以使用预取的数据并继续执行，而不是等待RAM中的数据。另一个例子时软件库，其中有预先编写好的代码、类组成，程序员可以直接调用而不用重复造轮子。

甘特图(Gantt chart)是一种条形图。用于显示活动，任务和事件。可以清晰地显示每个项目的持续时间，开始时间和结束时间。以此方便任务的并行管理。

## 4.1.11 Need for pre-conditions

前面提到的模块化编程是将某一个复杂问题转换为小问题后再编写算法解决，而将若干个模块拼接起来来解决原始的复杂问题时就需要前置和后置条件来进行管理，表示前一个算法是否结束和下一个算法是否可以开始执行。

## 4.1.12 Pre- amd post-condition

与上一小节想要表达的思想基本相同。

## 4.1.13 Exceptions that need to be considered

异常(Exception)是破坏程序执行预期流程的行为或事件。异常发生在程序执行期间，可以通过大多数现代编程语言提供的特定机制有效地处理。

# Thinking concurrently

## 4.1.14 Parts of a solution that could be implemented concurrently

并发(Concurrent)是指与其他事情同时发生的事情。计算机科学中，并发处理是指多个处理器同时执行不同的指令，以提高性能。

## 4.1.15 Concurrent processing and problem solution

没有并发处理，处理某个任务就会花费更长的时间。

## 4.1.16 Decision to use concurrent processing in solving a problem

并发处理需要更好的资源规划和协调，应当确定并发处理的任务对互相没有影响。

# Thinking abstractly

## 4.1.17 Examples of abstraction

抽象思维(Abstract thinking)是指对事件、观念、属性和关系进行一般性的思考，而不去考虑具体对象的所有不必要的细节，所有不需要实现目标的信息都被删除和忽略。一个经典的抽象例子就是RAM和CPU，从数百万个晶体管的门和集成电路抽象而来。另一个抽象例子就是汇编语言到高级语言的演变。

## 4.1.18 Abstraction and computational solutions for a specified situation

### Object-oriented programming

面向对象编程(Object-oriented programming)使用抽象，并且基于将所有日常任务视为实体的原则。面向对象编程使用描述真实对象的数据(属性)和行为(方法)的编程对象，并促进代码的可重用性和抽象。面向对象编程中我们将现实任务中的某些特征抽象成对象，解决抽象问题，隐藏不必要的细节，只关注对特定实现重要的属性和行为。

### Object manipulation

程序员通过“获取”方法取回某一特定对象的的特定数据。

### Modelling and simulation

数学建模(Mathematical modelling)指的是一个过程，在这个过程中，一个系统背而学家用数学语言来描述它。数学模型是真实系统的抽象，只包含研究真实系统的一个方面所需的细节、规则和对象。数学模型可以转化为算法，然后转化为程序。

## 4.1.19 Abstraction from a specified situation

模块化的程序更容易理解，并且便于抽象的使用，模块化促进了抽象。

## 4.1.20 Real-world and abstraction

以地图为例，不同地图专注于强调的特定主体不同，而选择性忽略了其他方面，这样的方法有助于研究和理解特定的组件和相互作用。