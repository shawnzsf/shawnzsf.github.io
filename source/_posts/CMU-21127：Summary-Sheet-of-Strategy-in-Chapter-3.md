---
title: CMU 21127：Summary Sheet of Strategy in Chapter 3-6
date: 2024-07-17 22:32:47
tags: Course Notes
categories: Math
abbrlink: cmu21127note3
description: Very useful proof strategy summary in Chapter 3-6 of CMU 21-127 Concepts of Mathematics. 
---

1. Strategy 3.1.5 (Proving two functions are equal)
Given functions $f, g: X \to Y$ with the same domain and codomain, in order to prove that $f=g$, it suffices to prove that $f(x)=g(x)$ for all $x \in X$.

2. Strategy 3.1.27 (Proving set identities using characteristic functions)
In order to prove that two subsets U and V of a set X are eq    ual, it suffices to prove that $\chi_{U} = \chi_{V}$. 

3. Strategy 3.2.2 (Proving a function is injective)
In order to prove that a function $f: X \to Y$ is injective, it suffices to fix, $a, b \in X$, assume that $f(a) = f(b)$, and then derive $a=b$.
s
4. Strategy 3.2.10 (Proving a function is surjective)
To prove that a function $f: X \to Y$ is surjective, it suffices to take an aribitrary element $y \in Y$ and, in terms of y, find an element $x \in X$ such that $f(x) = y$. 
In order to fiind x, it is often useful to start from the equation $f(x) = y$ and derive some possible values of x. But be careful——in order to complete the proof, it is necessary to verify that the equation $f(x) = y$ istrue for the chosen value of x. 

5. Strategy 3.2.10.5 (Proving a function is bijective)
To prove that a function f is bijective, prove that it is injective and surjective.

6. Strategy 3.2.26 (Proving a functio is injective by finding a left inverse)
In order to prove that a function $f: X \to Y$ is injective, it suffices to find a function $g: Y \to X$ such that $g(f(x)) = x$ for all $x \in X$.

7. Strategy 3.2.32 (Proving a function is surjective by finding a right inverse)
In order to prove that a function $f: X \to Y$ is surjective, it suffices to find a function $g: Y \to X$ such that $f(g(y)) = y$ for all $y \in Y$. 

8. Strategy 4.1.3 (Definition by recursion)
In order to specify a function $f: \mathbb{N} \to X$, it suffices to define $f(0)$ and, for given $n \in \mathbb{N}$, assume that $f(n)$ has been defined, and define $f(s(n))$ in terms of $n$ and $f(n)$, where $s(n)$ is the successor function.

9. Strategy 4.2.2 (Proof by (weak) induction)
In order to prove a proposition of the form $\forall n \ge n_0,p(n)$, it suffices to prove that:
- $p(n_0)$ is true, and
- For all $n \ge n_0$, if $p(n)$ is true, then $p(n+1)$ is true.
Some terminology has evolved for proofs by induction:
- The proof of $p(n_0)$ is called the **base case**.
- The proof of $\forall n \ge n_0, (p(n) \rightarrow p(n+1))$ is called the **induction step**.
- In the induction step, the assumption $p(n)$ is called the **induction hypothesis**;
- In the induction step, the proposition $p(n+1)$ is called the **induction goal**.

10. Strategy 4.3.3 (Proof by strong induction)
In order to prove a proposition of the form $\forall n \ge n_0, p(n)$, it suffices to prove that: 
- (**Base case**) $p(n_0)$ is true; and
- (**Inductio step**) For all $n \ge n_0$, if $p(k)$ is true for all $n_0 \le k \le n$, then $p(n+1)$ is true.

11. Strategy 4.3.6 (Proof by strong induction with multiple base cases)
In order to prove a statement of the form $\forall n \ge n_0, p(n)$, it suffices to prove that:
- (**Base cases**) $p(k)$ for all $k \in {n_0, n_0 + 1, ..., n_1}$, where $n_1 \gt n_0$; and
- (**Induction step**) For all $n \ge n_1$, if $p(k)$ is true for all $n_0 \le k \le n$, then $$p(n+1)$$ is true.

12. Strategy 6.1.2 (Proving that a set is finite)
In order to prove that a set X is finite, it suffices to find a bijection $[n] \to X$ for some $n \in \mathbb{N}$.

13. Strategy 6.1.16 (Comparing the sizes of finite sets)
Let X and Y be finite sets. 

(a) In order to prove that $[X] \le [Y]$, it suffices to find an injection $X \to Y$.
(b) In order to prove that $[X] \ge [Y]$, it suffices to find a surjection $X \to Y$.
(c) In order to prove that $[X] = [Y]$, it suffices to find a bijection $X \to Y$. 

Strategy (c) is commonly known as **bijective proof**. 

14. Strategy 6.2.18(Cantor's diagonal argument)
In order to prove that a set X is uncountable, it suffices to prove that no function $f: \mathbb{N} \to X$ is surjective using the following argument: given a function $f: \mathbb{N} \to X$, find an element $b \in X$ that "disagrees" with each value $f(n)$ about some statement involving n.

15. Proposition (Helpful to Prove Supremums)
Let $A \subset R$ and $m \in \mathbb{R}$ be an upper bound of A, we have
$m = sup(A) \leftrightarrow \forall \epsilon \in \mathbb{R}, \epsilon > 0 \rightarrow[\exists a \in A, a > m - \epsilon ]$
