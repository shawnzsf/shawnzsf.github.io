---
title: CMU 21127：Summary Sheet of Definitions & Theorems
date: 2024-07-03 19:23:58
tags: Course Notes
categories: Math
abbrlink: cmu21127note1
description: Summary of definitions, theorems of CMU 21-127 Concepts of Mathematics. 
---

# Propositional Logic

- Definition 0.1: Proposition is a statement to which it is possible to assign a truth value.
- A **proposition** is an umbrella term which can be used for any result.
- A **theorem** is a key result which is particularly important.
- A **lemma** is a result which is proved for the purpose of being used in the proof of a theorem.
- A **corollary** is a result which follows from a theorem without much additional effort.

# Sets and Numbers

- Definition 0.3: A **set** is a collection of objects. The objects in the set are called **elements** of the set.
- Definition 0.5: The **natural numbers** are represented by the points on the number line which can be obtained by starting at 0 and moving right by the unit length any number of times.

## Basis for natural numbers

- Definition 0.6: Let $b \gt 1$. The **base-b expansion** of a natural number n is the string $d_rd_{r-1}...d_0$
    - $n = d_r \times b^r + d_{r-1} \times b^{r-1} + ... + d_0 \times b^0$ ;
    - $0 \le d_i \lt b$ for each i; and 
    - if $n > 0$, then $d_r \ne 0$, the base-b expansion of zero is 0 in all cases b;
- Definition 0.11: The **integers** are represented by the points on the number line which can be obtained by starting at 0 and movnig in either direction by the unit length any number of times.
- Definition 0.12: Let $a, b \in Z$. We say b **divides** a if $a=qb$ for some integer q.
- Proposition 0.15: Let $a,b,c \in Z$. If c divides b and b divides a, then c divides a.
- Definition 0.17: An integer n is even if it is divisible by 2; otherwise, n is odd.
- Theorem 0.18: Let $a,b \in Z$ with $b \ne 0$. There is exactly one way to write
$a = qb + r$
such that q and r are integers, and $0 \le r \lt b$(if $b \gt 0$), or $0 \le r \lt -b$(if $b \lt 0$).

## Algorithm to find basis

Given $n \in N$:
- Step 1: Let $d_0$ be the remainder when n is divided by b, and let $n_0=\frac{n-d_0}{b}$ be the quotient. Fix i = 0.
- Step 2: Suppose $n_i$ and $d_i$ have been defined. If $n_i = 0$, then proceed to Step 3. Otherwise, define $d_{i+1}$ to be the remainder when $n_i$ is divided by b, and define $n_{i+1} = \frac{n_i-d_i+1}{b}$. Increment i, and repeat Step 2.
- Step 3: The base-b expansion of n, is $d_id_{i-1}...d_0$.

## Rationals

- Definition 0.24: The **rational numbers** are represented by the points at the number line which can be obtained by dividing any of the unit line segments between integers into an equal number of parts.

## Real numbers

- Definition 0.25: The **real numebrs** are the points on the number line. We write R for the set of all real numbers.

## Irrational numbers

- Definition 0.27: An **irrational number** is a real number that is not rational.

## Complex numbers

- Definition 0.31: The **complex numbers** are those obtained by the non-negative real numbers upon rotation by any angle about the point 0. We write C for the set of all complex numbers.

![Complex number](<../cmu21127note1/Screenshot 2024-07-03 195150.png>)

- Addition corresponds to translation.
- Multiplication correspond to rotation.

**Omit complex conjugate here.**

# Polynomials

- Definition 0.32: Let S=N,Z,Q,R or C. A **(univariate) polynomial over** S in the **indeterminate** x is an expression of the form 
$a_0+a_1x+...+a_nx^n$
Where $n \in N$ and each $a_k \in S$. The numbers $a_k$ are called the **coefficients** of the polynomial. If not all coefficients are zero, the largest value of k for which $a_k \ne 0$ is called the **degree** of the polynomial. By convention, the degree of the polynomial 0 is $-\infinity$
- Definition 0.37: Let p(x) be a polynomial. A $root$ of p(x) is a complex number $\alpha$ such that $p(\alpha)=0$.
- Omit the theorem of complex conjugate root.

# Sets

- Axiom 2.1.22 (Sets extensionality)
 Let X and Y be sets. Then X = Y if and only if $\forall a, (a \in X \leftrightarrow a \in Y)$, or equivalently, if $X \sub Y$, and $Y \sub X$. 

