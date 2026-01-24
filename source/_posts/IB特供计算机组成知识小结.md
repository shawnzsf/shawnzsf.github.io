---
title: IB计算机组成知识小结
tags: IB Computer Science
abbrlink: 4b4db486
date: 2023-10-26 23:32:46
password: "IsolemnlyswearthatIamuptonogood"
---

<!-- 我对IB计算机课程体系已经失望至极了...整套课程并不注重学生计算机能力的培养，而注重八股文的书写，而我还必须强忍不适把这些nonsense记下。本文主要记录IB Topic 2 Computer Organization所涉及到的“知识内容”。定义全部是IB教材中给出的，请不要在实践中遵守其中的**任何**一条，如有问题概不负责。 -->

# Computer Architecture（话说CA和CO难道不是一个意思吗？）

CPU：Central Processing Unit, data or instructions that are processed by a computer system in the process phase of the input, proces, output and storage model are processed by them.

ALU：Arithmetic Logic Unit, performs all basic arithmetic, logical or input/output operations.

CU：Control Unit, is responsible for the operation of the CPU. It controls the retrieval of instructions from the primary memory as the sequence of their execution. (Or a simpler definition that can help you to get the full score: Getting new instructions and data from memory and provide them to ALU, direct data flow)

MAR：Memory Address Register. Holds the memory address of the data to be used by the ALU, so that the ALU can fetch the corresponding content from the memory and process it accordingly.

MDR：Memory Data Register. Holds the data that is to be used by the ALU and then saved to the RAM.

Address Bus：Connect MAR and RAM.

Data Bus：Connect MDR and RAM.

下图是所谓的CPU架构，记下来然后在考试中画上去。
![Alt text](</img/Screenshot 2023-10-26 234800.png>)

The use of primary memory：The only storage that is directly accessible by the CPU. The primary memory may hold both data and instructions that are currently running on the computer system. D&I stored in primary memory as binary machine code.

RAM：Random Access Memory. General-purpose storage area, data stored can be over-written. Volatile. 

ROM：Read Only Memory. Store data that cannot be over-written. Non-volatile. Store programs and instructions that do not need to be updated or change.

Differences Between RAM and ROM：
- ROM cannot be written to, but RAM can be written to.
- ROM holds the BIOS, but RAM holds the programs running and the data used.
- ROM is much bigger than RAM.
- Volatile/Non-volatile.

Cache：
- Nearer to the CPU than RAM.
- Faster than RAM.
- More expensive than RAM.
- Seperated in L1 and L2.

Machine Instruction Cycle：It is the basic operation cycle of a computer, taking place in a definite time period, during which one instruction is fetched from memory and executed. It typically consists of four stages：fetch, decode, executer and store.

累了，指令执行这块也没什么要多写的，看图即可：
![Alt text](</img/Screenshot 2023-10-27 000238.png>)
# Secondary Memory

Persistent storage(a.k.a. secondary memory/auxiliary storage): relatively slow memory that may be written to but is also non-volatile. The contents of the memory are not wiped if power is lost.

Need for persistent storage: If secondary memory did not exist a computer system would be unable to store instructions and data persistently. Whenever it shut down all the contents of the only existing primary memory would be lost.

Virtual Memory: secondary memory is required to hold information that may not be needed all of the time or may be too large to fit as a whole in primary memory.

The use of virtual memory: Secondary memory allow us to run all these programs confurrently and seamlessly. Since there is not enough space in the primary memory to load the extra program, some other program loaded by the user is copied into secondary memory. Whenever the program that was moved into the secondary memory is needed, some other program in the primary memory is copied to the secondary memory.

Examples of secondary memory: 
- Hard drive(hard disk)
- CD-RW, DVD-RW
- USB Flash drive
- Secure Digital(SD) or Compact Flash(CF) card
- Zip disk
- Floppy disk
- Magnetic tape

Differences between primary and secondary memory:
- Most computers are equipped with a smaller amount of primary memory and a larger amount of secondary memory.
- Primary memory is volatile, which means it does not retain data when the power is turned off.
- Primary memory is more expensive compared to secondary memory.
- Primary memory is much faster than secondary memory.
- Primary memory is directly accessed by the CPU, while secondary memory is not.
- Secondary memory is non-volatile, which means it retains data when the power is turned off.

# Operating and Application Systems

Operating System: a set of software that controls the computer's hardware resources and provides services for computer programs. An intermediary between software applications and the computer hardware.

Main functions of OS: 
- Peripheral communication
- Memory management
- Resource monitoring and multitasking
- Networking
- Disk access and data management
- Security
（极其通俗，不做具体展开）

Application software: preloaded when it is manufactured and complete predefined tasks.
Examples:
- Word processors: production of any sort of document.
- Spreadsheets: organization and analysis of data.
- Database management systems(DBMS): manages(creates, queries, updates stores, modifies, and extracts information) databases and is designed to provide an interface between users and a database.
- Web browsers: used to access, retrieve, and present content on the World Wide Web.
- Email: allows for the exchange of digital messages from a single author to one or more recipients.
- Computer Aided Design(CAD): assists engineers to create, modify, analyze and optimize a design.
- Graphic processing software: allows a user to manipulate visual images on a computer.

Toolbars: GUI element on which buttons, icons, menus, or other input or output elements are placed.
Menus: displays a list of commands that can be chosen by the user to perform various functions.
Dialogue boxes: communicate information to the user and allow him/her to respond by choosing an option from a list of specific choices. 
Graphical User Interfaces(GUI): WIMP, windows, icons, menus, pointers. Interact with computer in a number of ways.
Command Line Interfaces(CLI): Type in commands to interact with the Computer. 
Natural Language Interface(NLIs): User speaks to the interface.
Menu Based Interface(MBIs): Gives user a selection options. 

# Binary Representation

没啥好讲的，记住two's complement是补码，sign-and-magnitude是原码即可。

# Simple Logic Gates

更没啥好讲的了，记住写boolean expression的时候不能写|或者&，要直接写OR或者AND。逻辑门直接画圆即可。