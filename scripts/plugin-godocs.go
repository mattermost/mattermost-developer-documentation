package main

import (
	"bytes"
	"encoding/json"
	"go/ast"
	"go/build"
	"go/doc"
	"go/importer"
	"go/parser"
	"go/printer"
	"go/token"
	"go/types"
	"log"
	"os"
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

type ExampleDocs struct {
	Comment string
	Code    string
}

type Docs struct {
	Comment  string
	API      InterfaceDocs
	Hooks    InterfaceDocs
	Examples map[string]*ExampleDocs
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

		var files []*ast.File
		for _, f := range pkg.Files {
			files = append(files, f)
		}
		docs.Examples = make(map[string]*ExampleDocs)
		for _, example := range doc.Examples(files...) {
			buf := &bytes.Buffer{}
			printer.Fprint(buf, fset, example.Play)
			docs.Examples[example.Name] = &ExampleDocs{
				Comment: strings.TrimSpace(example.Doc),
				Code:    buf.String(),
			}
		}

		godocs := doc.New(pkg, path, 0)

		if godocs.Name == "plugin" {
			docs.Comment = strings.TrimSpace(godocs.Doc)
		}

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
			interfaceDocs.Comment = t.Doc
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
						Comment:    strings.TrimSpace(method.Doc.Text()),
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
