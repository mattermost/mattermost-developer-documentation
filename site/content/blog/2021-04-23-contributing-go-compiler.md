---
title: "Contributing to the Go compiler"
heading: "Contributing to the Go compiler"
description: "TODO"
slug: contributing-go-compiler
date: 2021-04-23T12:00:00-05:00
categories:
    - "go"
author: Alejandro García Montoro
github: agarciamontoro
community: alejandro.garcia
---

[bf48163e8f2b604f3b9e83951e331cd11edd8495](https://github.com/golang/go/commit/bf48163e8f2b604f3b9e83951e331cd11edd8495). That is the hash of one of the 46985 commits that, at the time of this writing, build the whole git history of the Go compiler. It is definitely not the most important commit there, and most of the other ones probably deserve way more attention. But I like bf48163. It is a good commit, I think. I may be a bit biased, of course, as it is my first contribution to Go. Not only that, it is my first contribution _ever_ to any compiler!

What's really interesting here is that I am not an expert in Go, nor in compilers in general, at all. Sure, I know my way through the language to write software using it, but I had never thought I could be able to modify the compiler itself.

In this post I will try to explain the ins and outs of how I approached, as a newbie, my first contribution to a compiler. It is a long post, but I did not want to leave out any details. In the process, I will also try to demistify compilers, big projects as Go and the perceived difficulty of contributing to them.

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

It is now more clear what the function does. It stores the contents of the second argument, the `src` array, into the first argument, the slice `dest`. It uses the [encoding/binary](https://golang.org/pkg/encoding/binary/) package for reading and writing the 8 bytes as an unsigned integer of 64 bits. For doing the copy, we use a temporal variable, `temp`.

The only weird line might be the first one, which is a bounds check. This forces the compiler to check that `dest[8]`, and, thus, all `dest[0]`, ..., `dest[7]`, are valid indices. We do that at the very beginning, so the compiler knows that all indices we are using in the copy are valid, for the whole scope of the function. We do not need to do such a check with `src`, because its length is known at compile time: 8 bytes.

So what's the bug? This is where things start to get interesting. The compiler is generating correct code, but it is not as optimized as it can be.

# Interlude: understanding the compiler

Let's pause for a bit to learn something more about how the Go compiler works.

A compiler is a translator: it converts a piece of code in a language (in our case, Go) to an equivalent piece of code in another language (in our case, assembly code, whose specific instructions depend on the specific architecture we want to run the executable in). Hopefully, the meaning of what we wrote in Go (the behavior of our program), is maintained throughout the process of translation.

## Static Single Assignment

In the Go compiler, this complex process is divided into phases. There are _a lot_ of them, and we will not discuss the structure in this blog post---see [`cmd/compile/README.md`](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/README.md) for a high-level view of the phases, and take a look directly [at the code](https://github.com/golang/go/blob/0c93b16d015663a60ac77900ca0dcfab92310790/src/cmd/compile/internal/ssa/compile.go#L426-L481) to see the complete list---. We will instead focus on one of the last phases, which converts the so-called Static Single Assignment (SSA) form into the final assembly instructions, that depend on the architecture we are compiling for.

SSA is an intermediate generic representation of the code, which makes it easier to apply some optimizations before going too low-level into the architecture-specific instructions. SSA is a really interesting topic on its own, so make sure to read [the documentation](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/README.md) and, if you have time, go and see [this 30 minute talk](https://www.youtube.com/watch?v=uTMvKVma5ms), which is a great introduction to the topic.

For the purpose of this post, we need to know that SSA is a representation of the original code with a simple rule: every value is assigned only once, although it can be used any number of times. The syntax of SSA is not particularly interesting, but we need to understand it for being able to follow the rest of the post.

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

![Screenshot of the SSA page](/blog/2021-03-05-contributing-go-compiler/ssa.png)

That's a whole lot of information. I agree. But we can focus on what's interesting for us. The page shows the output of every phase of the compilation, once SSA is generated, in collapsible columns. To make things easier, the page is interactive: try clicking on a value and see how the uses of that value are highlighted in the same color. This does not only happen within the same column: if you look at the previous or next columns, you can also quickly see how that value is being modified by the different phases of the compilation (or if it is left untouched). You can do the same thing with blocks (the labels starting with `b`), which are isolated series of values in the control flow graph of the function.

## Rewrite rules

One of the benefits of using SSA is that it is easy to match common patterns and rewrite them with optimized versions. For example, let's say that we have the following Go code:

```go
var five = 5
var a = five * 16
```

We can compute the value of `a` by literally making the multiplication `5 times 16`. But it is known that multiplication instructions are quite CPU-expensive. What if we could optimize this line of code by avoiding the multiplication?

It turns out we can, because `16` is a power of `2`. And multiplying by `2^n` is the same as shifting the number to the left `n` places. This is easy to see in binary, where 5 is:

```
00000101
```

If we multiply 5 by 2, we get 10, which in binary is:

```
00001010
```

And again by 2, we get 20:

```
00010100
```

See how we are shifting everything to the left each time we multiply by 2? Then, multiplying by 16 is the same as shifting to the left 4 times, as 16 is `2^4`:

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

It is ok if you do not understand every specific detail of the instructions, we will see them in detail a bit later in this post. Here, for example, we can note that the `8` suffixes make reference to the fact that this rule only matches multiplications of 8-bit variables. The other highlighted rules in the link to the `generic.rules` file cover the cases for variables of different bit widths.

For now, it's enough to understand that the rules match a specific pattern of instructions, and rewrite those instructions with a new one that is hopefully more efficient. Also, it is important to know that there are generic rules, as the one we just studied, which are applied regardless of the specific architecture we are compiling for, and architecture-specific rules, such as the ones in the [AMD64.rules file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/AMD64.rules), which take advantage of the specifics of each architecture, further optimizing the code.

## Connecting all together

In order to investigate the issue and solve it, we will need to set up the development environment for the Go compiler. I encourage to read the official [documentation](https://golang.org/doc/contribute): it is comprehensive and easy to understand. There are some particularities to the process, as the need to use Gerrit instead of Github, but it is really straightforward.

For the specifics we will need to use through this post, we can summarize a couple of things. All the commands in this section assume that you are in the Go repository root directory.

### How to apply the changes done to the rewrite rules

We already know what the rewrite rules are, but not how they are applied. Although the rules live in a series of `.rules` files, the actual code used to match and apply them is normal Go code. With one peculiarity: it is automatically generated from the `.rules` files.

For example, the rules for AMD64 are declared in the file `src/cmd/compile/internal/ssa/gen/AMD64.rules `, but the automatically generated code that applies those rules live in `src/cmd/compile/internal/ssa/rewriteAMD64.go`.

So: whenever we manually update a rewrite rule, we need to re-generate the corresponding Go code. Doing so it's trivial, and it comes down to this:

```sh
cd src/cmd/compile/internal/ssa/gen/
go run *.go
```

### How to compile the compiler and test it

And now for the fun part: how to compile the compiler. Once we have generated the automatic code, we want to build the compiler from source with the new changes. Doing it is also as trivial as calling a script:

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

And last, but not least, when you have applied your changes, you will want to know that you did not break anything else, so you should run the whole test suite at least once before you push your changes! Doing so is again one script call away:

```sh
cd src/
./all.bash
```

# The investigation

Ok, enough theory! Let's try and use what we know now to investigate the bug.

Let's use our first tool, SSA, to understand what the compiler is generating. If we generate the SSA for the original function, `copyArrayToSlice`, and look at the `lower` phase, we'll see the following:

```
b1:

	v1 (?) = InitMem <mem>
	v7 (5) = Arg <*[8]byte> {src} (b.ptr[*byte], src[*[8]byte])
	v8 (?) = MOVQconst <int> [8] (b.cap[int], b.len[int])
	v9 (+6) = Arg <int> {dest} [8] (b.len[int], dest+8[int])
	v248 (84) = Arg <*byte> {dest}
	v153 (6) = CMPQconst <flags> [8] v9
UGT v153 → b43 b3 (likely) (6)

b3: ← b1

	v12 (6) = LoweredPanicBoundsC <mem> [0] v8 v9 v1
Exit v12 (6)

b24:
BlockInvalid (+83)

b25:
BlockInvalid (84)

b27:
BlockInvalid (85)

b29:
BlockInvalid (86)

b31:
BlockInvalid (87)

b33:
BlockInvalid (88)

b35:
BlockInvalid (89)

b37:
BlockInvalid (90)

b39:
BlockInvalid (91)

b43: ← b1

	v18 (+7) = LoweredNilCheck <void> v7 v1
	v29 (7) = InlMark <void> [0] v1
	v152 (+8) = InlMark <void> [1] v1
	v34 (+79) = MOVQload <uint64> v7 v1
	v171 (+84) = MOVBstore <mem> v248 v34 v1
	v168 (+85) = SHRQconst <uint64> [8] v34
	v216 (+89) = SHRQconst <uint64> [40] v34
	v180 (+91) = SHRQconst <uint64> [56] v34
	v219 (88) = MOVLstore <mem> [1] v248 v168 v171
	v243 (90) = MOVWstore <mem> [5] v248 v216 v219
	v255 (91) = MOVBstore <mem> [7] v248 v180 v243
Ret v255 (+8)
```

The interesting blocks are `b1`, which initialize the values with the arguments of the function, and `b43`, which makes the actual copy.

## Definition block

Let's take a closer look at the block where the values are initialized, `b1`:

```
v1 (?) = InitMem <mem>
v7 (5) = Arg <*[8]byte> {src} (b.ptr[*byte], src[*[8]byte])
v8 (?) = MOVQconst <int> [8] (b.cap[int], b.len[int])
v9 (+6) = Arg <int> {dest} [8] (b.len[int], dest+8[int])
v248 (84) = Arg <*byte> {dest}
v153 (6) = CMPQconst <flags> [8] v9
```

There are a couple of formalities there, such as representing the initialized memory with the value `v1`, but then we see how we define the arguments of the function:

```
v7 (5) = Arg <*[8]byte> {src} (b.ptr[*byte], src[*[8]byte])
```

`v7` is the second argument of the function, `src`, which is a pointer to an array of 8 bytes (remember that `src` was of type `[8]byte`).

```
v248 (84) = Arg <*byte> {dest}
```

`v248` is the first argument of the function, `dest`, which is a pointer to bytes (we do not know the length here, as it was defined as a slice, which has a variable length).

## Copy block

Once we have our values initialized, we can study the interesting instructions, those in block `b43`:

```
v18 (+7) = LoweredNilCheck <void> v7 v1
v29 (7) = InlMark <void> [0] v1
v152 (+8) = InlMark <void> [1] v1
v34 (+79) = MOVQload <uint64> v7 v1
v171 (+84) = MOVBstore <mem> v248 v34 v1
v168 (+85) = SHRQconst <uint64> [8] v34
v216 (+89) = SHRQconst <uint64> [40] v34
v180 (+91) = SHRQconst <uint64> [56] v34
v219 (88) = MOVLstore <mem> [1] v248 v168 v171
v243 (90) = MOVWstore <mem> [5] v248 v216 v219
v255 (91) = MOVBstore <mem> [7] v248 v180 v243
```

We can skip the first three lines, which are again formalities, and start on the one for the value `v34`:

```
v34 (+79) = MOVQload <uint64> v7 v1
```

Cool, our first real instruction, `MOVQload`! Now, what does that cryptic name means? The best way to know is to go directly to [its definition](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L702):

```go
// load 8 bytes from arg0+auxint+aux. arg1=mem
{
	name: "MOVQload",
	argLength: 2,
	reg: gpload,
	asm: "MOVQ",
	aux: "SymOff",
	typ: "UInt64",
	faultOnNilArg0: true,
	symEffect: "Read",
}
```

The data in this struct defines what the `MOVQload` instruction does; the corresponding code in assembly, `MOVQ`; its returning type, `UInt64`; or the number of arguments it receives, 2. The comment does a pretty good job explaining what the instruction does: it loads 8 bytes from the data pointed to by the first argument (plus some auxiliary arguments, if present, which we will see are constant numbers in square brackets) into the second, which should represent the memory. If we go back to our line,

```
v34 (+79) = MOVQload <uint64> v7 v1
━━┓                           ━┓ ━┓
  ┗ we can see this            ┃  ┗ memory
    one as temp                ┗ src
```

we now can understand that this loads the contents from the `src` argument (remember that `v7`represented`src`), into the memory we initialized at the very beginning (represented by `v1`). There are no auxiliary arguments, so we can safely forget about those! The result of this instruction is represented by the `v34` value, which we can understand as the `temp` variable.

This first line of the block, then, seems perfectly fine: it loads the whole contents of the `src` array into memory (which is effectively the `temp` variable we defined in the code), and it does it with a single instruction. We can no longer optimize this.

But remember that the original function did two things: first, it loaded the contents of the `src` array into a temporal variable, and then it stored those contents into the `dest` slice. We have already loaded the contents into memory with the line we discussed above, so the rest of the block should do the rest of the work: store those contents from memory into the `dest` slice (which was represented by value `v248`). Let's see the rest of the block again:

```
v171 (+84) = MOVBstore <mem> v248 v34 v1
v168 (+85) = SHRQconst <uint64> [8] v34
v216 (+89) = SHRQconst <uint64> [40] v34
v180 (+91) = SHRQconst <uint64> [56] v34
v219 (88) = MOVLstore <mem> [1] v248 v168 v171
v243 (90) = MOVWstore <mem> [5] v248 v216 v219
v255 (91) = MOVBstore <mem> [7] v248 v180 v243
```

See that the values defined in the second, third and fourth lines are used in the three last lines. Let's rewrite the block, simply replacing the values where they are used:

```
v171 (+84) = MOVBstore <mem> v248 v34 v1
v219 (88) = MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) v171
v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) v219
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

SPOILER: these are the lines that store to the slice what we just read into memory. As you can see, we are using four instructions instead of one, which is what we are going to optimize!

But let's not get ahead of ourselves! To better understand what is going on here, we need to understand what `MOVBstore`, `MOVLstore` and `MOVWstore` do, as well as `SHRQconst`. The first set of instructions look quite similar to the one we already understand, `MOVQload`.

We can study the first one, `MOVBstore`, as before, looking into [its definition](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L703):

```go
// store byte in arg1 to arg0+auxint+aux. arg2=mem
{
	name: "MOVBstore",
	argLength: 3,
	reg: gpstore,
	asm: "MOVB",
	aux: "SymOff",
	typ: "Mem",
	faultOnNilArg0: true,
	symEffect: "Write",
}
```

Again, the comment does a good job explaining what is going on. The instruction receives three arguments, and it stores a single byte from the memory pointed to by the first argument (plus the auxiliary arguments) into the second argument. The state of the memory is represented by the third argument. The `typ` of the struct tells us that what this instruction returns is the new state of the memory after the operation. In short, this instruction gets a single byte from a place in memory and store it somewhere else.

Ok, and what about `MOVWstore` and `MOVLstore`? We can take a look at [their](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L704) [definitions](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L705), but we can also see what those suffixes (`B`, `W`, `L` and `Q`) mean. This is explained at [the beginning of the file that contains the definition of the instructions](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L26-L30):

```go
// Suffixes encode the bit width of various instructions.
// Q (quad word) = 64 bit
// L (long word) = 32 bit
// W (word)      = 16 bit
// B (byte)      = 8 bit
```

Knowing what we know about `MOVBstore`, it's clear what the others do:

-   `MOVBstore` stores a single **B**yte (8 bits, 1 byte)
-   `MOVWstore` stores a **W**ord (16 bits, 2 bytes)
-   `MOVLstore` stores a **L**ong word (32 bits, 4 bytes)

That's it, these operations simply store a fixed number of bytes from some place in memory to another place.

That leaves us with the last instruction: `SHRQconst`. We can do the same as before, and go straight to [its definition](https://github.com/golang/go/blob/7240a18adbfcff5cfe750a1fa4af0fd42ade4381/src/cmd/compile/internal/ssa/gen/AMD64Ops.go#L398) to know what it does:

```go
// unsigned arg0 >> auxint, shift amount 0-63
{
	name: "SHRQconst",
	argLength: 1,
	reg: gp11,
	asm: "SHRQ",
	aux: "Int8",
	resultInArg0: true,
	clobberFlags: true,
}
```

It's a good ol' shift to the right! That is: an operation that takes a binary number, and shifts it to the right a specific amount of places, specified by the `auxint` argument (the constant integer we see in square brackets). If shifting to the left was the same as multiplying by a power of two, shifting a number to the right `n` places means halving it `n` times, which is equal to dividing it between `2^n`.

We have all the ingredients now:

-   `MOVXstore` stores the contents from the second argument into the first one, with the amount of bytes moved depending on the prefix `X`
-   `SHRQconst` shifts the number in its only argument a number of places specified by the auxiliary argument, the number in square brackets

Let's see the lines again, one by one. The first one was:

```
v171 (+84) = MOVBstore <mem> v248 v34 v1
```

This one is straightforward: it stores a single **B**yte from `v34` (the contents in `temp`) into the memory pointed to by `v248` (which is `dest`). That is, we are copying `temp[0]` into `dest[0]`.

The second one is more interesting, let's break it down:

```
                   this L means 4 bytes        ┏ dest               temp ┓
                   ━━━━━━━━┳━━━━━━━━━━━        ┃                         ┃
                           ┃                ━━━┛                         ┗━━
     new                                                                               previous
state of ━┫ v219 (88) = MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) v171 ┣━━ state of
  memory                                                                               memory
                                        ━┳━                          ━┳━
                                         ┃                            ┃
         ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓      ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
           auxiliary argument to MOVLstore, so it           auxiliary argument to SHRQconst, so
           starts writing data one byte after the           it shifts the contents 8 bits to the
           memory pointed to by the second argument         right, effectively discarding them
         ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛      ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

Now we're storing a **L**ong word (4 bytes) from the second argument, `(SHRQconst <uint64> [8] v34)`, into the memory pointed to by `v248`, which is `dest`. But we have the `[1]` auxiliary argument! So we don't write directly into the memory pointed to by `v248`, but one byte after that pointer: that is, the first byte of `dest` is left untouched, and we write contents from the second byte on. In terms of Go code, as we are storing 4 bytes, it means that we're writing to `dest[1]`, `dest[2]`, `dest[3]` and `dest[4]`.

But what 4 bytes do we write? That's what `(SHRQconst <uint64> [8] v34)` is telling us: we already wrote `temp[0]` in `dest[0]`, so it would make sense to read now from `temp[1]` on. And that's exactly what we are doing with the shift: as the auxiliary argument is `[8]`, that means that we are shifting the content of `v34` (or `temp`) to the right 8 bits. Those 8 bits are already in `dest[0]`, so we can safely discard them and only read the next ones: from `temp[1]` on. As `MOVLstore` is writing 4 bytes, that means that we are getting 4 bytes worth of data; that is: `temp[1]`, `temp[2]`, `temp[3]` and `temp[4]`.

So that's it! That long, complex, full of arguments and auxiliary arguments instruction is simply doing this:

```go
dest[1] = temp[1]
dest[2] = temp[2]
dest[3] = temp[3]
dest[4] = temp[4]
```

That was a bit hard, I agree. But we already have everything we need to know, because the two following lines are structurally identical!

```
v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) v219
```

This one stores 2 bytes (see the `W` prefix there?) into the memory pointed to by `v248` plus `[5]` bytes; that is, we write into `dest[5]` and `dest[6]`. And what we write is the content of `v34` (`temp`) shifted to the right `[40]` bits (or 5 bytes, as we have already copied from `temp[0]` to `temp[4]`). That's right, this line is doing the following:

```go
dest[5] = temp[5]
dest[6] = temp[6]
```

So this leaves us with the last line of the block! And you already know what will happen:

```
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

Yup, we're simply copying the last byte from `temp` (skipping the first `[56]` bits, or 7 bytes!), into the `dest` slice (starting to write after `[7]` bytes, or 56 bits!). That's it, in terms of Go code, we are simply doing this:

```go
dst[7] = temp[7]
```

Wrapping up everything we've learned up until now, we are doing the following:

```go
dst[0] = temp[0]  // v171 (+84) = MOVBstore <mem> v248 v34 v1

dst[1] = temp[1]  // v219 (88) = MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) v171
dst[2] = temp[2]  //
dst[3] = temp[3]  //
dst[4] = temp[4]  //

dst[5] = temp[5]  // v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) v219
dst[6] = temp[6]  //

dst[7] = temp[7]  // v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

Cool, we did it! We understood what a whole block of SSA is doing, so feel free to treat yourself with a snack before going on.

In the next section we will see how to convert that beast of 4 instructions---which store a byte, then 4 more, then another 2, and finally one more ¯\\\_(ツ)\_/¯---into a single one that directly stores the 8 bytes.

# A failing test

To fix something, you first need to ensure it is broken. So my first step, as suggested in the issue, was adding [a failing test](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/test/codegen/memcombine.go#L370-L377). At first, it looked like this:

```go
func store_le64_load(b []byte, x *[8]byte) {
	_ = b[8]
	// amd64:-`MOV[BWL]`
	binary.LittleEndian.PutUint64(b, binary.LittleEndian.Uint64(x[:]))
}
```

This is the same function we have been studying. The only difference is that I am using short names for the variables and I am skipping the declaration of `temp`, whose definition is now embedded into the second argument of `PutUint64`.

Now the question is: how is this a test? The long answer is in [the `codegen/README` file](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/test/codegen/README). The short answer is: the files under the `codegen/` directory are compiled, and their generated code is compared with the specifications written in the comments. In this case, we have only one comment:

```go
// amd64:-`MOV[BWL]`
```

This line tells the test runner that when this function is compiled for the `amd64` architecture, the generated instructions must not match (because of the dash `-`) the regex `MOV[BWL]`. That is, the test will fail if the generated code contains any of `MOVB`, `MOVW` or `MOVL`, which are the AMD64-specific instructions corresponding to the load/store instructions we have seen in the SSA code.

To run all the tests in the `memcombine.go` file, which is the one where the test lives, we can just do the following from the Go repository root:

```sh
go run test/run.go -- test/codegen/memcombine.go
```

Once the test is added, running the previous command with any version of Go less than 1.17 will output a failed test:

```sh
20:15 $ go run test/run.go -- test/codegen/memcombine.go
2021/04/10 20:15:37 "".store_le64_load<1> STEXT nosplit size=89 args=0x20 locals=0x18 funcid=0x0
        0x0000 00000 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    TEXT    "".store_le64_load(SB), NOSPLIT|ABIInternal, $24-32
        0x0000 00000 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    SUBQ    $24, SP
        0x0004 00004 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    MOVQ    BP, 16(SP)
        0x0009 00009 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    LEAQ    16(SP), BP
        0x000e 00014 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    FUNCDATA        $0, gclocals·385b9fcf304627fb2d5e79f269b14707(SB)
        0x000e 00014 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:370)    FUNCDATA        $1, gclocals·69c1753bd5f81501d95132d08af04464(SB)
        0x000e 00014 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    MOVQ    "".b+40(SP), CX
        0x0013 00019 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    CMPQ    CX, $8
        0x0017 00023 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    JLS     78
        0x0019 00025 (<unknown line number>)    NOP
        0x0019 00025 (<unknown line number>)    NOP
        0x0019 00025 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    "".x+56(SP), AX
        0x001e 00030 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    (AX), AX
        0x0021 00033 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    "".b+32(SP), CX
        0x0026 00038 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVB    AL, (CX)
        0x0028 00040 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    AX, DX
        0x002b 00043 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    SHRQ    $8, AX
        0x002f 00047 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVL    AX, 1(CX)
        0x0032 00050 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    DX, AX
        0x0035 00053 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    SHRQ    $40, DX
        0x0039 00057 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVW    DX, 5(CX)
        0x003d 00061 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    SHRQ    $56, AX
        0x0041 00065 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVB    AL, 7(CX)
        0x0044 00068 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    MOVQ    16(SP), BP
        0x0049 00073 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    ADDQ    $24, SP
        0x004d 00077 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:376)    RET
        0x004e 00078 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    MOVL    $8, AX
        0x0053 00083 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    PCDATA  $1, $1
        0x0053 00083 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    CALL    runtime.panicIndex(SB)
        0x0058 00088 (/home/alejandro/projects/go/go/test/codegen/memcombine.go:371)    XCHGL   AX, AX
        0x0000 48 83 ec 18 48 89 6c 24 10 48 8d 6c 24 10 48 8b  H...H.l$.H.l$.H.
        0x0010 4c 24 28 48 83 f9 08 76 35 48 8b 44 24 38 48 8b  L$(H...v5H.D$8H.
        0x0020 00 48 8b 4c 24 20 88 01 48 89 c2 48 c1 e8 08 89  .H.L$ ..H..H....
        0x0030 41 01 48 89 d0 48 c1 ea 28 66 89 51 05 48 c1 e8  A.H..H..(f.Q.H..
        0x0040 38 88 41 07 48 8b 6c 24 10 48 83 c4 18 c3 b8 08  8.A.H.l$.H......
        0x0050 00 00 00 e8 00 00 00 00 90                       .........
        rel 84+4 t=8 runtime.panicIndex<1>+0
# go run run.go -- test/codegen/memcombine.go

test/codegen/memcombine.go:376: linux/amd64/: wrong opcode found: "^MOV[BWL]"

FAIL    test/codegen/memcombine.go      0.457s
exit status 1
```

We can see the generated code for AMD64 (pretty similar to the SSA code we have been studying) and a summary at the end, saying that a wrong opcode was found.

Cool, we have now a failing test, so we can evaluate whether the changes we apply are enough to make the test pass.

# The fix

Remember that our goal was to make the generated code to use a single `MOVQstore`, instead of the smaller `MOVBstore`, `MOVWstore` and `MOVLstore`. We have two ways of getting there:

1. Trying to understand how the rules in the [generic.rules](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/generic.rules) and [AMD64.rules](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/AMD64.rules) files are applied during the compilation, and trying to fix the conflict that generates the weird pattern by adjusting the existing rules: maybe reordering them, maybe making them more specific or more generic, or maybe something else.
2. Adding a new rule that explicitly matches that pattern and changes it with what we need.

My first instinct was to go with 1: it is a more elegant approach, and would let us actually fix the issue, instead of patching it. It would also avoid the overhead of adding a new rule, which should be always checked and only applied when this specific, weird pattern happens.

This proved to be way more difficult than I had anticipated. I did try to deep-dive into the rewriting process by using the following command, which logs every rewrite of every value of the SSA representation.

```sh
go build -gcflags=-d=ssa/lower/debug=2 memcombine.go
```

The output of that command is, let's say, voluminous, and it does not log which rule is being applied each time, only the changes that every value go through. Believe me, trying to read it is not a fun experience.

So I soon abandoned the idea of trying to understand exactly why that weird pattern of smaller `MOV` instructions came to be. And I decided to go with the Good Enough™ approach; i.e., trying to come up with a new rule that matched that specific pattern and converted it to an optimized version.

And so I did it:

```
(MOVBstore [7] p1 (SHRQconst [56] w)
  x1:(MOVWstore [5] p1 (SHRQconst [40] w)
  x2:(MOVLstore [1] p1 (SHRQconst [8] w)
  x3:(MOVBstore p1 w mem))))
  && x1.Uses == 1
  && x2.Uses == 1
  && x3.Uses == 1
  && clobber(x1, x2, x3)
  => (MOVQstore p1 w mem)
```

[That rule](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/AMD64.rules#L1972-L1980) is the literal translation into the rule syntax of our original idea. Let's study, first, how we can come up with such a rule.

Remember that our faulty block looked like this:

```
v171 (+84) = MOVBstore <mem> v248 v34 v1
v168 (+85) = SHRQconst <uint64> [8] v34
v216 (+89) = SHRQconst <uint64> [40] v34
v180 (+91) = SHRQconst <uint64> [56] v34
v219 (88) = MOVLstore <mem> [1] v248 v168 v171
v243 (90) = MOVWstore <mem> [5] v248 v216 v219
v255 (91) = MOVBstore <mem> [7] v248 v180 v243
```

Replacing the uses of the three `SHRQconst` instructions in the last three lines, we have:

```
v171 (+84) = MOVBstore <mem> v248 v34 v1
v219 (88) = MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) v171
v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) v219
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

Now, if we replace the usage of the first line in the second one, we arrive at the following:

```
v219 (88) = MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) (MOVBstore <mem> v248 v34 v1)
v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) v219
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

Doing the same replacement with `v219:`

```
v243 (90) = MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) (MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) (MOVBstore <mem> v248 v34 v1))
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) v243
```

and, lastly, with `v243`:

```
v255 (91) = MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34) (MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34) (MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34) (MOVBstore <mem> v248 v34 v1)))
```

Removing the assignment itself and pretty printing it, we obtain the actual pattern of instructions that we want to fix:

```
MOVBstore <mem> [7] v248 (SHRQconst <uint64> [56] v34)
    (MOVWstore <mem> [5] v248 (SHRQconst <uint64> [40] v34)
    (MOVLstore <mem> [1] v248 (SHRQconst <uint64> [8] v34)
    (MOVBstore <mem> v248 v34 v1)))
```

Instead of this, we want a single `Q`uad instruction that reads from `v34` and stores into `v248`, something like the following:

```
MOVQstore <mem> v248 v34 v1
```

With the actual pattern that we are seeing and the expected instruction that we want to see, we have all the pieces we need to build a new rule. In its simplest form, the rule has the form of `(actual pattern) => (expected pattern)`. In our case, it looks as follows:

```
(MOVBstore [7] p1 (SHRQconst [56] w)
  (MOVWstore [5] p1 (SHRQconst [40] w)
  (MOVLstore [1] p1 (SHRQconst [8] w)
  (MOVBstore p1 w mem))))
  => (MOVQstore p1 w mem)
```

Comparing this with the actual pattern we described before, we can see a couple of changes: we have replaced `v248` with a variable named `p1`, `v34` with a variable named `w`, and `v1` with a variable named `mem` (as it represents the memory). With this renaming, we generalize the possible values those variables can have, but restrict the pattern to be matched only when the same value appears in every instance of the same variable. We have also removed the type specifications from the instructions, as they are not important in the matching pattern.

The above rule is pretty much identical to the actual rule, which ended up looking like this:

```
(MOVBstore [7] p1 (SHRQconst [56] w)
  x1:(MOVWstore [5] p1 (SHRQconst [40] w)
  x2:(MOVLstore [1] p1 (SHRQconst [8] w)
  x3:(MOVBstore p1 w mem))))
  && x1.Uses == 1
  && x2.Uses == 1
  && x3.Uses == 1
  && clobber(x1, x2, x3)
  => (MOVQstore p1 w mem)
```

The only addition here is the `x1`, `x2` and `x3` labels, which name each of the values that correspond to the inner `MOV` instructions, and the boolean condition we have at the end of the matching pattern, which is actually literal Go code:

```go
x1.Uses == 1
  && x2.Uses == 1
  && x3.Uses == 1
  && clobber(x1, x2, x3)
```

This boolean condition is simply an additional restriction to the pattern matching. The rules specification say that this pattern will only match if the pattern is matched **and** if this condition is true.

For understanding what the additional restriction is, we need to understand what the `.Uses` field and the `clobber` function do with `x1`, `x2`, and `x3`, which are instances of [the `Value` struct](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/value.go#L17-L63) defined in the compiler. This is actually pretty straightforward:

-   The [`Uses` field](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/value.go#L51-L52) is a field that we can access in every SSA value and, per its definition, is a counter of the number of times that specific value is used.
-   The [`clobber` function](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/rewrite.go#L935-L945) both checks that the value is never used again and decrements the `.Uses` counter.

In short, what we are checking with the boolean condition is that each of the inner `MOV` instructions are used only once, and making sure that they are never used again. This is a simple strategy to restrict the pattern matching to the specific case we want to fix.

# Wrapping up

So... that's it! We did it!

We wrote a failing test:

```go
func store_le64_load(b []byte, x *[8]byte) {
	_ = b[8]
	// amd64:-`MOV[BWL]`
	binary.LittleEndian.PutUint64(b, binary.LittleEndian.Uint64(x[:]))
}
```

And we added a new AMD64 rule:

```
(MOVBstore [7] p1 (SHRQconst [56] w)
  x1:(MOVWstore [5] p1 (SHRQconst [40] w)
  x2:(MOVLstore [1] p1 (SHRQconst [8] w)
  x3:(MOVBstore p1 w mem))))
  && x1.Uses == 1
  && x2.Uses == 1
  && x3.Uses == 1
  && clobber(x1, x2, x3)
  => (MOVQstore p1 w mem)
```

With the addition of this rule, the test passes, so we solved the issue!

...or didn't we? Sorry, there's just one more wee thing to do. In the issue comments, [@mundaym](https://github.com/mundaym) pointed out [an important thing](https://github.com/golang/go/issues/41663#issuecomment-699904531):

> arm64, ppc64le and s390x all also do unaligned load/store merging.

According to this, if we compile for any of those architectures, using the environment variable `GOARCH` with the values `arm64`, `ppc64le` or `s390x`, we may see a similar pattern, where the load is done with one instruction but the store is done in multiple pieces.

Long story short, after some investigation, it was easy to see that `arm64` and `ppc64le` were generating correct code, but `s390x` was not.

To cover those four architectures, the test had to get some more assertions in the form of comments:

```go
func store_le64_load(b []byte, x *[8]byte) {
	_ = b[8]
	// amd64:-`MOV[BWL]`
	// arm64:-`MOV[BWH]`
	// ppc64le:-`MOV[BWH]`
	// s390x:-`MOVB`,-`MOV[WH]BR`
	binary.LittleEndian.PutUint64(b, binary.LittleEndian.Uint64(x[:]))
}
```

As you can see, the regex for each of the architectures is different, as the specific instructions differ for each of them.

As I noted before, the only architecture that was not passing the test was `s390x`, so a new rule had to be added! The strategy to do so was exactly the same: study the pattern of instructions generated by the compiler and craft a rule to specifically match that pattern. [The new rule for S390X](https://github.com/golang/go/blob/bf48163e8f2b604f3b9e83951e331cd11edd8495/src/cmd/compile/internal/ssa/gen/S390X.rules#L1423-L1431) ended up taking this shape:

```
(MOVBstore [7] p1 (SRDconst w)
  x1:(MOVHBRstore [5] p1 (SRDconst w)
  x2:(MOVWBRstore [1] p1 (SRDconst w)
  x3:(MOVBstore p1 w mem))))
  && x1.Uses == 1
  && x2.Uses == 1
  && x3.Uses == 1
  && clobber(x1, x2, x3)
  => (MOVDBRstore p1 w mem)
```

The structure is identical to the rule we studied in this post, but if you are interested in the details of the S390X-specific instructions, feel free to dive into [the S390Xops.go file](https://github.com/golang/go/blob/master/src/cmd/compile/internal/ssa/gen/S390XOps.go) to learn what those instructions do.

# Conclusions

That's it, we did it! This was a long long post, but I hope it was an interesting one. At the very least, we learned about some specific things:

-   Static Single Assignment (SSA), and how it makes code rewriting and optimizations easier to apply
-   Rewrite rules, the tool to actually rewrite the code and apply those optimizations
-   A little bit of assembly, which made it possible to understand the bug and fix it

Also, the journey made us unveil some particularities of how the Go compiler works and the structure of its code, so I hope you are now even more ready to start contributing!

Don't forget to check the [issue tracker](https://github.com/golang/go/issues?q=is%3Aissue+is%3Aopen+label%3ANeedsFix) and comment on the issue you want to work on. There's no better way to learn how to contribute to a compiler than, well, contributing to a compiler.
