---
title: CMU 21127：Summary Sheet of Strategy in Chapter 1-2
date: 2024-07-11 18:58:05
tags: Course Notes
categories: Math
abbrlink: cmu21127note2
description: Very useful proof strategy summary in Chapter 1-2 of CMU 21-127 Concepts of Mathematics. 
mathjax: true
---

1. Strategy 1.1.7 (Proving conjunctions)
A proof of the proposition $p \wedge q$ can be obtained by tying together two proofs, one being a proof that p is true and one being a proof that q is true. 

2. Strategy 1.1.9 (Assuming conjunctions)
If an assumption in a proof has the form $p \wedge q$, then we may assume p and assume q in the proof. 

3. Strategy 1.1.13 (Proving disjunctions)
In order to prove a proposition of the form $p \vee q$, it suffices to prove just one of p or q.

4. Strategy 1.1.16 (Assuming disjunctions——proof by cases)
If an assumption in a proof has the form $p \vee q$, then we may derive a proposition r by splitting into two cases: first, derive r from the temporary assumption that p is true, and then derive r from the assumption that q is true.

5. Strategy 1.1.22 (Proving implications)
In order to prove a proposition of the form $p \Rightarrow q$, it suffices to assume that p is true, and then derive q from that assumption.

6. Strategy 1.1.25 (Assuming implications——modus ponens)
If an assumption in a proof has the form $p \Rightarrow q$, and p is also assumed to be true, then we may deduce that q is true.

7. Strategy 1.1.38 (Proving negations——proof by contradiction)
In order to prove a proposition p is false (that is, that $\neg p$ is true), it suffices to assume that p is true and derive a contradiction.

8. Strategy 1.1.43 (Assuming negations)
If an assumption in a proof has the form $\neg p$, then any derivation of p leads to a contradiction.

9. Strategy 1.1.45 (Using the law of excluded middle)
In order to prove a proposition q is true, it suffices to split into cases based on whether some other proposition p is true or false, and prove that q is true in each case.

10. Strategy 1.2.10 (Proving universally quantified statements)
To prove a proposition of the form $\forall x \in X, p(x)$, it suffices to prove p(x) for an arbitrary element $x \in X$——in other words, prove p(x) whilst assuming nothing about the variable x other than that it is an element of X. 

11. Strategy 1.2.16 (Assuming universally quantified statements)
If an assumption in a proof has the form $\forall x \in X, p(x), then we may assume that p(a) is true whenever a is an element of X. $

12. Strategy 1.2.18 (Proving existentially quantified statements)
To prove a proposition of the form $\exists x \in X, p(x)$, it suffices to prove p(a) for some specific element $a \in X$, which should be explicitly defined. 

13. Strategy 1.2.24 (Assuming existentially quantified statements)
If an assumption in the proof has the form $\exists x \in X, p(x)$, then we may introduce a new variable $a \in X$ and assume that p(a) is true. 

14. Strategy 1.2.29 (Proving unique-existentially quantified statements)
A proof of a statement of the form $\exists !x \in X, p(x)$, consists of two parts:
- Existence: Prove that $\exists x \in X, p(x) is true. $
- Uniqueness: let $a, b \in X$ assume that p(a) and p(b) are true, and derive a = b.
Alternatively, prove existence to obtain a fixed $a \in X$ such that p(a) is true, and then prove $\forall x \in X, [p(x) \Rightarrow x = a]$.

15. Strategy 1.3.11 (Logical equivalence using truth tables)
In order to prove that propositional formulae are logically quivalent, it suffices to show that they have identical columns in a truth table. 

16. Strategy 1.3.16 (Proof by contradiction (direct version))
In order to prove a proposition p is true, it suffices to assume that p is false and derive a contradiction.

17. Strategy 1.3.20 (Proof by contraposition)
In order to prove a proposition of the form $p \Rightarrow q$, it suffices to assume that q is false and derive that p is false. 

18. Strategy 1.3.29 (Proof by counterexample)
To prove that a proposition of the form $\forall x \in X$, p(x) is false, it suffices to find a single element $a \in X$ such that p(a) is false. The element a is called a counterexample to the proposition $\forall x \in X$, p(x). 

19. Strategy 1.3.40 (Assuming tautologies)
Let p be a proposition. Any tautology may be assumed in any proof of p. 

20. Strategy 2.1.5
Let X be a set and let p(x) be a logical formula with free variable $x \in X$. In order to prove $a \in {x \in X | p(x)}$, it suffices to prove $a \in X$ and that p(a) is true. 

21. Strategy 2.1.15 (Proving a subset containment)
In order to prove that a set U is a subset of a set X, it suffices to take an arbitrary element $a \in U$ and prove that $a \in X$. 

22. Strategy 2.1.23 (Proof by double containment)
In order to prove that a set X is equal to a set Y, it suffices to:
- Prove $X \subseteq Y$, i.e. let $a \in X$ be an arbitrary element, and derive $a \in Y$; and then
- Prove $X \supseteq Y$, i.e. let $a \in Y$ be an arbitrary element, and derive $a \in X$. 
We often write "($\subseteq$)" and "($\supseteq$)" to indicate the direction of the containment being proved. 

23. Strategy 2.1.28 (Proving that a set is inhabited or empty)
In order to prove a set X is inhabited, it suffices to exhibit an element. In order to prove a set X is empty, assume that X is inhabited——that is, that there is some element $a \in X$——and derive a contradiction. 

24. General Tips:
- Use parentheses to avoid confusion wien the order of operations ordere is ambiguous.
- "if" and "only if"
    - only if A, then B, arrow to the right
    - if A, then B, arrow still to the right
- Pay attention to language that implies exists and for all, you will need to add those two quantifiers in this case, even it is not explicitly specified. 
- The sequence of quantifiers matters, define values according to the sequence. 
- In "plain english" doesn't mean directly translate the logical formula, but find a way to express the logic it implies, usually one sentence is good.
- Technically, you can use the handy propostions proved in class in your proof. However, since there is huge amount of trivial things you need to remember if you are actually doing this, I would recommend memorizing few definitions and theorems, which will allow you to do a quick lemma through strategies above. 
- $\not (p \rightarrow (q \wedge r)) \leftrightarrow p \wedge ((\not q) \vee (\not r))$
- Remember to connect each step with $\leftrightarrow$ or "is equivalent to" if you want to use both directional logic to claim set extensionality. 
