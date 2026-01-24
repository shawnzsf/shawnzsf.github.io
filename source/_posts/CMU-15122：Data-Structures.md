---
title: CMU 15122：Data Structures
date: 2024-07-17 22:52:13
tags: Course Notes
categories: Computer Science
abbrlink: cmu15122note3
description: Content about the second part of CMU 15-122 Principle of imeprative computation
---

# Libraries

## Overview
通过使用库（libraries），程序可以复用已经编写好的代码，包括系统代码、过去编写的简单代码以及他人编写的复杂代码。库有助于隐藏不必要的细节，使代码更易于管理，并允许透明的改进。

Structure of a library: 
- 接口（Interface）：列出了库导出的功能及其使用方法。
- 实现（Implementation）：实现接口中列出的功能的代码。
- 文档（Documentation）：解释库中功能的作用。

在编写应用程序代码时，开发者能且只能使用接口中列出的功能，不依赖于实现。编译应用程序时，需要包含库的实现。库包含系统库作为编程语言的一部分，如C0的输入输出函数，和用户定义库**：由用户编写或从互联网下载，必须与应用程序一起编译。

就15122而言，库最重要的帮助是定义了新数据类型及其使用方法。通过接口定义类型和操作，使得实现可以透明地更改，而不影响使用该类型的应用程序。

## Example of Self-Sorting Arrays, SSA

SSA是一个示例数据结构，类似于字符串数组，但具有报告长度的功能，并保证其元素是排序的。

- **接口内容**：
  1. 自排序数组的类型（ssa_t），通常（xxx_t）是声明struct xxx后typedef该struct的指针。
  2. 操作SSA的库提供的函数，如创建新数组（"ssa_new"）、读取数组索引的值（"ssa_get"）、替换数组索引的值（"ssa_set"）、返回数组长度（"ssa_len"）。
  3. 每个操作的contracts，包括pre/postconditions。
  4. Data structure invariant, 用于确保SSA的表示是有效的，如`is_ssa`函数，只在library implementation中使用，通常用在contract的pre/postcondition当中。

客户端代码只能通过接口与SSA交互，实现细节不对客户端透明。

# Stack and Queue

## Worklists
- **Worklists**是一个数据结构家族，可以存储元素，并提供一种方法来检索它们。客户端可以添加元素到工作列表并从中检索元素，而不需要关心其实现方式。
- **例子**：待办事项列表、食堂排队、操作系统中的挂起进程，栈（Stacks），队列（Queues），优先队列（Priority Queues）。
- **类型**：
  - 工作列表中的元素：字符串（string）
  - 工作列表本身：类型为 `wl_t`
- **操作**：
  - 添加元素：`wl_add`
  - 检索元素：`wl_retrieve`
  - 创建新的工作列表：`wl_new`
  - 检查工作列表是否为空：`wl_empty`

## Stacks
- **栈**是一种工作列表，其中检索的是最后插入的元素。
- **操作**：
  - 压栈（push）：在栈顶添加元素
  - 出栈（pop）：从栈顶移除元素

### The Stack Interface
- **栈接口**：工作列表接口的名称变更版，并提供复杂度界限。
- **操作**：
  - `stack_empty(stack_t S)`：检查栈是否为空，时间复杂度 O(1)
  - `stack_new()`：创建一个新的空栈，时间复杂度 O(1)
  - `push(stack_t S, string x)`：向栈中添加元素，时间复杂度 O(1)
  - `pop(stack_t S)`：从栈中移除元素，时间复杂度 O(1)

### Peeking into a Stack
- **查看栈顶元素**：编写一个客户端函数，返回栈顶元素但不移除它。
- **实现**：使用 `pop` 操作移除栈顶元素，然后使用 `push` 操作将其放回。

### The Size of a Stack
- **栈的大小**：编写一个客户端函数，返回栈中元素的数量。
- **实现**：通过 `pop` 操作计数元素，然后将它们压回栈中以恢复原始顺序。

### Sample implementation

~~~
#use <conio>

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

/* Aux structure of linked lists */
typedef struct list_node list;
struct list_node {
  string data;
  list* next;
};

bool is_acyclic(list* start) {
  if (start == NULL) return true;
  list* h = start->next;         // hare
  list* t = start;               // tortoise
  while (h != t) {
    if (h == NULL || h->next == NULL) return true;
    h = h->next->next;
    //@assert t != NULL; // hare is faster and hits NULL quicker
    t = t->next;
  }
  //@assert h == t;
  return false;
}

/* is_segment(start, end) will diverge if list is circular! */
bool is_segment(list* start, list* end) {
  if (start == NULL) return false;
  if (start == end) return true;
  return is_segment(start->next, end);
}

// Will run for ever if the segment is circular
void print_segment(list* start, list* end)
//requires start != NULL;
{
  for (list* p = start; p != end; p = p->next) {
    printf("%s", p->data);
    if (p != end) printf("->");
  }
}


/* Stacks */

typedef struct stack_header stack;
struct stack_header {
  list* top;
  list* floor;
};

void stack_print_unsafe(stack* S)
{
  printf("[top] ");
  print_segment(S->top, S->floor);
}

bool is_stack(stack* S) {
  return S != NULL
      && is_acyclic(S->top)
      && is_segment(S->top, S->floor);
}

void stack_print_internal(stack* S)
//@requires is_stack(S);
{
  stack_print_unsafe(S);
}

bool stack_empty(stack* S)
//@requires is_stack(S);
{
  return S->top == S->floor;
}

stack* stack_new()
//@ensures is_stack(\result);
//@ensures stack_empty(\result);
{
  stack* S = alloc(stack);
  list* l = alloc(list);
  S->top = l;
  S->floor = l;
  return S;
}

void push(stack* S, string x)
//@requires is_stack(S);
//@ensures is_stack(S);
//@ensures !stack_empty(S);
{
  list* l = alloc(list);
  l->data = x;
  l->next = S->top;
  S->top = l;
}

