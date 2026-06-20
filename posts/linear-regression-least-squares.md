---
title: Linear Regression — Least Squares from Scratch
date: 2024-08-14
tags: [Machine Learning, Math, Python]
excerpt: A from-scratch derivation of ordinary least squares, with vectorized NumPy code and a worked example on the Olympic 100m dataset.
---

## Motivation

Linear regression is the simplest supervised learning model: given input attributes $x$ and targets $t$, we want to learn a function

$$
t = f(x) = w_0 + w_1 x
$$

that minimizes the average squared error over $N$ training samples:

$$
\mathcal{L} = \frac{1}{N} \sum_{n=1}^{N} \left( t_n - f(x_n; w_0, w_1) \right)^2
$$

## Vectorized Form

With more than two parameters, scalar notation becomes unwieldy. Let $\mathbf{w}$ be a $k \times 1$ vector of weights and $\mathbf{x}$ a $k \times 1$ vector of features. The model becomes

$$
t = \mathbf{w}^\top \mathbf{x}, \qquad
\mathcal{L} = \frac{1}{N} \sum_{n=1}^{N} \left( t_n - \mathbf{w}^\top \mathbf{x}_n \right)^2
$$

Stacking all $N$ samples into a design matrix $\mathbf{X} \in \mathbb{R}^{N \times k}$ and targets into $\mathbf{t} \in \mathbb{R}^{N}$, the loss collapses to

$$
\mathcal{L} = \frac{1}{N} \left( \mathbf{t} - \mathbf{X}\mathbf{w} \right)^\top \left( \mathbf{t} - \mathbf{X}\mathbf{w} \right)
$$

Taking the gradient with respect to $\mathbf{w}$ and setting it to zero yields the **normal equations**:

$$
\nabla_{\mathbf{w}} \mathcal{L} = -\frac{2}{N} \mathbf{X}^\top \left( \mathbf{t} - \mathbf{X}\mathbf{w} \right) = 0
\quad \Longrightarrow \quad
\mathbf{w} = \left( \mathbf{X}^\top \mathbf{X} \right)^{-1} \mathbf{X}^\top \mathbf{t}
$$

## NumPy Implementation

Here is a compact, fully vectorized implementation:

```python
import numpy as np

def least_squares(X, t):
    """
    Solve ordinary least squares via the normal equations.
    X: (N, k) design matrix (no bias column needed — we add it)
    t: (N,) targets
    Returns: w (k+1,) weights including bias
    """
    # Add bias term x0 = 1
    Xb = np.hstack([np.ones((X.shape[0], 1)), X])
    # Normal equations: w = (X^T X)^{-1} X^T t
    w = np.linalg.inv(Xb.T @ Xb) @ Xb.T @ t
    return w

def predict(X, w):
    Xb = np.hstack([np.ones((X.shape[0], 1)), X])
    return Xb @ w
```

## Worked Example: Olympic 100m

Using gold-medal times from 1896–2000, we fit a line and predict 2004–2016:

```python
years = np.array([1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928,
                  1932, 1936, 1948, 1952, 1956, 1960, 1964, 1968,
                  1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000])
times = np.array([12.0, 11.0, 11.0, 10.8, 10.8, 10.8, 10.6, 10.8,
                  10.3, 10.3, 10.3, 10.4, 10.5, 10.2, 10.0, 9.95,
                  10.14, 10.06, 10.25, 9.99, 9.92, 9.96, 9.84, 9.87])

X = years.reshape(-1, 1)
w = least_squares(X, times)

for y in [2004, 2008, 2012, 2016]:
    print(f"{y}: predicted {predict([[y]], w)[0]:.2f}s")
```

The fitted slope $w_1 \approx -0.014$ suggests the record drops by about 1.4 milliseconds per year — a useful, if naive, baseline.

## Caveats

- The normal equations require $\mathbf{X}^\top \mathbf{X}$ to be invertible; use the pseudo-inverse $\mathbf{X}^+$ for rank-deficient cases.
- Linear extrapolation fails eventually: the model predicts negative times in the distant future.
- For large $N$, solving via QR or SVD is numerically more stable than explicitly inverting $\mathbf{X}^\top \mathbf{X}$.

> Derivation adapted from my earlier notes on linear regression. The full C++ version is in the original post.
