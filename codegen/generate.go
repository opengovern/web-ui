package main

import (
	"fmt"
	"os"
	"regexp"
	"sort"
	"strings"
)

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

func main() {
	bytes, err := os.ReadFile("./src/api/api.ts")
	if err != nil {
		panic(err)
	}

	content := string(bytes)
	content = RemoveComments(content)

	r, err := regexp.Compile(`([\w\d]+):\s+\(([\w\n\|\[\]\(\)\-\?\'\d\s:,=\{\}]+)\)\s+=>[\s\n]+this.request<([\w\s\,\<\>\[\]\d]+),\s+([\w\<\>\[\]\d\n\s]+)>`)
	if err != nil {
		panic(err)
	}

	r2, err := regexp.Compile(`\s+([\w\d]+)\s+=\s+\{\n`)
	if err != nil {
		panic(err)
	}

	matches := r.FindAllStringSubmatch(content, -1) // matches is [][]string

	imports := map[string]interface{}{}
	importFormat := `import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api, %s RequestParams } from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'
`
	apiFiles := map[string]string{}
	for _, match := range matches {
		apiName := match[1]
		req := match[2]
		resp := match[3]
		imp := resp
		if strings.HasSuffix(imp, "[]") {
			imp = imp[:len(imp)-2]
		}
		if imp != "void" && imp != "number" && imp != "string" && !strings.HasPrefix(imp, "Record<") {
			imports[fmt.Sprintf("    %s,", imp)] = struct{}{}
		}

		midx := 0
		for {
			midx = strings.Index(content[midx+len(apiName):], apiName) + midx + len(apiName)
			if strings.Index(content[midx:], resp) > 600 {
				continue
			}
			break
		}

		mc := content[:midx]

		matches2 := r2.FindAllStringSubmatch(mc, -1)
		module := matches2[len(matches2)-1][1]

		funcName := "use" + strings.ToUpper(module[:1]) + module[1:] + strings.ToUpper(apiName[:1]) + apiName[1:]

		var params []string
		for _, p := range strings.Split(req, ",") {
			v := strings.Split(p, ":")[0]
			v = strings.TrimSpace(v)
			v = strings.Trim(v, "?")

			t := strings.Split(p, ":")[1]
			t = strings.TrimSpace(t)
			imp = t
			if strings.HasSuffix(imp, "[]") {
				imp = imp[:len(imp)-2]
			}
			if imp != "void" && imp != "number" && imp != "string" &&
				!strings.HasPrefix(imp, "Record<") && !strings.Contains(imp, "{") && !strings.Contains(imp, "|") {
				imports[fmt.Sprintf("    %s,", imp)] = struct{}{}
			}
			params = append(params, v)
		}
		pmr := strings.Join(params, ",")

		setWorkspace := "workspace"
		if module == "workspace" {
			setWorkspace = "'kaytu'"
		}

		contentAPI := fmt.Sprintf(`
interface I%[6]sState {
	isLoading: boolean
	isExecuted: boolean
	response?: %[3]s
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any
}

export const %[6]s = (%[2]s, autoExecute = true) => {
    const workspace = useParams<{ ws: string }>().ws
    const [controller, setController] = useState(new AbortController())

    const api = new Api()
    api.instance = AxiosAPI

    const [state, setState] =
        useState<I%[6]sState>({
            isLoading: true,
			isExecuted: false,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([%[5]s, autoExecute])
    )

    const sendRequest = (abortCtrl: AbortController) => {
		setState({
			...state,
			error: undefined,
			isLoading: true,
			isExecuted: true,
		})
        try {
			if (workspace !== undefined && workspace.length > 0) {
				setWorkspace(%[8]s)
			} else {
				setWorkspace('kaytu')
			}

            const paramsSignal = { ...params, signal: abortCtrl.signal }
			api.%[4]s
                .%[1]s(%[5]sSignal)
                .then((resp) => {
                    setState({
                        ...state,
                        error: undefined,
                        response: resp.data,
                        isLoading: false,
                        isExecuted: true,
                    })
                })
                .catch((err) => {
                    if (
                        err.name === 'AbortError' ||
                        err.name === 'CanceledError'
                    ) {
                        // Request was aborted
                    } else {
                        setState({
                            ...state,
                            error: err,
                            response: undefined,
                            isLoading: false,
                            isExecuted: true,
                        })
                    }
                })
        } catch (err) {
            setState({
                ...state,
                error: err,
                isLoading: false,
                isExecuted: true,
            })
        }
    }

    if (JSON.stringify([%[5]s, autoExecute]) !== lastInput) {
        setLastInput(JSON.stringify([%[5]s, autoExecute]))
    }

    useEffect(() => {
        if (autoExecute) {
            controller.abort()
            const newController = new AbortController()
            setController(newController)
            sendRequest(newController)
        }
    }, [lastInput])

    const { response } = state
    const { isLoading } = state
    const { isExecuted } = state
    const { error } = state
    const sendNow = () => {
		controller.abort()
		const newController = new AbortController()
		setController(newController)
		sendRequest(newController)
	}
    return { response, isLoading, isExecuted, error, sendNow }
}
`, apiName, req, resp, module, pmr, funcName, funcName[3:], setWorkspace)
		apiFiles[module] += contentAPI
	}

	ims := ""
	var imps []string
	for k := range imports {
		imps = append(imps, k)
	}
	sort.Strings(imps)

	for _, k := range imps {
		if strings.TrimSpace(k) == "any," {
			continue
		}
		ims += k + "\n"
	}
	for k, v := range apiFiles {
		apiFiles[k] = fmt.Sprintf(importFormat, ims) + v
		// 		apiFiles[k] = importFormat + v
		err = os.WriteFile(fmt.Sprintf("./src/api/%s.gen.ts", k), []byte(apiFiles[k]), os.ModePerm)
		if err != nil {
			panic(err)
		}
	}

	fmt.Println("=== generate finished")
}