string pop(stack* S)
//@requires is_stack(S);
//@requires !stack_empty(S);
//@ensures is_stack(S);
{
  string e = S->top->data;
  S->top = S->top->next;
  return e;
}

void stack_print(stack* S)
//@requires is_stack(S);
{
  printf("TOP: ");
  for (list* l = S->top; l != S->floor; l = l->next) {
    printf("%s", l->data);
    if (l->next != S->floor) printf(" | ");
  }
}

// Client type
typedef stack* stack_t;

/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/******************************* Interface ******************************/

// typedef ______* stack_t;

bool stack_empty(stack_t S)       /* O(1) */
/*@requires S != NULL; @*/ ;

stack_t stack_new()               /* O(1) */
/*@ensures \result != NULL; @*/
/*@ensures stack_empty(\result); @*/ ;

void push(stack_t S, string x)    /* O(1) */
/*@requires S != NULL; @*/
/*@ensures !stack_empty(S); @*/ ;

string pop(stack_t S)             /* O(1) */
/*@requires S != NULL; @*/
/*@requires !stack_empty(S); @*/ ;

void stack_print(stack_t S)       /* O(n) */
/*@requires S != NULL; @*/ ;

~~~

## Queues
- **队列**是一种工作列表，其中检索的是最早插入的元素。
- **操作**：
  - `enqueue`：在队列尾部添加元素
  - `dequeue`：从队列头部移除元素

### The Queue Interface
- **队列接口**：类似于工作列表接口，名称变更。
- **操作**：
  - `queue_empty(queue_t S)`：检查队列是否为空，时间复杂度 O(1)
  - `queue_new()`：创建一个新的空队列，时间复杂度 O(1)
  - `enq(queue_t S, string x)`：向队列中添加元素，时间复杂度 O(1)
  - `deq(queue_t S)`：从队列中移除元素，时间复杂度 O(1)

### Copying a Queue
- **复制队列**：编写一个客户端函数，返回队列的深拷贝，即一个新队列，包含与原队列相同顺序的元素。

### Sample implementation

~~~
#use <conio>

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

/* Aux structure of linked lists */
typedef struct list_node list;
struct list_node {
  string data;
  list* next;
};

bool is_acyclic(list* start) {
  if (start == NULL) return true;
  list* h = start->next;         // hare
  list* t = start;               // tortoise
  while (h != t) {
    if (h == NULL || h->next == NULL) return true;
    h = h->next->next;
    //@assert t != NULL; // hare is faster and hits NULL quicker
    t = t->next;
  }
  //@assert h == t;
  return false;
}

/* is_segment(start, end) will diverge if list is circular! */
// Recursive version
bool is_segment(list* start, list* end) {
  if (start == NULL) return false;
  if (start == end) return true;
  return is_segment(start->next, end);
}
// Iterative version using a while loop
bool is_segmentB(list* start, list* end) {
  list* l = start;
  while (l != NULL) {
    if (l == end) return true;
    l = l->next;
  }
  return false;
}
// Iterative version using a for loop
bool is_segmentC(list* start, list* end) {
  for (list* p = start; p != NULL; p = p->next) {
    if (p == end) return true;
  }
  return false;
}

// Will run for ever if the segment is circular
void print_segment(list* start, list* end)
//requires start != NULL;
{
  for (list* p = start; p != end; p = p->next) {
    printf("%s", p->data);
    if (p != end) printf("->");
  }
}


/* Queues */

typedef struct queue_header queue;
struct queue_header {
  list* front;
  list* back;
};

void queue_print_unsafe(queue* Q)
{
  printf("[front] ");
  print_segment(Q->front, Q->back);
  printf(" [back]");
}

bool is_queue(queue* Q) {
  return Q != NULL
      && is_acyclic(Q->front)
      && is_segment(Q->front, Q->back);
}

void print_queue_internal(queue* Q)
//@requires is_queue(Q);
{
  queue_print_unsafe(Q);
}

bool queue_empty(queue* Q)
//@requires is_queue(Q);
{
  return Q->front == Q->back;
}

queue* queue_new()
//@ensures is_queue(\result);
//@ensures queue_empty(\result);
{
  queue* Q = alloc(queue);
  list* l = alloc(list);
  Q->front = l;
  Q->back = l;
  return Q;
}

void enq(queue* Q, string s)
//@requires is_queue(Q);
//@ensures is_queue(Q);
//@ensures !queue_empty(Q);
{
  list* l = alloc(list);
  Q->back->data = s;
  Q->back->next = l;
  Q->back = l;
}

string deq(queue* Q)
//@requires is_queue(Q);
//@requires !queue_empty(Q);
//@ensures is_queue(Q);
{
  string s = Q->front->data;
  Q->front = Q->front->next;
  return s;
}

void queue_print(queue* Q)
//@requires is_queue(Q);
{
  printf("FRONT: ");
  for (list* l = Q->front; l != Q->back; l = l->next) {
    printf("%s", l->data);
    if (l->next != Q->back) printf(" << ");
  }
  printf(" :BACK");
}

// Client type
typedef queue* queue_t;

/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/******************************* Interface ******************************/

// typedef ______* queue_t;

bool queue_empty(queue_t Q)       /* O(1) */
/*@requires Q != NULL; @*/ ;

queue_t queue_new()               /* O(1) */
/*@ensures \result != NULL; @*/
/*@ensures queue_empty(\result); @*/ ;

void enq(queue_t Q, string e)     /* O(1) */
/*@requires Q != NULL; @*/
/*@ensures !queue_empty(Q); @*/ ;

string deq(queue_t Q)             /* O(1) */
/*@requires Q != NULL; @*/
/*@requires !queue_empty(Q); @*/ ;

void queue_print(queue_t Q)       /* O(n) */
/*@requires Q != NULL; @*/ ;
~~~

# Linked lists

链表是一种使用指针连接元素的数据结构，每个元素包含数据和指向下一个元素的指针。节点（Node）是链表的基本单元，包含数据和指向下一个节点的指针。

