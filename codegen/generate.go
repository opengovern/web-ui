package main

import (
	"fmt"
	"os"
	"regexp"
	"sort"
	"strings"
)

func main() {
	bytes, err := os.ReadFile("./src/api/api.ts")
	if err != nil {
		panic(err)
	}

	content := string(bytes)

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

	r, err := regexp.Compile(`([\w\d]+):\s+\(([\w\n\|\[\]\(\)\?\'\d\s:,=\{\}]+)\)\s+=>[\s\n]+this.request<([\w\s\,\<\>\[\]\d]+),\s+([\w\<\>\[\]\d]+)>`)
	if err != nil {
		panic(err)
	}

	r2, err := regexp.Compile(`\s+([\w\d]+)\s+=\s+\{\n`)
	if err != nil {
		panic(err)
	}

	matches := r.FindAllStringSubmatch(content, -1) // matches is [][]string

	imports := map[string]interface{}{}
	importFormat := `
import useSWR from 'swr'
import React, { useState, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import {
    Api,
%s
    RequestParams,
} from './api'

import AxiosAPI, { setWorkspace } from './ApiConfig'
import { useParams } from 'react-router-dom'

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

		contentAPI := fmt.Sprintf(`
interface I%[6]sState {
	isLoading: boolean
	response?: %[3]s
	error?: any
}

export const %[6]s = (%[2]s, wait: boolean = false) => {
    const workspace = useParams<{ ws: string }>().ws

    const api = new Api()
    api.instance = AxiosAPI

    if (workspace !== undefined && workspace.length > 0) {
        setWorkspace(workspace)
    } else {
        setWorkspace('keibi')
    }

    const [state, setState] =
        useState<I%[6]sState>({
            isLoading: true,
        })
    const [lastInput, setLastInput] = useState<string>(
        JSON.stringify([%[5]s, wait])
    )

    const sendRequest = () => {
		setState({
			...state,
			isLoading: true,
		})
        try {
            api.%[4]s
                .%[1]s(%[5]s)
                .then((resp) => {
                    setState({
                        ...state,
                        response: resp.data,
                        isLoading: false,
                    })
                })
                .catch((err) => {
                    setState({ ...state, error: err })
                })
        } catch (err) {
            setState({ ...state, error: err })
        }
    }

    if (JSON.stringify([%[5]s, wait]) !== lastInput) {
        setLastInput(JSON.stringify([%[5]s, wait]))
    }

    useEffect(() => {
        if (!wait) {
            sendRequest()
        }
    }, [lastInput])

	const response = state.response
	const isLoading = state.isLoading
	const error = state.error
    return {response, isLoading, error}
}
`, apiName, req, resp, module, pmr, funcName)
		apiFiles[module] += contentAPI
	}

	ims := ""
	var imps []string
	for k := range imports {
		imps = append(imps, k)
	}
	sort.Strings(imps)
	
	for _, k := range imps {
		ims += k + "\n"
	}
	for k, v := range apiFiles {
		apiFiles[k] = fmt.Sprintf(importFormat, ims) + v
		err = os.WriteFile(fmt.Sprintf("./src/api/%s.gen.ts", k), []byte(apiFiles[k]), os.ModePerm)
		if err != nil {
			panic(err)
		}
	}

	fmt.Println("=== generate finished")
}
