---
title: "My Journey Into Static Single Assignment With The Go Compiler"
heading: "My Journey Into Static Single Assignment With The Go Compiler"
description: ""
summary: "Contributing to the Go compiler is within everyone's reach. This post describes the most important aspects of Static Single Assignment, rewrite rules and some specific incantations to hack on the Go compiler."
slug: ssa-rewrite-rules
date: 2021-09-24T12:00:00-05:00
categories:
    - "go"
author: Alejandro García Montoro
github: agarciamontoro
community: alejandro.garcia
---

Trying to understand a compiler is a daunting-looking endeavor. The code-bases are usually large, the algorithms used may be obscure, and the nature of such a generic tool is inherently complex. But, as with all projects, big and small, the easiest way to start with them is to pick a single piece and dissect it until it is simple enough to grasp.

When I made [my first ever contribution to the Go compiler](/blog/optimizing-go-compiler-1), I knew nothing about it, and I had to learn about seemingly complex concepts such as Static Single Assignment (SSA) and rewrite rules. While I did not become an expert at all, I learned the bits I needed to solve the issue in hand. This blog post is the result of my trying to condense that (still superficial) knowledge in written form.

# Understanding the compiler

Essentially, a compiler is a translator: it converts a piece of code in a language (in our case, Go) to an equivalent piece of code in another language (in our case, assembly code, whose specific instructions depend on the specific architecture we want to run the executable in). Hopefully, the meaning of what we wrote in Go (the behavior of our program), is maintained throughout the process of translation.