链表的递归类型：struct list_node { int data; list* next; }。链表的头指针指向链表的第一个节点。：
在链表头部插入：时间复杂度 O(1)。在链表尾部插入：时间复杂度 O(n)，需要遍历整个链表。
从链表头部删除：时间复杂度 O(1)。从链表尾部删除：时间复杂度 O(n)，需要遍历整个链表。

龟兔算法（Tortoise and Hare Algorithm）：使用两个指针（一个慢指针，一个快指针）来检测链表中是否存在循环。

使用链表可以实现Stack和Queue。

数组（未排序）：
- 优点：O(1) 访问时间，内置的自适应大小。
- 缺点：固定大小，插入和删除操作时间复杂度为 O(n)。
链表：
- 优点：自适应大小，O(1) 插入和删除操作（给定正确的指针）。
- 缺点：O(n) 访问时间，没有特殊的语法。

# Unbounded Array

理解Unbounded Array(UBA)可能需要一些context。我们知道访问Array的复杂度是O(1)，并且我们在分配内存的时候赋予其固定长度。访问链表的复杂度是O(n)，但是其size是可变的。而UBA则结合了这两种结构的优势，提供了O(1)的访问复杂度，并且在数组满时扩张成更大的数组。

## Interface
- uba_len(uba_t A)：获取数组长度，时间复杂度 O(1)。
- uba_new(int size)：创建一个新的无界数组，时间复杂度 O(size)。
- uba_get(uba_t A, int i)：获取数组中索引为i的元素，时间复杂度 O(1)。
- uba_set(uba_t A, int i, string x)：设置数组中索引为i的元素为x，时间复杂度 O(1)。
- uba_add(uba_t A, string x)：在数组末尾添加元素x，时间复杂度 O(1)（摊销复杂度）。
- uba_rem(uba_t A)：移除并返回数组的最后一个元素，时间复杂度 O(1)（摊销复杂度）。


## Implementation
数据结构：使用一个结构体uba_header来表示无界数组，包含数组的长度（size）、容量（limit）和数据（data）。
扩容策略：当数组满时，通过创建一个更大的数组并将元素复制过去来实现扩容。

### Sample Implementation

~~~
#use <util>
#use <string>
#use <conio>

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

typedef struct uba_header uba;
struct uba_header {
  int size;          // 0 <= size && size < limit
  int limit;         // 0 < limit
  string[] data;     // \length(data) == limit
};

// Internal debugging function that prints an UBA without checking contracts
// (useful to debug representation invariant issues)
void uba_print_unsafe(uba* A)
{
  printf("UBA limit=%d; length=%d; data=[", A->limit, A->size);
  for (int i = 0; i < A->limit; i++)
  //@loop_invariant 0 <= i && i <= A->limit;
  {
    if (i < A->size)
      printf("%s", A->data[i]);
    else
      printf("X");
    if (i < A->limit-1) {
      if (i == A->size-1) printf(" | ");
      else printf(", ");
    }
  }
  printf("]");
}

bool is_array_expected_length(string[] A, int length) {
  //@assert \length(A) == length;
  return true;
}

bool is_uba(uba* A) {
  return A != NULL
      && 0 <= A->size && A->size < A->limit
      && is_array_expected_length(A->data, A->limit);
}

// Internal debugging function that prints an SSA
// (useful to spot bugs that do not invalidate the representation invariant)
void uba_print_internal(uba* A)
//@requires is_uba(A);
{
  uba_print_unsafe(A);
}


// Implementation of exported functions
int uba_len(uba* A)
//@requires is_uba(A);
//@ensures 0 <= \result && \result < \length(A->data);
{
  return A->size;
}

string uba_get(uba* A, int i)
//@requires is_uba(A);
//@requires 0 <= i && i < uba_len(A);
{
  return A->data[i];
}

void uba_set(uba* A, int i, string x)
//@requires is_uba(A);
//@requires 0 <= i && i < uba_len(A);
//@ensures is_uba(A);
{
  A->data[i] = x;
}

uba* uba_new(int size)
//@requires 0 <= size;
//@ensures is_uba(\result);
//@ensures uba_len(\result) == size;
{
  uba* A = alloc(uba);
  int limit = size == 0 ? 1 : size*2;
  A->data = alloc_array(string, limit);
  A->size = size;
  A->limit = limit;

  return A;
}

void uba_resize(uba* A, int new_limit)
/* A may not be a valid array since A->size == A->limit is possible! */
//@requires A != NULL;
//@requires 0 <= A->size && A->size < new_limit;
//@requires \length(A->data) == A->limit;
//@ensures is_uba(A);
{
  string[] B = alloc_array(string, new_limit);

  for (int i = 0; i < A->size; i++)
    //@loop_invariant 0 <= i;
    {
      B[i] = A->data[i];
    }

  A->limit = new_limit;
  A->data = B;
}

void uba_add(uba* A, string x)
//@requires is_uba(A);
//@ensures is_uba(A);
{
  A->data[A->size] = x;
  (A->size)++;

  if (A->size < A->limit) return;
  assert(A->limit <= int_max() / 2); // Fail if array would get too big
  uba_resize(A, A->limit * 2);
}

string uba_rem(uba* A)
//@requires is_uba(A);
//@requires 0 < uba_len(A);
//@ensures is_uba(A);
{
  (A->size)--;
  string x = A->data[A->size];

  if (A->limit >= 4 && A->size <= A->limit / 4)
    uba_resize(A, A->limit / 2);

  return x;
}

void uba_print(uba* A)
//@requires is_uba(A);
{
  printf("[");
  for (int i = 0; i < A->size; i++)
    {
      printf("%s", A->data[i]);
      if (i+1 != A->size) printf(", ");
    }
  printf("]");
}


// Client type
typedef uba* uba_t;

/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/******************************* Interface ******************************/

// typedef ______* uba_t;

