---
title: IB Computer Science： 伪代码、流程图和简单算法小记
tags: Course Notes
categories: Computer Science
abbrlink: 68e9188a
date: 2023-09-20 18:07:07
---

<!-- 事先声明，我并不认同IB的垃圾计算机教学大纲和它规定的垃圾标准，将下列内容整理在博客中只是为了苟住校内成绩做出的无奈妥协。 -->
伪代码编写练习可以使用网站：http://ibcomp.fis.edu/pseudocode/pcode.html

## 伪代码语法

### 循环逻辑：

~~~
    loop i from ... to ...
        TODO()
    end loop

    loop while (condition?)
        TODO()
    end loop
~~~

### 分支逻辑：

~~~
    if (condition?) then
        TODO()
    else if (condition?) then
        TODO()
    else
        TODO()
    end if
~~~

### 数组管理：

~~~
    arr = new array()                     // set a new array
    arr = [..., ..., ...]                 //set values for the array
    arr[...]                              //returns the value of a certain index
    arr.Length()                          //returns the length of an array(for some reason this could not run on the above website)
~~~

### 集合管理：

~~~
    coll = new collection()               //set a new collection
    coll.addItem(certain things)          //add something to the collection
    coll.getNext()                        //return the next value
    coll.resetNext()                      //go back to the start of the collection
    coll.hasNext()                        //returns a boolean value that indicates whether it has next item or not
    coll.isEmpty()                        //returns a boolean value that indicates whether the collection is empty or not
~~~

### 栈管理：

~~~
    // One thing to be remember, first in last out
    stack = new stack()                   //set a new stack
    stack.push(certain things)            //push an item into the stack
    stack.pop()                           //returns the last item of the stack
    stack.isEmpty()                       //returns a boolean value that indicates whether the stack is empty or not
~~~

### 队列管理：

~~~
    // Another thing to remember, first in first out
    queue = new queue()                   //set a new queue
    queue.enqueue(certain things)         //put an item to the end of the queue
    queue.dequeue()                       //delete and return the front item of the queue
    queue.isEmpty()                       //returns a boolean value that indicates whether the queue is empty or not
~~~

## 流程图画法

![](</IB-Computer-Science：伪代码、流程图和简单算法小记/Screenshot 2023-09-20 182101.png>)

Then use arrows to link the blocks.

## 简单代码的伪代码实现

The following codes are all based on arrays. Searching/Sorting other form of data set need to do simple modifications to the code. 

### Sequential Search

~~~
arr = [5, 6, 3, 4, 2, 7, 8, 1]

loop i from 0 to 7
   if (arr[i] == 2) then
      index = i
   end if
end loop

output "The index of number 2 is: ", index
~~~

### Binary Search

~~~
arr = [5, 6, 3, 4, 2, 7, 8, 1]

loop i from 0 to 6
   min_idx = i
   loop j from i+1 to 7
      if arr[j] < arr[min_idx] then
         min_idx = j
      end if
   end loop
   if NOT(min_idx == i) then
      TEMP = arr[min_idx]
      arr[min_idx] = arr[i]
      arr[i] = TEMP
   end if
end loop
//Sort the array first since binary search is only applicable in ordered series

low = 0
high = 7
found = -1
loop while found = -1 AND low <= high
   mid = div(low + high, 2)
   if (arr[mid] = 8) then
      found = mid
   else if (arr[mid] < 8) then
      low = mid + 1
   else
      high = mid - 1 
   end if
end loop

if found >= 0 then
   output "The index of number 8 is: ", found
else
   output "Number was not found"
end if
~~~

### Bubble Sort

~~~
arr = [5, 6, 3, 4, 2, 7, 8, 1]

loop i from 0 to 6
   loop j from 0 to 6-i
      if arr[j] > arr[j+1] then
         TEMP = arr[j+1]
         arr[j+1] = arr[j]
         arr[j] = TEMP
      end if
   end loop 
end loop
 
loop i from 0 to 7
   output arr[i]
end loop
~~~

### Selection Sort

~~~
arr = [5, 6, 3, 4, 2, 7, 8, 1]
loop i from 0 to 6
   min_idx = i
   loop j from i+1 to 7
      if arr[j] < arr[min_idx] then
         min_idx = j
      end if
   end loop
   if NOT(min_idx == i) then
      TEMP = arr[min_idx]
      arr[min_idx] = arr[i]
      arr[i] = TEMP
   end if
end loop

loop i from 0 to 7
   output arr[i]
end loop
~~~

## 简单算法的流程图实现

### Sequential Search

![](/IB-Computer-Science：伪代码、流程图和简单算法小记/SS.jpg)

### Binary Search

![](/IB-Computer-Science：伪代码、流程图和简单算法小记/BS.jpg)

### Bubble Sort

![](/IB-Computer-Science：伪代码、流程图和简单算法小记/BubS.jpg)

### Selection Sort

![](/IB-Computer-Science：伪代码、流程图和简单算法小记/SelS.jpg)