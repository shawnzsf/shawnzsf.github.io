---
title: 'IB Computer Science topic 6: Resource Management'
tags: Computer Science
password: IsolemnlyswearthatIamuptonogoodness
abbrlink: b9f53da1
date: 2023-11-02 14:14:18
---

## 6.1.1 Critical Sources
System sources include computer harware, software, trained personnel and suppotring infrastructure. And Operating System is usually responsible for the resources management.

Primary memory 
- stores all processed data and instructions and all resulting data. 
- It is directly connected to the processor and feed the processor with required data during the Machine Instruction Cycle.

RAM and Cache memory
- RAM can be overwritten. And there are two types of RAM: static RAM and dynamic RAM. SRAM is a type of semiconductor that holds data while they are powered. Data stores in  DRAM will gradually leaks away, so it needs to be refreshed periodically
- SRAM is more expensive and need more transistors per byte but faster. Both SRAM and DRAM are volatile and used concurrently. DRAM is used in large quantities to store data and SRAM is used in small quantity to enhance performance.
- Level 1 cache is usually built onto the professor while level 2 cache located on a seperated chip placed between the processor and the DRAM

ROM
- Read Only Memory is non-volatile and slower than RAM. It holds critical instructions or programs like BIOS to make sure the PC and be booted successfully. 
- ROM is also built in embedded microprocessors, microcontrollers and control systems.

Secondary Memory
- Refers to hardware that provide data integrity, low cost, mass storage capacity and permanent storage. Some of them use direct access while the other uses squential access
    - Direct access storage techniques
        - Retrieve data without having to read through all previous data.
        - Examples: Floppy disks, CD-ROMS, Hard disks, DVDs, USB sticks.
    - Sequential access storage techniques
        - Having to read sequentially through all previous data to request data.
        - Example: Magnetic tape
            - Ideal for backup purposes.
            - Built-in data encryption, low cost and less energy consumption.
- Processor Speed
    - MIPS(Million instructions Per Second) is used to measuer the performance of a processor, but only an approximation of a processor's performance since it do not consider the situation that some instructions have a higher effectiveness than others.
    - Clock rate refers to the frequency at which the processor is running and used to measure the processor's performance. The unit used is hertz and gigahertz(GHz). But it is also do not accurate because the clock rate of different processor families varies.

BandWidth
- Memory Bandwidth is the rate ar which data can travel from SRAM and DRAM to the processor. Its unit is millions of bits per second or in Mb per second(Mb/s). The peak theoretical bandwidth is not same as the sustained memory bandwidth, which is less and is affected by different designed features.

Screen resolution
- Digital devices have different maximum number of distinct pixels that can be used to display video. Most devices can support a number of different resolutions.

Disk storage
- A general category of metal or plastic storage plates. Current common examples are hard disk drive(HDD), solid state drives(SSD) and solid state hybrid drives(SSHD). 
- SSD is expensive, fast, durable and consume less evergy.
- HDD is cheap, slower, but can cover all storage requirements and cost effective.
- SSHD share the advantages and disadvantages fo HDD and SSD.

Sound processor
- Facilitate the input process and output of audio signals. Commonly integrated onto the motherboard, while some advanced models are sold as seperate cards that use expansion slots of the motherboard.
- Sound processors can convert analog sound to digital files, digital files to analog sound and process multiple audio channels.

Graphics processor
- Massively parallel processors, very efficient at manipulating and processing graphics and images.
- Ideal for running algorithms that require processing of large blocks of graphics data and computer generated imagery.
- Seperated cards that needs expansion or embbeded on the motherboard.

Network connectivity
- A laptop euipped with both a wired Network Interface Card(NIC) and a wireless NIC will perform better than a device only equipped with wireless NIC.
- Modern tablets have SIM(Subscriber Identification Module) to improve its connectivity.

## 6.1.2 Availability of resources

Resources are available in a variety of computer systems.

Mainframes
- used to handle large-bandwidth communication, bulk data processing, enterprise resource planning and large-scale transaction processing.
- Are largest computer systems available an are typically housed in isolated, air-conditional rooms
- Equipped with extremely great processing power, vast amounts of RAM, arrays of disks and backup tapes, and serve hundreds of user terminals.
- Are able to handle high volumes of input and output and run a lot of different applications concurrently.

Supercomputers
- Fast and expensive, and focus on mathematical calculations, modelling, and engineering applications.
- The performance of supercomputers is measured in FLOPS(floating-point operations per second)
- Current supercomputers are considered as massively parallel systems equipped with multiple arrays of computers and processors.

Servers
- A software, hardware, or both and provides various services to clients.
- Client-server model is fundamental in networking and database management.
- Need multiple network connections, lots of RAM, fault tolerance, ability to fix problems without the need of shut down, advanced backup facilities, superior security characteristics and various automation capabilities.

PCs
- Personal Computers are devices that are capable of supporting the computational needs of one user at a time.
- Popular Operating System for PCs are Windows, Mac, or Linux.

Laptops
- An alternative of PCs.
- Have long-lasting batteries that can be used to support hours of computing.

Tablets
- Mobile computer equipped with a touch-screen display which is used as input and output device.
- Popular Operating Systems are iOS, Android and Windows.
- Hybrid tablets have a detachabel keyboard and closely resemble laptops.

PDAs
- Personal digital assistants
- Used as electronic agendas, calanders and personal information systems.

Cell phones
- Cell phones hardware components and software are managed by a moble operating system.
- It combines features of PCs, PDAs, cameras, media players and GPS navigation units.
- Modern smartphones use iOS, Windows and Android OSs. So various developers can develop apps and distribute them online through application stores.

Digital Cameras
- Encodes images and videos digitally and stores them in the attached memory card.
- Support various image formats.
- WIFI connection or HDMI output.