int uba_len(uba_t A)
/*@requires A != NULL;   @*/
/*@ensures \result >= 0; @*/ ;

uba_t uba_new(int size)
/*@requires 0 <= size;               @*/
/*@ensures \result != NULL;          @*/
/*@ensures uba_len(\result) == size; @*/ ;

string uba_get(uba_t A, int i)
/*@requires A != NULL;                @*/
/*@requires 0 <= i && i < uba_len(A); @*/ ;

void uba_set(uba_t A, int i, string x)
/*@requires A != NULL;                @*/
/*@requires 0 <= i && i < uba_len(A); @*/ ;

void uba_add(uba_t A, string x)
/*@requires A != NULL; @*/ ;

string uba_rem(uba_t A)
/*@requires A != NULL;      @*/
/*@requires 0 < uba_len(A); @*/ ;

// bonus function
void uba_print(uba_t A)
/*@requires A != NULL;      @*/ ;

~~~

## Amortized Analysis

我们做Amortized Analysis的动机是估计不同函数/算法的runtime。之前的Worst-case analysis提供了runtime的上界。但其假定了每次对于函数的调用都有一样的runtime，并且有可能很大程度的夸张了资源耗费。Amortized Analysis将worst-case cost分配到整个操作序列上，使得其在分析一个操作序列中某一个操作序列的cost时很有用。 也用于分析那些在最坏情况下成本较高，但通过一系列操作可以摊销到较低平均成本的操作。例如，动态数组的扩容、链表的插入和删除等。

我们有两种进行Amortized Analysis的方法。
一个比较方便的表示方法是使用token来表示操作的耗费（e.g. 1 token for push, 1 token for pop），在实际数据结构分析时判断每个操作本身所需的token和其隐含的token，这样就可以给每个操作得到固定的token值，再做平均。在对于多个操作组成的序列(e.g. push and pop from a stack)做分析时比较有用。

