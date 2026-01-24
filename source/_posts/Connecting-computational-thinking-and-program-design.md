---
title: Connecting computational thinking and program design
tags: IB Computer Science
abbrlink: c6b4bfe9
date: 2023-08-10 22:50:17
---

# 4.2.1 Searching, sorting and other algorithms on arrays

## Variable

变量用于存储值，每个变量有一个名称，用于引用存储的值。变量可以在程序执行期间更改。变量可以是字符串(strings)、实数(reals)、布尔型(boolean)和整型(integers)。

## One dimensional arrays or linear arrays

数组可以保存相同类型的多个数据元素(整型、字符串、布尔型等)。数组有一个名称、一个在程序执行期间不能更改的大小(大多数情况下)和一个可以描述它的数据类型。一维数组是线性数组的一种。数组总是使用零号为开头。

## Parallel arrays

定义不同的数组类型，记录某一件事情的不同方面(类似于结构体)。

## Arrays of objects

对象数组是引用变量数组。每个引用变量都是数组的一个元素，是对对象的引用。

## Two dimensional arrays

二维数组通过两个下标进行索引，第一个指向行，第二个指向列。

## Comparision between the arrays above

一维数组只能存储一个数据类型，和一串信息。如果想要处理多串不同数据类型的信息，就要使用并行数组(也就是使用多个不同数据类型的一维数组进行处理)。二维数组可以处理多串信息，但是只能处理一种数据类型。

## Sequential search

顺序或者线性搜索算法(其实就是枚举)是最简单的搜索算法，依靠蛮力美剧搜索到想要的数据。

## Binary search

二分搜索(或半间隔搜索)算法是一种依靠分治策略实现搜索的算法。在每次搜索迭代中，数组中一般的元素作为不可能的答案被消除。性能要稍微高点。

## Bubble sort

冒泡排序通过重复遍历要排序的数组实现搜索。比较相邻数组数据的大小，如果顺序不正确(升序或降序)则交换两个数据，直到重复到所有数据都符合排序规则。

## Selection sort

选择排序通过建立一个新的数组进行排序，两层循环判断。

# 4.2.2 Standard operations of collections

当我们希望在一个数据结构中存储整数、数组、布尔值和字符串时就应该使用集合。泛型集合只能保存相同类型的数据，而非泛型集合可以保存不同数据类型的元素。集合是一个可调整大小的数组，不需要提前设置好范围。

## Standard operations in collection

- AddItem(). 用于在集合中添加数据。
- getNext(). 返回集合中的第一项(检索)。

## Additional operations

- resetNext(). 重新启动迭代。
- hasNext(). 用于表示集合中是否存在当前迭代未访问的剩余元素。
- isEmpty(). 检测集合是否为空。

# 4.2.3 Algorithm to solve a specific problem

一个算法的例子。

# 4.2.4 Analyse an algorithm presented as a flow chart

如何将算法转换成流程图的例子。

# 4.2.5 Analyse an algorithm presented as pseudocode

辨识伪代码的例子

# 4.2.6 Construct pseudocode to represent an algorithm

学习如何写伪代码

# 4.2.7 Suggest suitable algorithms to solve a specific problem

算法的效率(Efficiency)是指执行其功能所需的计算机资源的数量。尽量减少各种运算资源的使用是重要的。
算法的正确性(Correctness)是指算法在多大程度上满足其规范，没有错误，并完成设计和实现阶段设定的所有目标。
算法的可靠性(Reliability)是指算法能够在规定的条件下保持预定义的性能水平，并执行所有需要的功能。
算法的灵活性(Flexibility)是指修改算法以满足其最初开发目的以外的其他目的所需的努力。

# 4.2.8 Deduce the efficiency of an algorithm in the context of its use

O符号是算法复杂度的度量，O(n)的意思是算法中指令的增长率(the growth rate of the instructions)需要执行n次。

对于一个不涉及循环的线性程序来说，他的时间复杂度是O(1)。对于一个涉及一层循环的程序来说，他的时间复杂度是0(n)。对于一个涉及两层循环嵌套的程序来说，他的时间复杂度是0(n^2)。

# 4.2.9 Determine number of iterations for given input data

简单地计算循环次数。