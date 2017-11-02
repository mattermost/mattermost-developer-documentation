package main

import (
	"encoding/json"
	"go/ast"
	"go/build"
	"go/doc"
	"go/importer"
	"go/parser"
	"go/token"
	"go/types"
	"log"
	"os"
	"regexp"
	"strings"
)

type Field struct {
	Names []string `json:"Names,omitempty"`
	Type  string
}

type MethodDocs struct {
	Name       string
	Comment    string
	Parameters []*Field `json:"Parameters,omitempty"`
	Results    []*Field `json:"Results,omitempty"`
}

type InterfaceDocs struct {
	Comment string
	Methods []*MethodDocs
}

type Docs struct {
	API   InterfaceDocs
	Hooks InterfaceDocs
}

var singleCommentNewline *regexp.Regexp = regexp.MustCompile("([^\n])\n([^\n])")

func cleanComment(comment string) string {
	return strings.TrimSpace(singleCommentNewline.ReplaceAllString(comment, "$1 $2"))
}

func fields(list *ast.FieldList, info *types.Info) (fields []*Field) {
	if list != nil {
		for _, x := range list.List {
			field := &Field{
				Type: info.TypeOf(x.Type).String(),
			}
			for _, name := range x.Names {
				field.Names = append(field.Names, name.Name)
			}
			fields = append(fields, field)
		}
	}
	return
}

func typeCheck(pkg *ast.Package, path string, fset *token.FileSet) (*types.Info, error) {
	typeConfig := types.Config{Importer: importer.For("source", nil)}
	info := &types.Info{
		Types: make(map[ast.Expr]types.TypeAndValue),
		Uses:  make(map[*ast.Ident]types.Object),
		Defs:  make(map[*ast.Ident]types.Object),
	}
	var files []*ast.File
	for _, file := range pkg.Files {
		files = append(files, file)
	}
	_, err := typeConfig.Check(path, fset, files, info)
	return info, err
}

func generateDocs() (*Docs, error) {
	imp, err := build.Import("github.com/mattermost/mattermost-server/plugin", "", 0)
	if err != nil {
		return nil, err
	}

	fset := token.NewFileSet()
	pkgs, err := parser.ParseDir(fset, imp.Dir, nil, parser.ParseComments)
	if err != nil {
		return nil, err
	}

	var docs Docs

	for path, pkg := range pkgs {
		info, err := typeCheck(pkg, "github.com/mattermost/mattermost-server/"+path, fset)
		if err != nil {
			return nil, err
		}

		godocs := doc.New(pkg, path, 0)
		for _, t := range godocs.Types {
			var interfaceDocs *InterfaceDocs
			switch t.Name {
			case "API":
				interfaceDocs = &docs.API
			case "Hooks":
				interfaceDocs = &docs.Hooks
			default:
				continue
			}
			interfaceDocs.Comment = cleanComment(t.Doc)
			for _, spec := range t.Decl.Specs {
				typeSpec, ok := spec.(*ast.TypeSpec)
				if !ok {
					continue
				}
				iface, ok := typeSpec.Type.(*ast.InterfaceType)
				if !ok {
					continue
				}
				for _, method := range iface.Methods.List {
					f := method.Type.(*ast.FuncType)
					methodDocs := &MethodDocs{
						Name:       method.Names[0].Name,
						Comment:    cleanComment(method.Doc.Text()),
						Parameters: fields(f.Params, info),
						Results:    fields(f.Results, info),
					}
					interfaceDocs.Methods = append(interfaceDocs.Methods, methodDocs)
				}
			}
		}
	}

	return &docs, nil
}

func main() {
	docs, err := generateDocs()
	if err != nil {
		log.Fatal(err)
	}

	b, err := json.MarshalIndent(docs, "", "    ")
	if err != nil {
		log.Fatal(err)
	}

	os.Stdout.Write(b)
}
