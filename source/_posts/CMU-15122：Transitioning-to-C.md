---
title: CMU 15122：Transitioning to C
date: 2024-07-29 18:22:09
tags: Course Notes
categories: Computer Science
abbrlink: cmu15122note4
description: Content about the third part of CMU 15-122 Principle of imeprative computation
---
# Graph Representation

## Graph Interface

Graph是Undirected的（15122定义），也就是说对于vertex A和B，BA和AB是一条edge。我们将graph表示成一个data structure，其中vertex定义为无符号整数。那么一个基本的graph interface可以如下所示：
~~~
typedef unsigned int vertex;
typedef struct graph_header *graph_t;

graph_t graph_new(unsigned int numvert);
//@ensures \result != NULL;

void graph_free(graph_t G);
//@requires G != NULL;

unsigned int graph_size(graph_t G);
//@requires G != NULL;

bool graph_hasedge(graph_t G, vertex v, vertex w);
//@requires G != NULL;
//@requires v < graph_size(G) && w < graph_size(G);

void graph_addedge(graph_t G, vertex v, vertex w);
//@requires G != NULL;
//@requires v < graph_size(G) && w < graph_size(G);
//@requires v != w && !graph_hasedge(G, v, w);

typedef struct neighbor_header *neighbors_t;

neightbors_t graph_get_neighbors(graph_t G, vertex v);
//@requires G != NULL && v < graph_size(G);
//@ensures \result != NULL;

bool graph_hasmore_neighbors(neighbors_t nbors);
//@requires nbors != NULL;

vertex graph_next_neighbor(neighbors_t nbors);
//@requires nbors != NULL;
//@requires graph_hasmore_neighbors(nbors);

void graph_free_neighbors(neighbors_t nbors);
//@requires nbors != NULL;
~~~

我们通过graph_hasmore_neighbors和graph_next_neighbors来检查或者获取某个vertex的相邻vertex。我们可以通过多种数据结构实现上面的interface，一个有e条边的graph可以被链表或者edge的数组来表示。在链表实现中，添加一个edge的时间复杂度是O(1)，因为可以直接在链表前面接上。但是检查某一个edge是否存在需要O(e)的复杂度因为要遍历整个graph。获取某个节点的相邻节点同样需要O(e)的复杂度(Worst case)。使用哈希表和自平衡二分树也可以实现graph，但是这里只涉及到使用adjacency matrices和adjacency lists的graph实现。

## Adjacency Matrices

我们可以使用一个二维数组储存两个节点之间是否存在edge，这样的表示方法在这里被称为Adjacency Matrices。假设我们有节点B(=1)和节点D(=3)，我们检查两个节点之间是否存在edge的方法就是看二维数组的row 1，column 3。在一个不区分方向的图中，数组的右上半边是左下的镜像。因为edge的关系是对称的。因为我们不允许一个node使用edge链接自己，所以这个matrix的对角线是空的。

Adjacency Matrices的实现需要很多空间。对于一个有v个节点的graph我们需要$O(v^2)$的复杂度来分配内存。但是，使用改方法的好处是添加edge和检查edge的操作都是O(1)复杂度。

假如一个graph有0到$\frac{v(v-1)}{2}$个节点数v，并且多数edge存在，那么总edge数和$v^2$成比例关系，我们说这样的graph是dense的。对于dense graph，$O(e) = O(v^2)$，因此adjacency matrices是表示其的较好办法。因为存储其的空间并不比linked list多，但是操作更快。


## Adjacency Lists

我们将dense graph的对立称作sparse graph。Adjacency lists适合作为sparse graph的实现。在这个实现当中，我们有一个类似于哈希表的一维数组，每一个vertex都在数组中有一个位置，并且数组中的每一个元素包含所有其他和该vertex相连的链表。

这个实现需要O(v + e)的空间来存储有v个vertex和e个edge的graph。也可以被写作O(max(v, e))。添加一个edge需要的时间是constant，但是lookup某一个edge需要的时间是O(min(v, e))，因为min(v-1, e)是每一个adjacency list的最大长度。在adjacency list实现里面寻找一个neighbor的时间是O(1)。

### Implementation

~~~
typedef struct adjlist_node adjlist
struct adjlist_node{
  vertex vert;
  adjlist *next;
};

typedef struct graph_header graph;
struct graph_header{
  unsigned int size;
  adjlist **adj;
};

bool is_vertex(graph *G, vertex v){
  REQUIRES(G != NULL);
  return v < G->size;
}

bool is_in(adjlist *p, vertex v){
  while(p != NULL){
    if(p->vert == v) return true;
    p = p->next;
  }
  return false;
}

bool is_graph(graph *G){
  if(G == NULL) return false;
  if(G->adj == NULL) return false;
  for(unsigned int i = 0; i < G->size; i++){
    if(!is_acyclic(G->adj[i])) return false;
    for(adjlist *p = G->adj[i]; p != NULL; p = p->next){
      if(p->vert == i || !(is_vertex(G, p->vert))) return false;
      if(!is_in(G->adj[p->vert], i)) return false;
      if(is_in(p->next, p->vert)) return false;
    }
  }
  return true;
}

graph *graph_new(unsigned int size){  
  graph *G = xmalloc(sizeof(graph));
  G->size = size;
  G->adj = xcalloc(size, sizeof(adjlist*));
  ENSURES(is_graph(G));
  return G;
}

bool graph_hasedge(graph *G, vertex v, vertex w){
  REQUIRES(is_graph(G) && is_vertex(G, v) && is_vertex(G, w));
  for(adjlist *L = G->adj[v]; L != NULL; L = L->next){
    if(L->vert = w) return true;
  }
  return false;
}

void graph_addedge(graph *G, vertex v, vertex w){
  REQUIRES(is_graph(G) && is_vertex(G, v) && is_vertex(G, w));
  REQUIRES(v != w && !graph_hasedge(G, v, w));

  adjlist *L;
  L = xmalloc(sizeof(adjlist));
  L->vert = w;
  L->next = G->adj[v];
  G->adj[v] = L;

  L = xmalloc(sizeof(adjlist));
  L->vert = v;
  L->next = G->adj[w];
  G->adj[w] = L;

  ENSURES(is_graph(G));
  ENSURES(graph_hasedge(G, v, w));
}

struct neighbor_header{
  adjlist *next_neighbor;
}
typedef struct neighbor_header neighbors;

neighbors *graph_get_neighbors(graph *G, vertex v){
  REQUIRES(is_graph(G) && is_vertex(G, v));
  neighbors *nbors = xmalloc(sizeof(neighbors));
  nbors->next_neighbor = G->adj[v];
  ENSURES(is_neighbors(nbors));
  return nbors;
}

bool graph_hasmore_neighbors(neighbors *nbors){
  REQUIRES(is_neighbors(nbors));
  return nbors->next_neighbor != NULL;
}

vertex graph_next_neighbor(neighbors *nbors){
  REQUIRES(is_neighbors(nbors));
  REQUIRES(graph_hasmore_neighbors(nbors));

  vertex v = nbors->next_neighbor->vert;
  nbors->next_neighbor = nbors->next_neighbor->next;
  return v;
}

void graph_free_neighbors(neighbors *nbors){
    free(nbors);
}


~~~