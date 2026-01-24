---
title: Introduction to programming
tags: IB Computer Science
abbrlink: ebcb2642
date: 2023-08-11 15:47:35
---

# Nature of programming languages

## 4.3.1 State the fundamental operations of a computer

计算机的基本操作(包括加，比较，加载和存储)，涉及到了一些指令，但作者没有继续向下讲。

## 4.3.2 Distingguish between fundamental and compound operations of a computer

写了运用上述操作找最大值的一个算法示例。

## 4.3.3 Explain the essential features of a computer language

一门编程语言被描述为它的语义(semantics)的结合，语义指的是语言中可能的每一个结构的含义，而语法则与它的结构有关。语法(grammar)是一种元语言，用于定义语言的语法(syntax)，语句构造的规则称为语法(syntax)。每种高级语言都有独特的语法和特定的关键字。

## 4.3.4 Explain the need for higher level languages

因为计算机只能处理0和1组成的机器语言，所以后续人们开发了助记符(汇编语言)进行编程。因为汇编语言仍然会因为计算机的不同而不同，抽象程度不高，所以人们开发了高级语言。高级语言是一种使用自然语言元素的编程语言，易于使用，通过隐藏计算系统的重要区域来进行抽象，是程序开发更加简单。

## 4.3.5 Outline the need for a translation process from a higher-level leanguage to machine-executable code

现如今使用高级语言实现的程序要想运行在计算机上需要编译(compilation)或者解释(interpretation)。

- Compilation: 编译器(compiler)是只执行一次翻译过程(translation)的翻译器(translator)。通常把整个源程序翻译成目标程序，下次使用目标程序是不需要再重新编译。编译器会对发现的所有语法错误发出错误信息，并在检查整个程序后将所有错误传达给程序员。编译器要比解释器快很多(喜)。

- Interpretation: 解释亲(interpreter)是一个翻译器，解释是指读取源程序的每一行(指令)，对其进行分析，将其翻译成目标程序的相应行，并执行该行的过程。对于每条被解释的指令，语法错误都会被告知程序员。

- JAVA: JAVA将编译和解释结合起来。首先将源代码编译成JAVA虚拟机字节码。也就是将.java文件转换为.class文件。这个JAVA虚拟机字节码可以被JAVA虚拟机解释器解释。JAVA这样的编译和解释过程允许代码在安装了JAVA虚拟机解释器的任何机器上运行。JAVA代码在特定硬件平台上运行的所有细节都由JAVA虚拟机(JVM)处理。

# Use of programming languages

## 4.3.6 Variable, constant, operator, object

- 变量(variable)：用于存储程序的数据元素。存储的值可以在程序执行期间更改。变量有名称(或标识符)和类型。变量名不应与语言的保留关键字和字面值冲突。变量的类型可以是整数、双精度、字符串等。在大多数编程语言中，变量只能存储特定类型的数据元素。

- 常数(constant)：常数代表不变的事物和数量。它们可以被视为不可修改的变量。存储在常量中的数据元素不能在程序执行期间被修改。

- 操作符(operator)：操作符用于操作操作数。操作数可以是变量、文字、布尔值、数值等。运算符可以是算术、关系和逻辑等。

- 对象(object)：对象是由数据和操作组成的。动作是指对象可以执行的操作。对象数据可以包括许多数据成员，而操作也可以成为方法。数据成员用于存储对象的当前状态，方法用于更改或访问这些数据成员。

## 4.3.7 Define various operators

=: 等于; !=: 不等于;
>: 大于; >=: 大于等于; <: 小于; <=: 小于等于;
div: 取整; mod: 取余；

## 4.3.8 Analyse the use of variables, constants and operators in algorithms

### Local and global value

全局变量对程序的所有部分可见，而局部变量的作用域有限。

## 4.3.9 Develop algorithms using loops, branching

给了一个算闰年的Java程序。

## 4.3.10 Describe the characteristics and applications of a collection

集合由零个或多个元素组成。允许重复元素，并且可以包含有序和无序的数据元素。集合的重要操作有添加、删除等。每种类型的集合都配备了自己特定的操作。特定集合的元素通都是相同类型并表示一个实体。

## 4.3.11 Develop algorithms using the access methods of a collection

三个例子。

## 4.3.12 Discuss the importance of sub-programmes and collections within programmed solutions

子程序是包含执行特定和预定义任务的计算机指令序列的单元。(编写函数)

使用子程序的优点：
- 复杂分成简单
- 将问题分布到全世界
- 允许代码重用
- 隐藏实现细节，提高抽象程度
- 提高可维护性
- 减少代码重复

使用集合的好处：
- 集合可以直接进行操作
- 提高性能
- 重用更多代码

## 4.3.13 Construct algorithms using pre-defined sub-programmes, one-dimensional arrays and/or collections

不同的高级语言使用过程、子过程、函数、例程、方法、模块等术语指代子程序。子程序包含的单元可以在各种计算机程序中使用。后跟一堆例子。