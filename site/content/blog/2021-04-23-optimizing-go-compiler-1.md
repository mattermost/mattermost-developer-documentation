---
title: "Fixing a bug in the Go compiler as a newbie: a deep dive (I)"
heading: "Fixing a bug in the Go compiler as a newbie: a deep dive (I)"
description: ""
summary: "Contributing to the Go compiler is within everyone's reach. The first part of this series of posts defines the issue we are going to investigate, and introduces the parts of the Go compiler involved in its fix. We will learn about Static Single Assignment, rewrite rules and some specific incantations to hack on the Go compiler."
slug: optimizing-go-compiler-1
date: 2021-04-23T12:00:00-05:00
categories:
    - "go"
author: Alejandro García Montoro
github: agarciamontoro
community: alejandro.garcia
---

[bf48163e8f2b604f3b9e83951e331cd11edd8495](https://github.com/golang/go/commit/bf48163e8f2b604f3b9e83951e331cd11edd8495). That is the hash of one of the 48371 commits that, at the time of this writing, build the whole Git history of the Go compiler. It is definitely not the most important commit there, and most of the other ones probably deserve way more attention. But I like `bf48163`. It is a good commit, I think. I may be a bit biased, of course, as it is my first contribution to Go.

Not only that, it is my first contribution _ever_ to any compiler!

What's really interesting here is that I am not an expert in Go---nor in compilers in general---at all. Sure, I know my way through the language to write software using it, but I had never thought I would be able to modify the compiler itself.

And that is why I wrote this, to let you know that fixing a bug in a compiler is not only meant for a few chosen ones, but within reach of anyone.

Although this was conceived as a single post, it got a little bit out of hand, so I decided to split it in three:

-   Part 1: What the bug looks like, and an introduction to some parts of the Go compiler.
-   [Part 2](/blog/optimizing-go-compiler-2): what the bug actually is.
-   [Part 3](/blog/optimizing-go-compiler-3): how to fix the bug.

Don't get discouraged by the length of the content: It doesn't correlate with the complexity of the issue, but with the level of detail I tried to use when explaining it. I wanted to make sure I explained the ins and outs of how I approached the fix, and I don't assume any knowledge about compilers from the reader, so I tried to discuss everything chapter and verse.

Enough with the intro, let's start!

# I'd like to work on this one!

Back in September 2020, my colleague [Agniva](https://github.com/agnivade) posted [a message in the Go channel](https://community.mattermost.com/core/pl/pd74uyf1z7rr9d46jfrww581na), where the Mattermost community hangs out to discuss all things Go, inviting people to start contributing to the compiler. He posted links to three issues in the Go project, one of which was [issue #41663](https://github.com/golang/go/issues/41663).

Agniva told that this issue was "particularly suitable for newcomers looking to get started". That's me!, I said. I am a newcomer, and I am looking to get started. After double checking with him that "newcomer" meant someone that knew nothing about compilers, I picked it up, which was as easy as writing "[I'd like to work on this one!](https://github.com/golang/go/issues/41663#issuecomment-699878893)" on the issue itself.

So that was it. I had then committed to fix an issue I knew nothing about. Of course, I started regretting that decision the very moment after I hit Send. I know now that it was a great decision, but at that time it looked quite daunting.

# The issue

Ok, so let's dive into the issue itself. The bug in the compiler can be explained with the following function:

```go
import "encoding/binary"

func f(b []byte, x *[8]byte) {
	_ = b[8]
	t := binary.LittleEndian.Uint64(x[:])
	binary.LittleEndian.PutUint64(b, t)
}
```

The report said that this function compiled to a series of small `MOVx`, but that it could be optimized to use instead a couple of `MOVQ`: one for loading and one for storing.

If this sounds as gibberish, that's ok. Bear with me and we will get to what that sentence means. First, let's see what the function is supposed to do. To make things a bit easier, let's simply rewrite the variable names and add a couple of comments:

```go
import "encoding/binary"

func copyArrayToSlice(dest []byte, src *[8]byte) {
	_ = dest[8]                                // 1. bounds check
	temp := binary.LittleEndian.Uint64(src[:]) // 2. read the contents of the source array into temp
	binary.LittleEndian.PutUint64(dest, temp)  // 3. write the contents into the destiny slice
}
```

It is now more clear what the function does. It stores the contents of the second argument, the `src` array, into the first argument, the slice `dest`. It uses the [encoding/binary](https://golang.org/pkg/encoding/binary/) package for reading and writing the 8 bytes as an unsigned integer of 64 bits. For doing the copy, we use a temporary variable, `temp`.

The only weird line might be the first one, which is a bounds check. This forces the compiler to check that `dest[8]`, and, thus, all `dest[0]`, ..., `dest[7]`, are valid indices. We do that at the very beginning, so the compiler knows that all indices we are using in the copy are valid, for the whole scope of the function. We do not need to do such a check with `src`, because its length is known at compile time: 8 bytes.

So what's the bug? This is where things start to get interesting. The compiler is generating correct code, but it is not as optimized as it can be.

# Understanding the compiler

Before diving into the bug, let's pause for a bit to learn something more about how the Go compiler works.

Essentially, a compiler is a translator: it converts a piece of code in a language (in our case, Go) to an equivalent piece of code in another language (in our case, assembly code, whose specific instructions depend on the specific architecture we want to run the executable in). Hopefully, the meaning of what we wrote in Go (the behavior of our program), is maintained throughout the process of translation.

In the Go compiler, this complex process is divided into phases. There are _a lot_ of them, and we will not discuss the structure in this blog post---see [`cmd/compile/README.md`](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/README.md) for a high-level view of the phases, and take a look directly [at the code](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/internal/ssa/compile.go#L426-L481) to see the complete list---. We will instead focus on one of the last phases, which converts the so-called Static Single Assignment (SSA) form into the final assembly instructions, that depend on the architecture we are compiling for.

## Static Single Assignment

SSA is an intermediate generic representation of the code, which makes it easier to apply some optimizations before going too low-level into the architecture-specific instructions. SSA is a really interesting topic on its own, so make sure to read [the documentation](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/README.md) and, if you have time, go and see [this 30 minute talk](https://www.youtube.com/watch?v=uTMvKVma5ms), which is a great introduction to the topic.

For the purpose of these posts, we need to know that SSA is a representation of the original code with a simple rule: every value is assigned only once, although it can be used any number of times. The syntax of SSA is not particularly interesting, but we need to understand it for being able to follow the rest of the post.

Let's say we have the following piece of (very absurd) code:

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

The best way to learn about SSA is generating it ourselves. Thankfully, this is one shell command away. Whenever you are building or running a piece of Go code, tell the compiler that you want to read the generated SSA by setting the env variable `GOSSAFUNC` to the name of the function you want to investigate. It looks something like:

```sh
GOSSAFUNC=myFunction go build myfile.go
```

This outputs a `ssa.html` file, in the same directory where you ran the command, that you can open with your browser. It looks like this:

![Screenshot of the SSA page](/blog/2021-04-23-optimizing-go-compiler-1/ssa.png)

That's a whole lot of information. I agree. But we can focus on what's interesting for us. The page shows the output of every phase of the compilation, once SSA is generated, in collapsible columns. To make things easier, the page is interactive: try clicking on a value and see how the uses of that value are highlighted in the same color. This does not only happen within the same column: If you look at the previous or next columns, you can also quickly see how that value is being modified by the different phases of the compilation (or if it's left untouched). You can do the same thing with blocks (the labels starting with `b`), which are isolated series of values in the control flow graph of the function.

## Rewrite rules

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
(Mul8  <t> n (Const8  [c])) && isPowerOfTwo8(c)
=>
(Lsh8x64  <t> n (Const64 <typ.UInt64> [log8(c)]))
```

We can see all the parts of a normal rule here:

-   The matching pattern, `(Mul8 <t> n (Const8 [c]))`, which matches every multiplication instruction of a variable `n` by a constant `c`.
-   The boolean condition, `isPowerOfTwo8(c)`, which restricts the pattern to those multiplications where the constant `c` is a power of two.
-   The new instruction, `(Lsh8x64 <t> n (Const64 <typ.UInt64> [log8(c)]))`, which shifts `n` to the left `log(c)` places.

It's OK if you don't understand every specific detail of the instructions, we'll see them in detail a bit later in this post. Here, for example, we can note that the `8` suffixes make reference to the fact that this rule only matches multiplications of 8-bit variables. The other highlighted rules in the link to the `generic.rules` file cover the cases for variables of different bit widths.

For now, it's enough to understand that the rules match a specific pattern of instructions, and rewrite those instructions with a new one that's hopefully more efficient. Also, it is important to know that there are generic rules, as the one we just studied, which are applied regardless of the specific architecture we are compiling for, and architecture-specific rules, such as the ones in the [AMD64.rules file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/AMD64.rules), which take advantage of the specifics of each architecture, further optimizing the code.

## Connecting it all together

In order to investigate the issue and solve it, we'll need to set up the development environment for the Go compiler. I encourage you to read the official [documentation](https://golang.org/doc/contribute): it's comprehensive and easy to understand. There are some particularities to the process, but it's generally straightforward.

For the specifics we'll need to use in these posts, we can summarize a couple of things. All the commands in this section assume that you've cloned the Go repository and have a shell open in its root directory.

### How to apply the changes done to the rewrite rules

We already know what the rewrite rules are, but not how they're applied. Although the rules live in a series of `.rules` files, the actual code used to match and apply them is normal Go code. With one peculiarity: it's automatically generated from the `.rules` files.

For example, the rules for AMD64 are declared in the file `src/cmd/compile/internal/ssa/gen/AMD64.rules `, but the automatically generated code that applies those rules live in `src/cmd/compile/internal/ssa/rewriteAMD64.go`.

So: whenever we manually update a rewrite rule, we need to re-generate the corresponding Go code. Doing so is trivial, and comes down to this:

```sh
cd src/cmd/compile/internal/ssa/gen/
go run *.go
```

### How to compile the compiler and test it

And now for the fun part: how to compile the compiler. Once we've generated the automatic code, we want to build the compiler from source with the new changes. Doing it is as trivial as calling a script:

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

And last, but not least, when you've applied your changes, you'll want to know that you didn't break anything else, so you should run the whole test suite at least once before you push your changes! Doing so is again one script call away:

```sh
cd src/
./all.bash
```

# Next steps

Ok, enough theory! We already know what the issue is and the very basics of how SSA and the rewrite rules work. Go and read [the second part of the series](/blog/optimizing-go-compiler-2) to deep dive into the bug itself, which will let us know what the issue actually is and give us some hints on how to fix it.
