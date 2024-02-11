package main

import (
	_ "embed"
	"fmt"
	"os"
	"strings"
	"text/template"
)

//go:embed api.template.txt
var apiTemplate string

func RemoveComments(content string) string {
	for {
		idxStart := strings.Index(content, "/*")
		if idxStart < 0 {
			break
		}

		v := content[idxStart:]
		idxEnd := strings.Index(v, "*/")
		if idxStart < 0 {
			break
		}

		content = content[:idxStart] + content[idxStart+idxEnd+2:]
	}
	return content
}

func ExtractScope(content string, scopeStart, scopeEnd rune) (string, int) {
	opened := 0
	finishedIdx := 0
	for i, c := range content {
		if c == scopeStart {
			opened++
		}
		if c == scopeEnd {
			opened--
		}
		if opened < 0 {
			finishedIdx = i
			break
		}
	}
	return content[:finishedIdx], finishedIdx
}

func ExtractModules(content string) map[string]string {
	idx := strings.Index(content, "export class Api")
	content = content[idx:]

	idx = strings.Index(content, "{")
	content = content[idx+1:]

	content, _ = ExtractScope(content, '{', '}')

	content = strings.TrimSpace(content)

	modules := map[string]string{}
	for {
		content = strings.TrimSpace(content)
		if len(content) == 0 {
			break
		}

		idx = strings.Index(content, " ")
		moduleName := content[:idx]

		idx = strings.Index(content, "{")
		content = content[idx+1:]

		moduleCode, idx := ExtractScope(content, '{', '}')
		content = content[idx+1:]
		modules[moduleName] = moduleCode
	}
	return modules
}

type Params struct {
	Names []string
	Types []string
	Code  string
}

func (p Params) CodeGen(prefix string) string {
	var str []string
	for i := 0; i < len(p.Names); i++ {
		str = append(str, fmt.Sprintf("%s%s: %s", prefix, p.Names[i], p.Types[i]))
	}
	return strings.Join(str, ",")
}

func (p Params) String() string {
	return p.Code
}

func (p Params) GetNames() string {
	return strings.Join(p.Names, ",")
}

func (p Params) GetNamesWithPrefix(prefix string) string {
	var str []string
	for _, name := range p.Names {
		str = append(str, prefix+name)
	}
	return strings.Join(str, ",")
}

type Func struct {
	Name         string
	Params       Params
	Code         string
	ResponseType string
}

func DivideFunctions(content string, readUntil rune) []string {
	var f []string
	openParenthesis := 0
	openBracket := 0
	openTypeDef := 0
	from := 0
	for i, c := range content {
		switch c {
		case '(':
			openParenthesis++
		case ')':
			openParenthesis--
		case '{':
			openBracket++
		case '}':
			openBracket--
		case '<':
			openTypeDef++
		case '>':
			if content[i-1] != '=' {
				openTypeDef--
			}
		}
		if c == readUntil && openBracket == 0 && openParenthesis == 0 && openTypeDef == 0 {
			f = append(f, strings.TrimSpace(content[from:i]))
			from = i + 1
		}
	}
	if len(content[from:]) > 0 {
		f = append(f, strings.TrimSpace(content[from:]))
	}
	return f
}

func ExtractFunctions(content string) []Func {
	var funcs []Func
	content = strings.TrimSpace(content)
	fs := DivideFunctions(content, ',')
	for _, f := range fs {
		paramsContent := f[strings.Index(f, "(")+1:]
		params, paramsFinishIdx := ExtractScope(paramsContent, '(', ')')
		params = strings.TrimSpace(params)

		code := paramsContent[paramsFinishIdx+1:]
		idx := strings.Index(code, "=>")
		code = strings.TrimSpace(code[idx+2:])

		idx = strings.Index(code, "this.request<")

		response, _ := ExtractScope(code[idx+13:], '<', '>')
		response = strings.TrimSpace(response)
		if strings.HasSuffix(response, "any") {
			response = response[:len(response)-5]
		} else if strings.HasSuffix(response, "EchoHTTPError") {
			response = response[:len(response)-15]
		} else {
			panic(response)
		}

		funcName := f[:strings.Index(f, ":")]

		var names []string
		var types []string
		paramArr := strings.Split(params, ",")
		for _, item := range paramArr {
			item = strings.TrimSpace(item)
			idx := strings.Index(item, ":")
			name := []string{item[:idx], item[idx+1:]}

			names = append(names, strings.ReplaceAll(strings.TrimSpace(name[0]), "?", ""))
			typ := strings.TrimSpace(name[1])
			if strings.Contains(typ, "=") {
				typ = strings.TrimSpace(strings.Split(typ, "=")[0])
			}
			if strings.HasSuffix(name[0], "?") {
				typ += "| undefined"
			}
			types = append(types, typ)
		}

		function := Func{
			Name: funcName,
			Params: Params{
				Names: names,
				Code:  params,
				Types: types,
			},
			Code:         code,
			ResponseType: response,
		}
		funcs = append(funcs, function)

	}
	return funcs
}

type API struct {
	Func       Func
	ModuleName string
}

func (api API) APIName() string {
	return "use" + strings.ToUpper(api.ModuleName[:1]) + api.ModuleName[1:] +
		strings.ToUpper(api.Func.Name[:1]) + api.Func.Name[1:]
}

type Module []API

func (module Module) Imports() string {
	importsMap := map[string]any{}
	for _, api := range module {
		for _, param := range api.Func.Params.Types {
			rt := strings.ReplaceAll(param, "[]", "")
			if strings.Contains(rt, "Record<") || strings.Contains(rt, "{") || strings.Contains(rt, "|") {
				continue
			}
			switch rt {
			case "string", "number", "RequestParams", "void":
			default:
				importsMap[rt] = struct{}{}
			}
		}

		rt := strings.ReplaceAll(api.Func.ResponseType, "[]", "")
		if strings.Contains(rt, "Record<") || strings.Contains(rt, "{") || strings.Contains(rt, "|") {
			continue
		}
		switch rt {
		case "string", "number", "RequestParams", "void":
		default:
			importsMap[rt] = struct{}{}
		}
	}

	var imports []string
	for k, _ := range importsMap {
		imports = append(imports, k)
	}
	return strings.Join(imports, ",")
}

func main() {
	bytes, err := os.ReadFile("./src/api/api.ts")
	if err != nil {
		panic(err)
	}

	content := string(bytes)
	content = RemoveComments(content)

	codeGenTemplate := template.New("FE")
	codeGenTemplate, err = codeGenTemplate.Parse(apiTemplate)
	if err != nil {
		panic(err)
	}

	modules := ExtractModules(content)
	for module, code := range modules {
		fileName := fmt.Sprintf("./src/api/%s.gen.ts", module)
		os.Remove(fileName)

		f, err := os.OpenFile(fileName, os.O_CREATE|os.O_RDWR, os.ModePerm)
		if err != nil {
			panic(err)
		}

		var mod Module
		funcs := ExtractFunctions(code)
		for _, function := range funcs {
			mod = append(mod, API{
				Func:       function,
				ModuleName: module,
			})
		}

		err = codeGenTemplate.Execute(f, mod)
		if err != nil {
			panic(err)
		}

		err = f.Close()
		if err != nil {
			panic(err)
		}
	}
	fmt.Println("==== generate finished")
}
