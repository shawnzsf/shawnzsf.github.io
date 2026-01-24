---
title: CMU 15122：Deliberate Programming
date: 2024-07-02 12:20:29
tags: Course Notes
categories: Computer Science
abbrlink: cmu15122note2
description: Content about the first part of CMU 15-122 Principle of imeprative computation
---

本篇总结CMU 15122第一单元Deliberate Programming的全部内容（除了Contracts部分）。这门课的整体脉络还是较为清晰的，虽然大部分东西并不陌生，但从safety和correctness的角度重新审视一遍也是不错的。

# Integers
  
涉及进制转换的内容略过不提。

## Two's Complement

Two's Complement是C0中表示数字的一种方法。C0中的整数一共占据32个比特位，其中最高的比特位是该比特位代表的负的2的31次方，也就是说，C0中的最大正整数可以用0x7FFFFFFF表示，正数的范围是0x00000000-0x7FFFFFFF($0~2^{31}-1$)。当最大正整数int_max()再继续做加法的时候整数就会溢出到负数的范围内，也就是0x80000000-0xFFFFFFFF。其中0x80000000是int_min()，其顺序与正数表示相反。由此，c0能够表示的整个整数范围是$[-2^{31}, 2^{31})$。

对于int的操作类型有：Addition, multiplication, division, subtraction, comparisons, mod;

对于Tow's complement表示方法来说，有以下成立：
- -x = ~x + 1
- int_min() = -int_min()

对于以下操作会产生runtime error：
- int_min() (/ or %) - 1
- x / 0


## Bit Pattern

Int不是数字，是0和1组成的字符串。因此，bitwise operation可以通过对每一比特位进行操作来改变数字大小。其中包括是掩码以及各种比特位操作。& 0xFF000000 可以将另外一个32位数的后24位全部置为零，这就是为什么其被称作mask（掩码）。另外我们可以通过| 0xFF000000 将32位数的前8位全部置为1。左移<<就是将比特数左移多少位，右边补零。右移>>会根据最高位进行补齐。

# Arrays

数组是相同类型数据的集合，例如 int[] 表示整型数组。数组可以包含任何类型的元素，包括其他数组。

局部变量存储在局部内存中，函数的变量在各自的帧（frame）中。函数调用时，每个被调用的函数都有自己的帧，且只能操作自己帧中的变量。函数返回后，其帧被撤销。

使用 alloc_array(type, n) 创建数组，返回一个类型为 type[] 的数组，包含 n 个元素。数组的元素存储在分配的内存中，而数组变量本身存储在局部内存中，包含指向分配内存的地址。通过 A[i] 访问数组 A 的第 i 个元素，索引从0开始。分配的内存使用默认值初始化，对于整型数组，默认值为0。越界访问（out-of-bound access）是不允许的，有效索引是0到数组长度减一。数组操作需要满足前提条件（preconditions），例如 alloc_array(type, n) 需要 n ≥ 0。

C0中Aarray变量名存储的是数列的地址，因此，假如int[] B = A，A是某个已经存在的数列，B只会复制A的地址。后续对B的操作也实际上是对于A的操作。一旦某个数列没有指针指向它，C0的Garbage Collector就会消除掉该数列。整数与整数之间不涉及到地址的问题。C0无法返回某个数组的长度，但是用Contract中的\length()可以。

# Searching and Sorting

In-place: allocates constant amount of memory.
Stable: relative position of duplicates is preserved.

## Linear Search

Linear Search本身没什么可以探讨的，主要是关于contracts方面的问题。

### Implementation