1. Identify cost of future operations to save tokens for (e.g. resizing an array, moving elements over)
2. How many current operations do we perform before the future operation?(divide # of tokens to save by # of current ops that lead up to the future op)
3. Compute amortized cost(cost of operation itself + cost saved for future ops)

另一种方法是计算一个序列的操作耗费然后除以操作次数，只有操作序列中只有一种操作时适用(e.g. uba_add)。

1. Start having just finished an expensive operation.
2. Count # of operations until the next expensive operation.
3. Compute amortized cost (cost of sequence / # of ops in sequence)


# Hashing

- **哈希表**：一种数据结构，通过哈希函数将键映射到表中的索引，解决键值对的存储和检索问题。
- **哈希表操作**：插入、查找、删除。

不同的键可能映射到同一个索引，需要解决collision问题。
- **开放寻址法**（Open Addressing）：在表中寻找下一个空闲位置。
- **链地址法**（Separate Chaining）：每个索引包含一个链表，所有映射到该索引的键值对都存储在这个链表中。

如果所有桶（buckets）中的条目数量相同，则查找和插入操作的平均成本是 O(1)。如果所有条目都映射到同一个桶，则查找和插入操作的成本是 O(n)。通过适当调整哈希表的大小，可以保持插入操作的摊销成本为 O(1)。

哈希函数将键转换为哈希值的函数，理想的哈希函数应产生均匀分布的哈希值，减少碰撞。线性同余生成器（Linear Congruential Generator, LCG）是一种常见的伪随机数生成器，用于生成哈希值。

## Generic Pointers

传统的数据结构如栈（stacks）通常针对特定类型的元素设计，例如字符串或整数。为不同类型的元素创建栈需要复制和修改相同的代码，这导致代码重复且难以维护。

使用`elem`作为泛型类型名，让客户端代码定义`elem`的实际类型。客户端需要在客户端接口中定义`elem`的类型，例如`typedef string elem;`或`typedef int elem;`。

- **优点**：
  - 单一的库可以用于任何类型的栈。
  - 如果需要不同类型的栈，只需在客户端适当地定义`elem`。
- **缺点**：
  - 客户端应用程序需要分割成两个文件，一个包含客户端定义，另一个包含其余的客户端应用程序代码。
  - 强制使用不自然的编译模式，例如需要先编译库文件再编译客户端应用程序文件。
  - 客户端应用程序最多只能包含一种类型的栈，因为`elem`的定义在整个应用程序中必须是一致的。

C1是C0语言的扩展，提供了泛型指针和函数指针，以增强泛型性。C1引入了`void*`指针类型，允许将任何类型的指针转换为`void*`，然后再转换回原始类型。

在栈的实现中，使用`void*`作为元素类型。将任何类型的元素转换为`void*`指针，以便在栈中存储和检索。C1语言在运行时会对`void*`指针进行检查，确保在转换回特定类型指针时类型匹配。如果错误地将`void*`转换为错误的类型，将导致运行时错误。

除了泛型指针，C1还提供了函数指针，允许将函数的地址作为值存储和传递。

## Hash Dictionary

使用哈希表实现的字典，提供了快速的数据查找功能。字典中的每个条目包含一个键（key）和一个关联的数据（value）。

哈希表使用分链哈希表（separate-chaining hash table）实现，具有初始容量，可能支持自适应调整大小。

- **类型定义**：`hdict_t` 用于操作字典，`key` 和 `entry` 为键和条目的类型。
- **操作函数**：
  - `hdict_new(int capacity)`：创建新字典。
  - `hdict_lookup(hdict_t D, key k)`：在字典中查找键。
  - `hdict_insert(hdict_t D, entry e)`：向字典中插入条目。

客户端需要提供键的哈希值、键的比较函数等信息给库。客户端需要在接口中定义获取条目键、计算键的哈希值和比较两个键是否相同的函数。

哈希字典的每个链表节点包含数据和指向下一个节点的指针。字典头部包含字典的大小、容量和指向链表节点数组的指针。表示不变式确保字典的内部结构满足特定的条件，如链表无环、条目不为空等。

### Implementation

~~~
#use <util>
#use <conio>

/************************************************************************/
/**************************** Client Interface **************************/

// typedef ______* entry;               // Supplied by client
// typedef ______  key;                 // Supplied by client

key  entry_key(entry x)                 // Supplied by client
  /*@requires x != NULL; @*/ ;
int  key_hash(key k);                   // Supplied by client
bool key_equiv(key k1, key k2);         // Supplied by client

/************************* End Client Interface *************************/
/************************************************************************/

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

typedef struct chain_node chain;
struct chain_node {
  entry  data;           // != NULL; contains both key and value
  chain* next;
};

typedef struct hdict_header hdict;
struct hdict_header {
  int size;              // 0 <= size
  chain*[] table;        // \length(table) == capacity
  int capacity;          // 0 < capacity
};

bool is_array_expected_length(chain*[] table, int length) {
  //@assert \length(table) == length;
  return true;
}

bool is_hdict(hdict* H) {
  return H != NULL
      && H->capacity > 0
      && H->size >= 0
      && is_array_expected_length(H->table, H->capacity);
   /* && table contains correct number non-NULL entries in correct places */
}

int index_of_key(hdict* H, key k)
//@requires is_hdict(H);
//@ensures 0 <= \result && \result < H->capacity;
{
  return abs(key_hash(k) % H->capacity);
}

hdict* hdict_new(int capacity)
//@requires capacity > 0;
//@ensures is_hdict(\result);
{
  hdict* H = alloc(hdict);
  H->size = 0;
  H->capacity = capacity;
  H->table = alloc_array(chain*, capacity);
  return H;
}

entry hdict_lookup(hdict* H, key k)
//@requires is_hdict(H);
//@ensures \result == NULL || key_equiv(entry_key(\result), k);
{
  int i = index_of_key(H, k);
  for (chain* p = H->table[i]; p != NULL; p = p->next) {
    if (key_equiv(entry_key(p->data), k))
      return p->data;
  }
  return NULL;
}

void hdict_insert(hdict* H, entry x)
//@requires is_hdict(H);
//@requires x != NULL;
//@ensures is_hdict(H);
//@ensures hdict_lookup(H, entry_key(x)) == x;
{
  key k = entry_key(x);
  int i = index_of_key(H, k);
  for (chain* p = H->table[i]; p != NULL; p = p->next) {
    //@assert p->data != NULL;  // From preconditions -- operational reasoning!
    if (key_equiv(entry_key(p->data), k)) {
      p->data = x;
      return;
    }
  }

  // prepend new entry
  chain* p = alloc(chain);
  p->data = x;
  p->next = H->table[i];
  H->table[i] = p;
  (H->size)++;
}

// Statistics
int chain_length(chain* p) {
  int i = 0;
  while (p != NULL) {
    i++;
    p = p->next;
  }
  return i;
}

// report the distribution stats for the hashtable
void hdict_stats(hdict* H)
//@requires is_hdict(H);
{
  int max = 0;
  int[] A = alloc_array(int, 11);
  for(int i = 0; i < H->capacity; i++) {
    int j = chain_length(H->table[i]);
    if (j > 9) A[10]++;
    else A[j]++;
    if (j > max) max = j;
  }

  printf("Hash table distribution: how many chains have size...\n");
  for(int i = 0; i < 10; i++) {
    printf("...%d:   %d\n", i, A[i]);
  }
  printf("...10+: %d\n", A[10]);
  printf("Longest chain: %d\n", max);
}

// Client-side type
typedef hdict* hdict_t;

/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/*************************** Library Interface **************************/

// typedef ______* hdict_t;

hdict_t hdict_new(int capacity)
/*@requires capacity > 0; @*/
/*@ensures \result != NULL; @*/ ;

entry hdict_lookup(hdict_t H, key k)
/*@requires H != NULL; @*/
/*@ensures \result == NULL || key_equiv(entry_key(\result), k); @*/ ;

void hdict_insert(hdict_t H, entry x)
/*@requires H != NULL && x != NULL; @*/
/*@ensures hdict_lookup(H, entry_key(x)) == x; @*/ ;
~~~

## Generic Hash Dictionary

泛型数据结构如哈希字典，其操作对数据类型是不可知的，可以用于任何类型的键和条目。泛型库允许客户端选择数据类型,可以在同一个应用程序中使用不同数据类型的多个实例。

哈希字典的泛型实现通过将键和条目类型定义为 `void*` 来实现泛型。客户端需要提供 `entry_key`, `key_hash`, 和 `key_equiv` 函数来处理键和条目的具体类型。客户端必须定义自己的 `entry` 和 `key` 类型，并提供相应的函数来满足库的接口。为了避免在客户端代码中重复定义相同的函数名，可以通过为客户端函数提供不同的名称（如 `key_hash_produce`）来解决。

通过将哈希字典库升级为使用 `void*` 类型，简化了客户端的使用，允许在同一个应用程序中使用不同的数据类型。哈希函数和等价函数需要和谐，即具有相同哈希值的键应该是等价的。

在这里需要提到Hash dictionary分为Generic Dictionaries和Half-Generic Dictionaries。其中Generic Dictionaries是整个字典都是泛型，也就是把key和entry都定义成void*，并且由client提供key_hash, entry_key和key_equiv函数。client提供的函数里面也要把void* cast成需要的指针类型后进行操作，最后把操作结束得到的指针cast回entry或者key类型。
另一个Half-Generic的类型即指entry和key是有具体的类型的，而上述提到的函数也是library implementation中就已经有定义，client直接调用即可。
上述两种情况中，Half-Generic适合使用在已经明确了任务需要处理的数据类型的情况，Generic适合更宽泛的Dictionary任务。

C0 语言的内存模型包括局部内存、分配内存、堆（heap）、栈（stack）、文本段（TEXT），数据段（DATA）和OS。 Heap等价于alloc memory(stores local variables and function call information)，Stack等价于local memory(stores data with a lifetime not tied to the function call stack, allocated and freed by the programmer)，Text(contains executable code of the program), Data(stores global and static variables that are initialized with a value or values that are not explicitly initialized), 和OS(system calls, interrupts and other OS-related function)。C1 语言扩展了 C0，允许使用函数指针，即可以存储和操作指向函数的指针。使用 `&` 操作符获取函数的地址。将函数指针存储在变量或数据结构中。通过解引用函数指针来调用指向的函数。

函数类型的声明使用 `typedef` 为函数指针创建类型，如 `typedef int string_to_int_fn(string s);`。

函数指针是指针的一种，需要确保在使用前不为 NULL。C1 语言确保程序中的函数地址从不为 NULL，从而保证了函数指针的使用安全。函数指针允许动态调用函数，可以在运行时根据需要选择不同的函数来执行。


# Binary Search Tree

**二叉搜索树**是一种特殊的二叉树，其中每个节点的值都大于或等于其左子树中任何节点的值，并且小于或等于其右子树中任何节点的值。目标是开发一种数据结构，确保查找（lookup）、插入（insert）和查找最小元素（find_min）的最坏情况复杂度都是 O(log n)。


Quick Tree Facts:

- The empty tree is NULL
- A leaf is a tree node with NULL left and right children
- The height of a tree is the number of nodes in the longest path from the root to a leaf (inclusive)

**哈希字典**虽然平均情况下查找和插入操作的时间复杂度为 O(1)，但在最坏情况下可能会退化到 O(n)。**二叉搜索树**提供了一种保证最坏情况下时间复杂度为 O(log n) 的字典实现方式。

- **查找（Lookup）**：利用二叉搜索树的结构，从根节点开始，根据键值比较，递归地在左子树或右子树中查找。
- **插入（Insert）**：与查找操作类似，找到正确的插入位置，然后将新元素插入到树中。
- **查找最小元素（Find Min）**：从根节点开始，一直沿着左子树向下查找，直到找到最小键值。
- **节点结构**：每个节点包含数据元素、指向左子树的指针和指向右子树的指针。
- **递归性质**：二叉搜索树可以被看作是空树，或者是由根节点和两个子树（左子树和右子树）组成的。
- **Ordering invariant**：For any `tree* T`, all entries in `T->left` must be less than `T->data`, and all entries in `T->right` must be greater than `T->data`. 

有序二叉树的最佳访问复杂度是O(log n)，最差复杂度是O(n)。在最佳case里面相当于进行二分查找，最差的case里面就是顺序查找一个链表。

- **is_bst**：检查一个树是否是二叉搜索树。
- **is_ordered**：检查树中的节点是否满足二叉搜索树的顺序约束。

## Implementation

~~~
/************************************************************************/
/**************************** Client Interface **************************/

// typedef ______* entry;        // Supplied by client
// typedef ______  key;          // Supplied by client

key entry_key(entry e)           // Supplied by client
/*@requires e != NULL; @*/ ;

int key_compare(key k1, key k2); // Supplied by client

/************************* End Client Interface *************************/
/************************************************************************/

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

/* BSTs and auxiliary functions */
typedef struct tree_node tree;
struct tree_node {
  tree* left;
  entry data;  // != NULL
  tree* right;
};

/* Minimal tree representation check */
bool is_tree(tree* T) { // minimal
  // Code for empty tree
  if (T == NULL) return true;

  // Code for non-empty tree
  return T->data != NULL
      && is_tree(T->left)
      && is_tree(T->right);
}

/* is_ordered(T, lo, hi) checks if all entries in T
 * are strictly in the interval (lo,hi).
 * lo = NULL represents -infinity; hi = NULL represents +infinity */
bool is_ordered(tree* T, entry lo, entry hi)
//@requires is_tree(T);
{
  // Code for empty tree
  if (T == NULL) return true;

  // Code for non-empty tree
  //@assert T->data != NULL;   // because is_tree(T)
  key k = entry_key(T->data);
  return (lo == NULL || key_compare(entry_key(lo), k) < 0)
      && (hi == NULL || key_compare(k, entry_key(hi)) < 0)
      && is_ordered(T->left, lo, T->data)
      && is_ordered(T->right, T->data, hi);
}

bool is_bst(tree* T) {
  return is_tree(T)
      && is_ordered(T, NULL, NULL);
}

entry bst_lookup(tree* T, key k)
//@requires is_bst(T);
//@ensures \result == NULL || key_compare(entry_key(\result), k) == 0;
{
  // Code for empty tree
  if (T == NULL) return NULL;

  // Code for non-empty tree
  int cmp = key_compare(k, entry_key(T->data));
  if (cmp == 0)  return T->data;
  if (cmp <  0)  return bst_lookup(T->left, k);
  //@assert cmp > 0;
  return bst_lookup(T->right, k);
}

// Builds a singleton tree with just entry e
tree* leaf(entry e)
//@requires e != NULL;
//@ensures is_bst(\result);
{
  tree* T = alloc(tree);
  T->data = e;
  T->left  = NULL;  // Not necessary
  T->right = NULL;  // Not necessary
  return T;
}

tree* bst_insert(tree* T, entry e)
//@requires is_bst(T) && e != NULL;
//@ensures is_bst(\result) && \result != NULL;
//@ensures bst_lookup(\result, entry_key(e)) == e;
{
  // Code for empty tree
  if (T == NULL) return leaf(e);

  // Code for non-empty tree
  int cmp = key_compare(entry_key(e), entry_key(T->data));
  if (cmp == 0)     T->data = e;
  else if (cmp < 0) T->left = bst_insert(T->left, e);
  else { //@assert cmp > 0;
    T->right = bst_insert(T->right, e);
  }

  return T;
}

/******* Implementing the dictionaries ******/

struct dict_header {
  tree* root;
};
typedef struct dict_header dict;

bool is_dict(dict* D) {
  return D != NULL && is_bst(D->root);
}

dict* dict_new()
//@ensures is_dict(\result);
{
  dict* D = alloc(dict);
  D->root = NULL;         // Not necessary
  return D;
}

entry dict_lookup(dict* D, key k)
//@requires is_dict(D);
//@ensures \result == NULL || key_compare(entry_key(\result), k) == 0;
{
  return bst_lookup(D->root, k);
}

void dict_insert(dict* D, entry e)
//@requires is_dict(D) && e != NULL;
//@ensures is_dict(D) && dict_lookup(D, entry_key(e)) == e;
{
  D->root = bst_insert(D->root, e);
}

entry dict_min(dict* D)  // Return the smallest entry (or NULL)
//@requires is_dict(D);
{
  if (D->root == NULL) return NULL;
  tree* T = D->root;
  while (T->left != NULL)
    T = T->left;
  return T->data;
}

typedef dict* dict_t;

/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/*************************** Library Interface **************************/

// typedef ______* dict_t;

dict_t dict_new()
/*@ensures \result != NULL; @*/ ;

entry dict_lookup(dict_t D, key k)
/*@requires D != NULL; @*/
/*@ensures \result == NULL
        || key_compare(entry_key(\result), k) == 0; @*/ ;

void dict_insert(dict_t D, entry e)
/*@requires D != NULL && e != NULL; @*/
/*@ensures dict_lookup(D, entry_key(e)) == e; @*/ ;

entry dict_min(dict_t D)
/*@requires D != NULL; @*/ ;

~~~

# AVL Tree

AVL 树是一种自平衡的二叉搜索树，保证了树的高度始终保持在 O(log n) 的范围内，其中 n 是树中节点的数量。目标是开发一种数据结构，确保查找（lookup）、插入（insert）和查找最小元素（find_min）的最坏情况复杂度都是 O(log n)。

在 AVL 树中，查找、插入和 find_min这些操作的最坏情况复杂度为 O(log n)。普通的二叉搜索树在某些情况下（如插入序列是有序的）可能会退化成链表，导致操作复杂度变为 O(n)。

平衡树的高度在 O(log n) 范围内。自平衡树在插入新节点后，树能够自动保持平衡。

AVL 树的每个节点的左子树和右子树的高度差不超过 1。节点的值满足二叉搜索树的顺序条件。

为了维护 AVL 树的平衡条件，可能需要进行单旋转或双旋转。当右子树的高度大于左子树的高度时进行左旋转。当左子树的高度大于右子树的高度时进行右旋转。双旋转即先进行一次右旋转，再进行一次左旋转，或先进行一次左旋转，再进行一次右旋转。

AVL 树的插入策略像在 BST 中一样插入新节点，修复任何高度不变性违规，从最低违规开始修复。在 AVL 树中插入一个节点，如果导致高度违规，则通过旋转修复，修复后的树高度保持不变或只增加 1。单旋转或双旋转都可以在 O(1) 的时间内完成，确保插入操作的整体复杂度为 O(log n)。

AVL 字典接口与 BST 字典接口相同，但内部实现使用 AVL 树。AVL 字典实现在 BST 实现的基础上进行修改，增加高度不变性的维护。AVL 树的表示不变性确保 AVL 树的每个节点都满足顺序不变性和高度不变性。

### Implementation
~~~
/************************************************************************/
/**************************** Client Interface **************************/

// typedef ______* entry;        // Supplied by client
// typedef ______  key;          // Supplied by client

key entry_key(entry e)           // Supplied by client
/*@requires e != NULL; @*/ ;

int key_compare(key k1, key k2); // Supplied by client

/************************* End Client Interface *************************/
/************************************************************************/

/************************************************************************/
/************************* BEGIN IMPLEMENTATION *************************/

/* BSTs and auxiliary functions */
typedef struct tree_node tree;
struct tree_node {
  tree* left;
  entry data;  // != NULL
  tree* right;
  int height;  // > 0
};

/* Minimal tree representation check */
bool is_tree(tree* T) { // minimal
  // Code for empty tree
  if (T == NULL) return true;

  // Code for non-empty tree
  return T->data != NULL
      && is_tree(T->left)
      && is_tree(T->right);
}

/* is_ordered(T, lo, hi) checks if all entries in T
 * are strictly in the interval (lo,hi).
 * lo = NULL represents -infinity; hi = NULL represents +infinity */
bool is_ordered(tree* T, entry lo, entry hi)
//@requires is_tree(T);
{
  // Code for empty tree
  if (T == NULL) return true;

  // Code for non-empty tree
  //@assert T->data != NULL;   // because is_tree(T)
  key k = entry_key(T->data);
  return (lo == NULL || key_compare(entry_key(lo), k) < 0)
      && (hi == NULL || key_compare(k, entry_key(hi)) < 0)
      && is_ordered(T->left, lo, T->data)
      && is_ordered(T->right, T->data, hi);
}

/* UNUSED: cost is O(n)
int height(tree* T)
//@requires is_tree(T);
//@ensures \result >= 0;
{
  if (T == NULL) return 0;
  return 1 + max(height(T->left), height(T->right));
}
*/

int height(tree* T) // O(1)
//@requires is_tree(T);
//@ensures \result >= 0;
{
  return T == NULL ? 0 : T->height;
}

bool is_specified_height(tree* T) {
  if (T == NULL) return true;
  return is_specified_height(T->left)     // height(T->left)  is correct
      && is_specified_height(T->right)    // height(T->right) is correct
      && T->height == max(height(T->left),
                          height(T->right)) + 1; // height(T) is correct
}

bool is_balanced(tree* T)
//@requires is_tree(T);
{
  if (T == NULL) return true;
  return abs(height(T->left) - height(T->right)) <= 1
      && is_balanced(T->left)
      && is_balanced(T->right);
}

bool is_avl(tree* T) {
  return is_tree(T) && is_ordered(T, NULL, NULL)
      && is_specified_height(T) && is_balanced(T);
}

entry avl_lookup(tree* T, key k)
//@requires is_avl(T);
//@ensures \result == NULL || key_compare(entry_key(\result), k) == 0;
{
  // Code for empty tree
  if (T == NULL) return NULL;

  // Code for non-empty tree
  int cmp = key_compare(k, entry_key(T->data));
  if (cmp == 0)  return T->data;
  if (cmp <  0)  return avl_lookup(T->left, k);
  //@assert cmp > 0;
  return avl_lookup(T->right, k);
}

void fix_height(tree* T)
//@requires is_tree(T) && T != NULL;
//@requires is_specified_height(T->left);
//@requires is_specified_height(T->right);
//@ensures is_specified_height(T);
{
  int hl = height(T->left);
  int hr = height(T->right);
  T->height = 1 + max(hl, hr);
}

tree* rotate_left(tree* T)
//@requires T != NULL && T->right != NULL;
//@requires is_specified_height(T->left);
//@requires is_specified_height(T->right);
//@ensures is_specified_height(\result);
{
  tree* temp = T->right;
  T->right = T->right->left;
  temp->left = T;
  fix_height(T);
  fix_height(temp);
  return temp;
}

tree* rotate_right(tree* T)
//@requires T != NULL && T->left != NULL;
//@requires is_specified_height(T->left);
//@requires is_specified_height(T->right);
//@ensures is_specified_height(\result);
{
  tree* temp = T->left;
  T->left = T->left->right;
  temp->right = T;
  fix_height(T);
  fix_height(temp);
  return temp;
}

tree* rebalance_right(tree* T)
// T must be immediate result of a right-insertion
//@requires T != NULL && T->right != NULL;
//@requires is_avl(T->left) && is_avl(T->right);
//@ensures is_avl(\result);
{
  if (height(T->right) - height(T->left) == 2) {   // violation!
    if (height(T->right->right) > height(T->right->left)) {
      // Single rotation
      T = rotate_left(T);
    } else {
      //@assert height(T->right->left) > height(T->right->right);
      // Double rotation
      T->right = rotate_right(T->right);
      T = rotate_left(T);
    }
  } else { // No rotation needed, but tree may have grown
    fix_height(T);
  }

  return T;
}

tree* rebalance_left(tree* T)
// T must be immediate result of a left-insertion
//@requires T != NULL && T->left != NULL;
//@requires is_avl(T->left) && is_avl(T->right);
//@ensures is_avl(\result);
{
  if (height(T->left) - height(T->right) == 2) {   // violation!
    if (height(T->left->left) > height(T->left->right)) {
      // Single rotation
      T = rotate_right(T);
    } else {
      //@assert height(T->left->right) > height(T->left->left);
      // Double rotation
      T->left = rotate_left(T->left);
      T = rotate_right(T);
    }
  } else { // No rotation needed, but tree may have grown
    fix_height(T);
  }

  return T;
}

// Builds a singleton tree with just entry e
tree* leaf(entry e)
//@requires e != NULL;
//@ensures is_avl(\result);
{
  tree* T = alloc(tree);
  T->data = e;
  T->left  = NULL;  // Not necessary
  T->right = NULL;  // Not necessary
  T->height = 1;
  return T;
}

tree* avl_insert(tree* T, entry e)
//@requires is_avl(T) && e != NULL;
//@ensures is_avl(\result) && \result != NULL;
//@ensures avl_lookup(\result, entry_key(e)) == e;
{
  // Code for empty tree
  if (T == NULL) return leaf(e);

  // Code for non-empty tree
  //@assert is_avl(T->left);
  //@assert is_avl(T->right);
  int cmp = key_compare(entry_key(e), entry_key(T->data));
  if (cmp == 0)
    T->data = e;
  else if (cmp < 0) {  // Go left
    T->left = avl_insert(T->left, e);
    //@assert is_avl(T->left) && T->left != NULL && is_avl(T->right);
    T = rebalance_left(T);
    //@assert is_avl(T);
  }
  else {               // Go right
    //@assert cmp > 0;
    T->right = avl_insert(T->right, e);
    //@assert is_avl(T->left) && is_avl(T->right) && T->right != NULL;
    T = rebalance_right(T);
    //@assert is_avl(T);
  }

  return T;
}

/******* Implementing the dictionaries ******/

struct dict_header {
  tree* root;
};
typedef struct dict_header dict;

bool is_dict(dict* D) {
  return D != NULL && is_avl(D->root);
}

dict* dict_new()
//@ensures is_dict(\result);
{
  dict* D = alloc(dict);
  D->root = NULL;         // Not necessary
  return D;
}

entry dict_lookup(dict* D, key k)
//@requires is_dict(D);
//@ensures \result == NULL || key_compare(entry_key(\result), k) == 0;
{
  return avl_lookup(D->root, k);
}

void dict_insert(dict* D, entry e)
//@requires is_dict(D) && e != NULL;
//@ensures is_dict(D);
//@ensures dict_lookup(D, entry_key(e)) == e;
{
  D->root = avl_insert(D->root, e);
}

entry dict_min(dict* D)  // Return the smallest entry (or NULL)
//@requires is_dict(D);
{
  if (D->root == NULL) return NULL;
  tree* T = D->root;
  while (T->left != NULL)
    T = T->left;
  return T->data;
}

typedef dict* dict_t;


/************************** END IMPLEMENTATION **************************/
/************************************************************************/

/************************************************************************/
/*************************** Library Interface **************************/

// typedef ______* dict_t;

dict_t dict_new()
/*@ensures \result != NULL; @*/ ;

entry dict_lookup(dict_t D, key k)
/*@requires D != NULL; @*/
/*@ensures \result == NULL
        || key_compare(entry_key(\result), k) == 0; @*/ ;

void dict_insert(dict_t D, entry e)
/*@requires D != NULL && e != NULL; @*/
/*@ensures dict_lookup(D, entry_key(e)) == e; @*/ ;

entry dict_min(dict_t D)
/*@requires D != NULL; @*/ ;

~~~