- Definition 2.1.36
Let X be a set. The **power set** of X, written $\mathcal{P}(X)$, is the set of all subsets of X.

- Definition 2.2.8 
Let X and Y be sets. We say X and Y are **disjoint** if $X \cap Y$ is empty.

- Definition 2.2.18
An **(indexed) family of sets** is a specification of a set $X_i$ for each element i of some **indexing set** I. We write ${X_i | i \in I}$ for the indexed family of sets. 

- Definition 2.2.20
The **(indexed) intersection** of an indexed family ${X_i | i \in I}$ is defined by
$\bigcap_{i \in I} X_i = {a | \forall i \in I, a \in X_i}$
The **(indexed) union** of ${X_i | i \in I}$ is defined by
$\bigcup_{i \in I} X_i = {a | \exists i \in I, a \in X_i}$

- Definition 2.2.26
Let X and Y be sets. The **relative complement** of Y in X, denoted $X \setminus Y$, is defined by
$X \setminus Y = {x \in X | x \notin Y}$
The operation is also known as the **set difference** operation. Some authors write Y - X instead of $Y \setminus X$.

- Theorem 2.2.31 (De Morgan's Laws for sets)
Given sets A, X, Y and a family ${X_i | i \in I}$, we have
(a) $A \setminus (X \cup Y) = (A \setminus X) \cap (A \setminus Y)$
(b) $A \setminus (X \cap Y) = (A \setminus X) \cup (A \setminus Y)$
(c) $A \setminus \bigcup_{i \in I} X_i = \bigcap_{i \in I}(A \setminus X_i)$
(d) $A \setminus \bigcap_{i \in I} X_i = \bigcup_{i \in I}(A \setminus X_i)$

- Definition 2.2.33
Let X and Y be sets. The **(pairwise) cartesian product** of X and Y is the set $X \times Y$ defined by
$X \times Y = {(a, b) | a \in X \wedge b \in Y}$
The elements $(a,b) \in X \times Y$ are called **ordered pairs**, whose defining property is that, for all $a, x \in X$ and all $b, y \in Y$, we have $(a, b) = (x, y)$ if and only if a = x and b = y.

- Definition 2.2.38
Let $n \in \mathbb{N}$ and let $X_1, X_2, ..., X_n$ be sets. The $(n-fold)cartesian product$ of $X_1, X_2, ..., X_n$ is the set $\prod_{k=1}^{n} X_k$ defined by
$\prod_{k=1}^{n} = {(a_1, a_2, ..., a_n) | a_k \in X_k, 1 \le k \le n}$
The elements $(a_1, a_2, ..., a_n) \in \prod_{k=1}^{n} X_k$ are called $ordered k-tuples$, whose defining property is that, for all $1 \le k \le n$ and all $a_k, b_k \in X_k$, we have $(a_1, a_2, ... ,a_n) = (b_1, b_2, ..., b_n)$ if and only if $a_k = b_k$ for all $1 \le k \le n$. 
Given a set X, write $X^n$ to denote the set $\prod_{k=1}^{n}X$. We might on occasion also write 
$X_1 \times X_2 \times ... \times X_n = \prod_{k=1}^{n}X_k$

- Definition 9.2.1 
Let $A \subseteq \mathbb{R}$. A real number m is an **upper bound** for A if $a \le m$ for all $a \in A$. A **supremum** of A is a least upper bound of A; that is, a real number m such that:
(i) m is an upper bound of A——that is, $a \le m$ for all $a \in A$; and
(ii) m is least amongst all upper bounds for A——that is, for all $x \in \mathbb{R}$, if $a \le x$ for all $a \in A$, then $x \le m$.

- Theorem 9.2.5(Uniqueness of suprema)
Let A be a subset of $\mathbb{R}$. If $m_1$ and $m_2$ are suprema of A, then $m_1 = m_2$.

- Axiom 9.2.7 (Completemess axiom)
Let $A \subseteq \mathbb{R}$ be inhabited. If A has an upper bound, then A has a supremum.

- Definition 9.2.8
If $f: X \to \mathbb{R}$ is a funciton and X is an arbitrary set, we define
$sup f(x) := sup{f(x) : x \in X}$
whenever the sup on RHS exists.

- Definition 9.2.9
Let $n \in \mathbb(N), n \ge 1$, we define the n-dimensional Euclidian space $\mathbb{R}^n$ as follows: 
$\prod_{i = 1}^{n}\mathbb{R} = \mathbb{R}^n := {(x_1, x_2, x_n) : x_i \in \mathbb{R}, \forall i \in {1, ..., n}}$

- Definition 9.2.10
Let $\vec{x}, \vec{y} \in \mathbb{R}^n$ and $\lambda \in \mathbb{R}$, we define 
(sum) $\vec{x} + \vec{y} = (x_1 + y_1, ... ,x_n + y_n)$
(multiplication by scalar) $\lambda \vec{x} = (\lambda x_1, ..., \lambda x_n)$
obs: The definition above does not say anything about multiplying vectors by another vector. 

- Definition 9.2.11
Let $\vec{x}, \vec{y} \in \mathbb{R}^n$. The scalar or dot product of $\vec{x}$ and $\vec{y}$ is the real number defined as
$\vec{x} \dot \vec{y} = <\vec{x}, \vec{y}> := \sum_{i=1}^{n}x_i y_i = x_1y_1 + ... + x_ny_n$

- Proposition 9.2.12
For any $\vec{x} \in \mathbb{R}^n$, we have: $||\vec{x}||^2 = \vec{x} \dot \vec{x}$

- Theorem 9.2.13
Let $\vec{x}, \vec{y} \in \mathbb{R}^n$. Then $\vec{x} \dot \vec{y} = ||\vec{x}||||\vec{y}||cos\theta$
The latter theorem says that vector x is orthogonal to vector y if and only if their scalar product is zero.

- Theorem 9.1.16 (Cauchy-Schwarz inequality)
Let $n \in \mathbb{N}$ and let $x_i, y_i \in \mathbb{R}$ for each $i \in [n]$. Then
$|\vec{x} \dot \vec{y}| \le ||\vec{x}||||\vec{y}||$
with equality if and only if $a \vec{x} = b\vec{y}$ for some $a, b \in \mathbb{R}$ which are not both zero.

- Theorem 9.2.17 (Triangle inequality)
Let $\vec{x}, \vec{y} \in \mathbb{R}^n$. Then $|| \vec{x} + \vec{y} || \le ||\vec{x}|| + ||\vec{y}||$
Equality holds if and only if $a\vec{x} = b\vec{y}$ for some $a, b \in \mathbb{R}$ which are noth zero and $a, b \ge 0$

- Theorem 9.2.18 (Parallelogram law)
Given $\vec{x}, \vec{y} \in \mathbb{R}^n$, we have 
$||\vec{x} + \vec{y}||^2 + ||\vec{x} - \vec{y}||^2 = 2||\vec{x}||^2 + 2||\vec{y}||^2$
Moreover, if $\vec{x}$ is orthogonal to $\vec{y}$, then (Pitagoras theorem) 
$||x - y||^2 = ||x||^2 + ||y||^2$

- Definition 9.1.20
Let $n \ge 1$. The **(arithmetic) mean** of real numbers $x_1, ..., x_n$ is
$\frac{1}{n}\sum_{i=1}^{n}x_i = \frac{x_1 + x_2 + ... + x_n}{n}$

- Definition 9.1.21
Let $n \ge 1$. The **geometric mean** of non-negative real numbers $x_1, ..., x_n$ is
$\sqrt[n]{\prod_{i=1}^{n}x_i} = \sqrt[n]{x_1 \dot x_2 \dot ... \dot x_n}$

- Theorem 9.1.22 (Inequality of arithmetic and geometric means)
Let $n \in \mathbb{N}$ and $x_1, x_2, ..., x_n \ge 0$. Then
$\sqrt[n]{x_1 \dot \dot \dot x_n} \le \frac{x_1 + ... + x_n}{n}$
with equality if and only if $x_1 = ... = x_n$

- Theorem 9.1.31 (Inequality of geometric and harmonic means)
let $n \in \mathbb{N}$ and $x_1, x_2, ..., x_n \gt 0$. Then
$\frac{n}{\frac{1}{x_1} + frac{1}{x_2} + ... + frac{1}{x_n}} \le \sqrt[n]{x_1x_2 \dot \dot \dot x_n}$

- Theorem 9.1.34 (Inequality of quadratic and arithmetic means)
Let $n \gt 0$ and $x_1, x_2, ..., x_n \ge 0$. Then
$\frac{x_1 + ... + x_n}{n} \le \sqrt{\frac{x_1^2 + x_2^2 + ... + x_n^2}{n}}$
with equality if and only if $x_1 = ... = x_n$. 

