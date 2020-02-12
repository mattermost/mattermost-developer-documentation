---
title: Maintaining consistency in codebases with Go Vet
slug: maintaining-consistency-in-codebases-with-go-vet
date: 2020-02-10
categories:
    - "go"
author: Jesús Espino
github: jespino
community: jesus.espino
---

At Mattermost we are a bit obsessed with the quality of our code, and one of
the things that we love is consistent and idiomatic Go. In that sense, go vet
is a great tool, because it checks a lot of things for us (useless assignments,
wrong number of Printf parameters, correct format in struct tags, etcetera) as
part of our CI pipeline, helping us and our contributors to write better code.

The main restriction of go vet is that there are a limited number of absolute
truths about what is right and what is wrong and so the go vet checks are very
general.

In Mattermost we have a way of doing certain things like logging, test
assertions or license headers. We love to keep code consistent so we work hard
to avoid reintroducing old patterns in the code.

I think the best way to explain it is with an example.

Some time ago we decided to migrate our logging approach to use structured
logging everywhere, but the migration wasn't complete and the old pattern
(logging without structured approach) was starting to appear again, in some
cases mimicking code that wasn’t migrated to the new pattern yet, and in other
cases by coincidence because the old pattern was one of the obvious approaches
that you can follow to present data in the logs.

So... go vet to the rescue! Go vet comes with a good bunch of checks already,
but you can extend it by adding your own specific checks.

We created [our own check](https://github.com/mattermost/mattermost-govet/blob/master/structuredLogging/structuredLogging.go)
of go vet avoiding any string building with `fmt.Sprintf` calls as part of the
calls to our log library. With that check implemented we were able to detect
all the cases in the code where we were doing not-structured logging and
replace them with the proper structured logging approach. After that, we added
that check to our CI pipeline to ensure that the pattern is not reintroduced
accidentally by us or by any contributor.

Another interesting example is our approach to improve the quality of the test
assertions. We use the [Testify](https://github.com/stretchr/testify) library
to include more semantic assertions, but at the same time, we were using
`t.Fatalf` calls in certain places. The `t.Fatalf` way to make fail tests was
less semantic because the tests error itself is not necessarily related to the
assertion. We created a [check to avoid the use of `t.Fatalf`](https://github.com/mattermost/mattermost-govet/blob/master/tFatal/tFatal.go) in our tests.

Once we had that, we discovered that we have some incorrectly defined
assertions. For example, we were using `require.Equal(t, 5, len(x))` which is
less semantic than `require.Len(t, x, 5)`. We created a [check for semantic length assertions](https://github.com/mattermost/mattermost-govet/blob/master/equalLenAsserts/equalLenAsserts.go),
adding a suggestion in the error message to replace it with the
correct assertion. We kept digging there, and we discovered that sometimes we
were checking `require.Len(t, x, 0)` which can be more semantically written as
`require.Empty(t, x)`, so we wrote the check for that, and included in the check
the case for `require.Equal(t, 0, len(x))` suggesting in both cases to use
`require.Empty`.

Other checks have been made for other purposes, for example checking the
[consistency and existence of the license in the header of our files](https://github.com/mattermost/mattermost-govet/blob/master/license/license.go), or
checking for the [consistency in the receiver variable name of the methods for the same structure](https://github.com/mattermost/mattermost-govet/tree/master/inconsistentReceiverName).

Extending go vet is a really easy task, you only need some knowledge about the
go AST because almost anything else is already handled by the go vet tool. As
an example, let's implement a go vet check to find forbidden words in the
strings of our code.

The first thing that we need is an Analyzer. An Analyzer is the struct
responsible for receiving the ast (and some other things), find the things that
we consider errors, notify go vet of those errors, and alert the user.

Let's build our Analyzer.

```go
// File: checkwords.go
package main

import (
	"go/ast"
	"go/token"
	"strings"

	"golang.org/x/tools/go/analysis"
	"golang.org/x/tools/go/analysis/unitchecker"
)

var analyzer = &analysis.Analyzer{
	Name: "checkWords",
	Doc:  "check forbidden words usage in our strings",
	Run:  run,
}

func run(pass *analysis.Pass) (interface{}, error) {
	forbiddenWords := []string{
		"bird",
		"water",
		"candy",
	}

	for _, file := range pass.Files {
		ast.Inspect(file, func(node ast.Node) bool {
			switch x := node.(type) {
			case *ast.BasicLit:
				if x.Kind != token.STRING {
					return false
				}
				words := strings.Fields(x.Value)
				for _, word := range words {
					for _, forbiddenWord := range forbiddenWords {
						if word == forbiddenWord {
							pass.Reportf(x.Pos(), "Forbidden word used, please avoid use the word %s on your strings", word)
						}
					}
				}
				return false
			}
			return true
		})
	}
	return nil, nil
}

func main() {
	unitchecker.Main(
		analyzer,
	)
}
```

Our Analyzer is inspecting all the files searching for `*ast.BasicLit` of `Kind`
`token.STRING`, which are our literal strings. It splits those strings by spaces,
and checks whether any of them match the forbidden words (this is a completely
basic approach, and doesn't catch a lot of cases, but for the sake of
simplicity I'll leave it as is). If it finds any forbidden words, it reports to
the user with an error message. Go vet handles printing the filename and
location of the error.

Once we have our Analyzer we only have to register the Analyzer in our main
function to connect it with go vet using the `unitchecker.Main` function (we can
register multiple analyzers there).

Now we only need to compile it with `go build ./checkwords.go` and use it with
`go vet -vettool=./checkwords -checkWords ./file-or-module-path`.

For example, we can create an example.go file like this:

```go
package main

import "fmt"

func main() {
	fmt.Println("my candy is forbidden!")
	fmt.Println("but other strings are not")
}
```

and run our vet tool to check this with `go vet -vettool=./checkwords -checkWords example.go` and the resulting output is:

```
# command-line-arguments
./example.go:6:14: Forbidden word used, please avoid use the word candy on your strings
```

And that is all we need. Now we have an automatic way to detect undesired
patterns in our code.

Our conclusion is, using go vet is an excellent option to improve your code,
but extending it allows you to define your own patterns and maintain the
consistency of your code. If you see yourself asking for the same changes in
the PRs all the time, you can probably consider detecting this kind of problem
automatically with go vet.

Once the patterns are created you can apply them whenever you want, maybe by
hand from time to time, maybe as a git hook, maybe enforced by the CI, maybe
you can use it as a one time thing for changing something in your code - the
option you decide on is up to you and your use case.