In the Go compiler, this complex process is divided into phases. There are _a lot_ of them, and we will not discuss the whole structure in this blog post---see [`cmd/compile/README.md`](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/README.md) for a high-level view of the phases, and take a look directly [at the code](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/internal/ssa/compile.go#L426-L481) to see the complete list---. We will instead focus on one of the last phases, which converts the so-called Static Single Assignment (SSA) form into the final assembly instructions, that depend on the architecture we are compiling for.

# Static Single Assignment

SSA is an intermediate generic representation of the code, which makes it easier to apply some optimizations before going too low-level into the architecture-specific instructions. There are great resources about SSA out there: Make sure to read [the documentation](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/README.md) and, if you have time, go and see [this 30 minute talk](https://www.youtube.com/watch?v=uTMvKVma5ms), which is a great introduction to the topic.

For the purpose of this post, we need to know that SSA is a representation of the original code with a simple rule: **every value is assigned only once**, although it can be used any number of times.

Let's take a look at a first example. Let's say we have the following piece of (very absurd) Go code:

```go
var c uint8 = a + b
c = c - b
```

This can be represented in SSA as something like:

```
v4 = Add8 <uint8> v2 v3
v5 = Sub8 <uint8> v4 v3
```

In this case, `v2` is a _value_ that represents the variable `a`, while `v3` is a value representing the variable `b`. We store its addition---represented by the operator `Add8` with type `uint8`--- into the new value `v4`.

Then, in the second line of the original code, we reassign `c`. But remember: every value in SSA is assigned **only once**. Thus, in SSA, we generate a new value `v5`, that will contain `c` (`v4`) minus `b` (`v3`).

The best way to learn about SSA is generating it ourselves. Thankfully, this is one shell command away. Whenever you are building or running a piece of Go code, tell the compiler that you want to read the generated SSA by setting the env variable `GOSSAFUNC` to the name of the function you want to investigate. The command looks something like:

```sh
GOSSAFUNC=myFunction go build myfile.go
```

This outputs a `ssa.html` file, in the same directory where you ran the command, that you can open with your browser. It looks like this:

![Screenshot of the SSA page](/blog/2021-09-24-ssa-rewrite-rules/ssa.png)

That's a whole lot of information. I agree. But we can focus on what's interesting for us.

The page shows the output of every phase of the compilation, once SSA is generated, in collapsible columns. To make things easier, the page is interactive: try clicking on a value and see how the uses of that value are highlighted in the same color. This does not only happen within the same column: If you look at the previous or next columns, you can also quickly see how that value is being modified by the different phases of the compilation (or if it's left untouched). You can do the same thing with blocks (the labels starting with `b`), which are isolated series of values in the control flow graph of the function.

# Rewrite rules

One of the benefits of using SSA is that it is easy to match common patterns and rewrite them with optimized versions. For example, let's say that we have the following Go code:

```go
var five = 5
var a = five * 16
```

We can compute the value of `a` by literally making the multiplication `5 times 16`. But it is known that multiplication instructions are quite CPU-expensive. What if we could optimize this line of code by avoiding the multiplication?

It turns out we can, because `16` is a power of `2`. And as doubling is the same as applying a single left shift, we can see that multiplying by `2^n` is the same as shifting the number to the left `n` places:

```
00000101 // 5
01010000 // 5*(2^4) = 80
```

Knowing that multiplying by a power of two is the same as shifting to the left, and that the shifting instruction is way faster than the multiplication instruction, we simply need to make sure that the compiler converts every line of Go code with a multiplication by a power of two constant into a left shift.

And that's exactly what the rewrite rules are for! You can take a look at [the specific syntax of the rules](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/rulegen.go#L37-L60) but, in short, they contain:

1.  A matching pattern, with an optional boolean condition preceded by `&&`
2.  A right arrow `=>`
3.  A new instruction that will override the matched pattern

There are several rules to cover the conversion of multiplications by powers of two into left shifts in the [`generic.rules` file](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/generic.rules#L172-L180). Let's take a look only at the first one, as all the others are identical in structure:

```
(Mul8 <t> n (Const8 [c])) && isPowerOfTwo8(c)
=>
(Lsh8x64 <t> n (Const64 <typ.UInt64> [log8(c)]))
```

We can see all the parts of a normal rule here:

-   The matching pattern, `(Mul8 <t> n (Const8 [c]))`, which matches every multiplication instruction of a variable `n` by a constant `c`.
-   The boolean condition, `isPowerOfTwo8(c)`, which restricts the pattern to those multiplications where the constant `c` is a power of two.
-   The new instruction, `(Lsh8x64 <t> n (Const64 <typ.UInt64> [log8(c)]))`, which shifts `n` to the left a constant number of places defined by `log(c)`.

To actually understand what this rule is doing we need to understand every instruction in it. This is not difficult if you know where to look.

The best place to start is the `generic.rules` file, which contains [an introduction to the syntax of the rules](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/generic.rules#L18-L32). The important part for us is the following comment:

```go
// values are specified using the following format:
// (op <type> [auxint] {aux} arg0 arg1 ...)
// the type, aux, and auxint fields are optional
// on the matching side
//  - the type, aux, and auxint fields must match if they are specified.
//  - the first occurrence of a variable defines that variable.  Subsequent
//    uses must match (be == to) the first use.
//  - v is defined to be the value matched.
//  - an additional conditional can be provided after the match pattern with "&&".
// on the generated side
//  - the type of the top-level expression is the same as the one on the left-hand side.
//  - the type of any subexpressions must be specified explicitly (or
//    be specified in the op's type field).
//  - auxint will be 0 if not specified.
//  - aux will be nil if not specified.
```

Out of all that specification, the most interesting part is to see how we can specify SSA values: `(op <type> [auxint] {aux} arg0 arg1 ...)`. Every value contains an opcode, which is the part of the instruction that specifies what to do, three optional fields (the type, an auxiliary integer and auxiliary argument) and finally the arguments for the opcode specified. If you want to know how these values are actually implemented in the code, look at [the `type Value struct` definition](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/value.go#L17-L63).

Let's focus on the matching part of our sample instruction, `Mul8 <t> n (Const8 [c])`, and try to dissect it:

-   The first thing we see, `Mul8`, is the opcode of this instruction. This opcode is defined in the [genericOps.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/genericOps.go#L41), and it specifies what it does: it performs the multiplication of the two arguments it receives.
-   Then we have a generic type `<t>`.
-   Then we see the two arguments that `Mul8` is expecting:
    -   A variable `n`, which matches any value.
    -   The value `(Const8 [c])`, which we can inspect by reading its definition, again in the [genericOps.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/genericOps.go#L317). As we see, this opcode simply defines an 8-bit (hence the suffix) constant value, which is stored in its `auxint` field. In this case, we are matching any constant `c`.

So, after all, what this pattern matches is any multiplication of a variable `n` times an 8-bit constant `c`. That's it!

But we were trying to match multiplications that involved a constant that had to be a power of two, right? That is what we achieved with the boolean condition `isPowerOfTwo8(c)`, which is a simple Go function defined in the [rewrite.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/rewrite.go#L462-L465). That function returns true when its single `int8` argument is a power of two.

Ok, so that's it for the matching pattern of this instruction. What about the instruction we're generating instead? `Lsh8x64 <t> n (Const64 <typ.UInt64> [log8(c)])` is not much more difficult to understand:

-   Again, the first thing we have is the opcode, `Lsh8x64`. This opcode, which specifies a **L**eft **sh**ift, is defined in the [genericOps.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/genericOps.go#L115), which also describes what the `8x64` suffix means: what we are shifting is an 8-bit value, and the amount of places to shift is specified by a 64-bit constant.
-   Then we have the generic type `<t>`.
-   And finally the two arguments expected by this opcode:
    -   The variable `n` defined in the matching pattern.
    -   The 64-bit constant (of type unsigned integer of 64 bits) `log8[c]`. `c` is the constant defined in the matching pattern, and the `log8` function is again a plain Go function defined in [the rewrite.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/rewrite.go#L441-L445): it returns the logarithm base 2 of its 8-bit argument.

So this instruction shifts the variable `n` to the left as many places as specified by the logarithm base 2 of `c`, which is exactly what we wanted!

Stitching all together, we see that we have a rewrite rule that replaces every multiplication by a power of two constant with a semantically equivalent left shift, making the operation much faster, and everyone running the program much happier.

Cool, we've dissected and understood a whole rewrite rule, understanding a bit how SSA is implemented. We even know a bunch of interesting files to consult, such as `genericOps.go`, `rewrite.go` `generic.rules` or `rulegen.go`. So... what's next?

# Connecting it all together

In order to actually familiarize ourselves with SSA, the best thing we can do is to set up the development environment for the Go compiler and start hacking on it. I encourage you to read the official [documentation](https://golang.org/doc/contribute): it's comprehensive and easy to understand. There are some particularities to the process, but it's generally straightforward.

For SSA, there's a specific detail worth describing: how the rules are converted into the code used by the compiler to apply them.

Although the rules live in a series of `.rules` files, the actual code used to match and apply them is normal Go code. For example, the rules for AMD64 are declared in the file [`src/cmd/compile/internal/ssa/gen/AMD64.rules`](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/AMD64.rules), but the automatically generated code that applies those rules live in [`src/cmd/compile/internal/ssa/rewriteAMD64.go`](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/rewriteAMD64.go).

How is this code generated? Well, this is again one shell command away, which we need to run every time we change any of the `.rules` files. From the Go repository, run:

```sh
cd src/cmd/compile/internal/ssa/gen/
go run *.go
```

This will get all the `.rules` files and generate the corresponding code in the `.go` files.

And of course, every time we change the compiler code (as we did with the previous command), we need to compile the compiler. Doing it is as trivial as calling a script:

```sh
cd src/
./make.bash
```

Once this finishes, make sure that the subsequent calls to the `go` command are using the recently created binary:

```sh
cd bin/
export PATH=`pwd`:$PATH
```

If everything was correctly setup, you should see your local Go directory when doing `which go`.

And last, but not least, when you've applied your changes, you'll want to know that you didn't break anything else, so you should run the whole test suite! Doing so is again one script call away:

```sh
cd src/
./all.bash
```

# Conclusion

This was a very basic introduction to SSA and rewrite rules. There is a whole lot more to them that I described here, but this information should allow you to go out and continue investigating the interesting world of compilers.

If you want to continue learning about rewrite rules and study a specific application of them, make sure to read my series on the investigation of the very first issue I fixed in Go: [Fixing a bug in the Go compiler as a newbie: a deep dive](/blog/optimizing-go-compiler-2). After all, it was there where I started learning about SSA.