~~~
bool is_in(int x, int[] A, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \length(A);
//Check whether x is in array segment A, [lo, hi)

int linearSearch(int x, int[] A, int n)
//@requires n == \length(A);
/*@ensures (-1 == \result && !is_in(x, A, 0, n)) ||
           ((0 <= \result && \result < n) && A[\result] == x);
{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i && i <= n;
  //@loop_invariant !is_in(x, A, 0, n);
  {
    if (A[i] == x) return i;
  }
  //@assert !is_in(x, A, 0, n);
  return -1;
}
~~~

### Safety and Correctness

确保搜索过程中数组索引 i 在有效范围内，即 0 <= i < n，其中 n 是数组 A 的长度。使用contract来定义函数的前提条件（@requires）和后置条件（@ensures）。前提条件：确保传入的数组长度 n 与数组 A 的实际长度相匹配。后置条件：如果找到元素 x，则返回其索引；否则返回 -1。

- 数组段表示数组中的一部分，用 A\[lo, hi\) 表示，包含从索引 lo（包含）到索引 hi（不包含）的元素。
- 定义 is_in(x, A, lo, hi) 函数，用于检查元素 x 是否在数组段 A\[lo, hi\) 中。

### Contract Exploits

即使函数满足Contract，也可能不满足预期的行为。例如，一个函数可以满足Contract但在逻辑上是错误的。

## Binary Search

### Implementation

~~~
int binarySearch(int x, int[] A, int n)
//@requires n == \length(A);
//@requires is_sorted(A,0,n);
/*@ensures (-1 == \result && !is_in(x, A,0,n))
        || ((0 <= \result && \result < n) && A[\result] == x);
  @*/
{
  for (int i = 0; i < n; i++)
  //@loop_invariant 0 <= i && i <= n;
  //@loop_invariant gt_seg(x, A,0,i);       // implies !is_in(x, A,0,i)
  //@loop_invariant !is_in(x, A,0,i);
  //@loop_invariant le_segs(A,0,i, A,i,n);  // because is_sorted(A,0,n)
  {
    if (A[i] == x) return i;
    if (A[i] > x) {
      //@assert lt_seg(x, A,i,n);           // implies !is_in(x, A,i,n)
      //@assert !is_in(x, A,i,n);
      return -1;
    }
    //@assert A[i] < x;                     // implies gt_seg(x, A,0,i+1);
    //@assert gt_seg(x, A,0,i+1);
  }
  //@assert !is_in(x, A,0,n);
  return -1;
}

~~~

使用循环，维护两个指针lo（low）和hi（high），分别代表搜索区间的下限和上限。
计算中间索引mid，并与目标值x进行比较。

- 如果A[mid]等于x，则返回mid。
- 如果x小于A[mid]，则更新hi为mid。
- 如果x大于A[mid]，则更新lo为mid + 1。

当lo和hi相遇时，搜索结束，返回-1表示未找到。

### Loop Invariant

- 0 ≤ lo
- lo ≤ hi
- hi ≤ n
- A\[0, lo\) < x
- x < A\[hi, n\)

应确保mid的计算不会超出整数范围，避免溢出错误。循环不变式在算法的初始化（INIT）、保持（PRES）和终止（TERMINATE）阶段都是可以被证明有效的。

## Mergesort

### Implementation

~~~
void merge(int[] A, int lo, int mid, int hi)
//@requires 0 <= lo && lo <= mid && mid <= hi && hi <= \length(A);
//@requires is_sorted(A, lo, mid) && is_sorted(A, mid, hi);
//@ensures is_sorted(A, lo, hi);
{
  int[] B = alloc_array(int, hi-lo);
  int i = lo;
  int j = mid;
  int k = 0;

  while (i < mid && j < hi)
  //@loop_invariant lo <= i && i <= mid;
  //@loop_invariant mid <= j && j <= hi;
  //@loop_invariant k == (i - lo) + (j - mid);
  {
    if (A[i] <= A[j]) {
      B[k] = A[i];
      i++;
    } else { //@assert A[i] > A[j];
      B[k] = A[j];
      j++;
    }
    k++;
  }

  //@assert i == mid || j == hi;
  // Exercise: write the omitted invariants for these loops
  while (i < mid) { B[k] = A[i]; i++; k++; }
  while (j < hi)  { B[k] = A[j]; j++; k++; }

  // Copy sorted array back into A
  for (k = 0; k < hi-lo; k++)
    A[lo+k] = B[k];
}


// mergesort
void sort(int[] A, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \length(A);
//@ensures is_sorted(A, lo, hi);
{
  if (hi - lo <= 1)            //@assert is_sorted(A, lo, hi);
    return;

  int mid = lo + (hi - lo)/2;  //@assert lo < mid && mid < hi;
  sort(A, lo, mid);            //@assert is_sorted(A, lo, mid);
  sort(A, mid, hi);            //@assert is_sorted(A, mid, hi);
  merge(A, lo, mid, hi);       //@assert is_sorted(A, lo, hi);
}

~~~

### Explanation

1. 递归地将数组分成两半，直到分出的数组长度为1或者为0;
2. 递归地将数组两两合并，合并的时候做具体的比较运算使得合并出来的数组都是有序的;
3. Merge Halves -> O(n) cost.
4. Levels of Merging -> O(logn) cost.
5. O(nlogn) cost.

## Quicksort

### Implementation

~~~
int partition(int[] A, int lo, int hi)
//@requires 0 <= lo && lo < hi && hi <= \length(A);
//@ensures lo <= \result && \result < hi;
//@ensures ge_seg(A[\result], A, lo, \result);
//@ensures le_seg(A[\result], A, \result+1, hi);
{
  int pi = lo + (hi - lo)/2;
  int pivot = A[pi];
  swap(A, pi, lo);
  int left = lo + 1;
  int right = hi;

  while (left < right)
  //@loop_invariant lo+1 <= left && left <= right && right <= hi;
  //@loop_invariant ge_seg(pivot, A, lo, left);
  //@loop_invariant le_seg(pivot, A, right, hi);
  //@loop_invariant pivot == A[lo];
  {
    if (A[left] <= pivot) {
      left++;
    } else {
      //@assert A[left] > pivot;
      swap(A, left, right-1);
      right--;
    }
  }

  //@assert left == right;
  swap(A, lo, left-1);
  return left-1;
}


// quicksort
void sort(int[] A, int lo, int hi)
//@requires 0 <= lo && lo <= hi && hi <= \length(A);
//@ensures is_sorted(A, lo, hi);
{
  if (hi - lo <= 1)               //@assert is_sorted(A, lo, hi);
    return;

  int p = partition(A, lo, hi);   //@assert lo <= p && p < hi;
  //@assert ge_seg(A[p], A,lo,p) && le_seg(A[p], A,p+1,hi);
  sort(A, lo, p);                 //@assert is_sorted(A, lo, p);
  sort(A, p+1, hi);               //@assert is_sorted(A, p+1, hi);
  //@assert is_sorted(A, lo, hi);
}
~~~

### Explanation

1. 随机挑一个轴;
2. 遍历整个数组，把每个数和轴比较，然后放到轴的左右边;
3. 递归地向下分，分到长度为1或者0时表示整个数组排序完毕;
4. Quicksort 和 Mergesort本质上很像，只不过一个在分的过程中做比较运算，一个是分完之后在合并的过程中做比较运算。
5. Unlucky: Pick smallest element as pivot O(n^2), just selection sort;
6. Average: Pick middle element -> O(nlogn);


# Complexity

O(g(n))是一组函数，其中f(n)∈O(g(n))。当且仅当：
- 有c∈R+
- 有n0∈N
使对于所有n≥n0，f(n)≤cg(n)。

O(1) ⊂ O(log n) ⊂ O(n) ⊂ O(n log n) ⊂ O(n2) ⊂ O(2n) ⊂ O(n!)

做复杂度分析是可以直接抛掉常数，取变量最坏的情况。保留不同变量间的运算。log的底因为可以通过换底公式换成常数乘以以某数为底因此不重要。

Linear search: O(1) best case, O(n) worst case.
Binary search: O(1) best case, O(logn) worst case.
Selection sort: O(n^2)
Merge sort: O(nlogn)
Quick sort: O(nlogn) best case, O(nlogn) avg case, O(n^2) worst case.

# Structs and pointers

## Local Memory and Allocated Memory

- Local memory: Literals (int, bool, string, any direct value);
    - Born when: declared in its scope
    - Vanishes when: exit its scope
- Allocated memory: (contents of) pointers, arrays, tructs;
    - Born when: we allocate them;
    - Vanishes when: we can no longer access them -> garbage collector;

## Pointers

多重指针，指针修改，内存图绘制，不做赘述

Default values:
- int: 0
- char: '\0'
- string: ""
- bool: false
- pointer: NULL
- array: empty array

## Structs

统一管理多种类数据的方便手段。内存图绘制同样不做赘述。

~~~
struct goose_header{
  string name;
  string bowtie_color;
  image* img;
};

struct goose_header* silly = alloc(struct goose_header); //Using pointer to access struct fields
typedef struct goose_header goose;
goose* silly = alloc(goose);

(*silly).bowtie_color = "pink";
//Otherwise, also recommended
silly->bowtie_color = "pink";

//valid data structure

bool is_goose(goose* g){
  return g != NULL && g->img != NULL;
}
//specification function used to check if goose valid

//safe pointer accesses:
//requires g != NULL
//requires is_goose(g), valid goose input
//ensures is_goose(g), our function doesn't make the goose invalid

~~~

# Interfaces vs. Implementation

我们可以通过typedef给数据起别名，这样可以增加程序的抽象程度，方便调用。调用interface进行开发的方面也不需要深入程序细节，使用提供的函数接口和数据别名就可以完成开发。因此通常情况下client使用的只是interface提供的指针，不对具体数据进行操作。specification function属于implementation contracts部分，确保程序正确性，因此client不会调用它们。因为client知道他们调用的是指针，因此为了防止指针被设置成NULL，interface中都会有NULL check，作为另一种监督程序正确性的手段。