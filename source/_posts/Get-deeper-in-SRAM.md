---
title: Get deeper in SRAM
tags: Wrap-up post
categories: Computer Science
abbrlink: 5a6cf88d
date: 2023-08-03 22:14:41
---

## Theory

RAM(Random Access Memory)具有如下两个特点：
- 易变，断电时易失数据。
- 读写行为快，速度与数据存储位置无关。

RAM又有如下两个分类：
- DRAM (Dynamic Random Access Memory)
- SRAM (Static Random Access Memory)

DRAM由一个电容器(capacitor)和一个晶体管(transistor)构成。因为电容器的缺陷，DRAM经常需要被刷新，因此DRAM要远比SRAM慢。

因此SRAM经常被用作缓存(cache)，而DRAM因为相对便宜且密度大主要作为处理器内存。

一个SRAM中有六个晶体管，可以存储一个bit的数据，每个bit存储在四个晶体管上，因此有两个重合部分。

SRAM小结：
- 最快的存储器
- 由6个晶体管构成
- 不需要被刷新
- 密度更低，平方面积存储能力更差，因为一个单元上的电路更多

文章主要讨论异步(asynchronous) SRAM。

## Hands On

Cmod A7 开发板集成了SRAM，其特点如下：
- 512KB
- 19个地址信号
- 8个双向数据信号
- 3个控制信号
    - 三个控制信号分别是CE，OE和WE，活跃度都很低
    - ce_n (chip enable)：控制芯片是否被启用
    - we_n (write enable): 控制写入操作
    - oe_n (output enable): 控制读出操作
- 访问时间10ns
- 数据总线(data bus)为8 bit宽

开发板的读操作涉及到11个时间参数，其中的6个如下：
- trc：读周期时间(read cycle time)，两个读操作的最短间隔，几乎与tAA相等。
- tAA：地址访问时间(address access time)，地址变化后获取稳定数据的时间。
- tOHA：输出保持时间(output hold time)，地址变化后输出数据仍然有效的时间。
- tDOE：输出使能访问时间(output enable access time)，激活oen后获取有效数据所需的时间。
- tHZOE：输出使能到high-Z时间(output enable to high-Z time)，oe_n去激活后三态缓冲器进入高阻抗状态的时间。
- tLZOE：输出使能到low-Z时间(output enable to low-Z time)，oe_n被激活后三态缓冲器离开高阻抗状态的时间。请注意，即使输出不再处于高阻抗状态，数据仍然无效。

开发板的写操作涉及到的时间参数如下：
- twc：写周期时间(write cycle time)，两个写操作的最短间隔。
- tSA：地址建立时间(address setup time)，在we_n被激活之前，地址必须稳定的最短时间。
- tHA：地址保持时间(address hold time)，去激活we_n后地址必须稳定的最短时间。
- tPWE1：写使能脉冲宽度(we_n pulse width)，we_n必须断言的最小时间。
- tso：数据建立时间(data setup time)，在锁存沿(we_n从0移动到1的上升沿)之前，数据必须保持稳定的最短时间。
- tHD：数据保持时间，数据在锁存沿后必须保持稳定的最短时间。

## Controller

为了成功执行一个读或写操作，断言地址、数据和控制信号的顺序是很重要的，并且需要确定他们保持一段时间的稳定。为了实现这些并且接入SRAM，我们用一个存储控制器(Memory Controller)。

### Controller using Verilog

一个非常简单和基本的SRAM控制器的代码如下:
~~~
    module basic_sram_controller(

      input wire clk,                        //  Clock signal

      input wire rw,                         //  With this signal, we select reading or writing operation
      input wire [18:0] addr,                //  Address bus
      input wire [7:0] data_f2s,             //  Data to be writteb in the SRAM
  
      output reg [7:0] data_s2f_r,           //  It is the 8-bit registered data retrieved from the SRAM (the -s2f suffix stands for SRAM to FPGA)
      output wire [18:0] ad,                 //  Address bus
      output wire we_n,                      //  Write enable (active-low)
      output wire oe_n,                      //  Output enable (active-low)

      inout wire [7:0] dio_a,                //  Data bus
      output wire ce_a_n                     //  Chip enable (active-low). Disables or enables the chip.
      );

      assign ce_a_n = 1'b0;
      assign oe_n = 1'b0;
      assign we_n = rw;
      assign ad = addr;
  
      assign dio_a = (rw == 1'b1)? 8'hZZ : data_f2s;
  
      always @(posedge clk) begin
        if (rw == 1'b1)
          data_s2f_r <= dio_a;
      end
    endmodule
~~~
这种设计提供了较大的时间裕度，并且不施加任何严格的时间限制。它已在Cmod A7 FPGA板上进行了测试，该板具有12 MHz时钟输入，即周期为83.333纳秒。

ce_n(芯片使能信号)和oe_n(输出使能信号)一直处于激活状态。

我们对三态缓冲区使用三元运算符。注意，dio是一个双向总线。

下面是一个非常简单的仿真模型：
~~~
    specify					
        specparam 
        Twp = 8,	
        Tdw = 6,				
        Tdh = 0;				
        $width (negedge we_n, Twp);			
        $setup (data, posedge we_n, Tdw);	
        $hold (posedge we_n, data, Tdh);	
    endspecify
    reg [7:0] sram [0:1024];
    always@(posedge we_n)
        if (ce_n == 1'b0)  
        sram[addr] <= data;
    assign #10 data = (~ce_n & ~oe_n) ? sram[addr] :  8'bz; 
~~~
接下来要构建一个可综合的设计来测试SRAM。对于测试SRAM的HDL设计，我们必须能够在任何特定地址中写入和读取任何数据。因此，重要的是要有一个终端来选择我们想要进行的操作，并输入任何所需的数据。要做到这一点，设计将需要以下模块:
- UART：向FPGA/PC发送或接受数据。
- Debouncer：debounce reset button。
- FSM: 控制设计中所有的信号和状态。
- SRAM控制器

原文章：https://www.hackster.io/salvador-canas/a-practical-introduction-to-sram-memories-using-an-fpga-i-3f3992