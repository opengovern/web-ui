import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Flex,
    Text,
} from '@tremor/react'
import { useEffect, useState } from 'react'

const providerList = ['AWS', 'Azure']
const personaList = ['Developer', 'Security', 'Executive', 'DevOps', 'Product']

interface IFilters {
    onProviderChange: (p: string[]) => void
    onPersonaChange: (p: string[]) => void
}

export default function Filters({
    onProviderChange,
    onPersonaChange,
}: IFilters) {
    const [provider, setProvider] = useState<string[]>([])
    const [persona, setPersona] = useState<string[]>([])

    useEffect(() => onPersonaChange(persona), [persona])
    useEffect(() => onProviderChange(provider), [provider])

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="w-64 pr-6 border-r border-r-gray-200 gap-4"
        >
            <Accordion
                className="w-56 border-0 rounded-none bg-transparent"
                defaultOpen
            >
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="w-3/4 truncate text-start font-semibold">
                        Connector
                    </Text>
                </AccordionHeader>
                <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="px-3 py-2 gap-1.5"
                    >
                        {providerList.map((p) => (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                            <label
                                htmlFor={p}
                                className="flex items-center gap-2"
                            >
                                <input
                                    id={p}
                                    type="checkbox"
                                    checked={provider.includes(p)}
                                    onClick={() => {
                                        let arr = provider
                                        if (provider.includes(p)) {
                                            arr.splice(arr.indexOf(p), 1)
                                        } else {
                                            arr = [...provider, p]
                                        }
                                        setProvider(arr)
                                    }}
                                    className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <Text>{p}</Text>
                            </label>
                        ))}
                    </Flex>
                </AccordionBody>
            </Accordion>
            <Accordion
                className="w-56 border-0 rounded-none bg-transparent"
                defaultOpen
            >
                <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                    <Text className="w-3/4 truncate text-start font-semibold">
                        Persona
                    </Text>
                </AccordionHeader>
                <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="px-3 py-2 gap-1.5"
                    >
                        {personaList.map((p) => (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                            <label
                                onClick={() =>
                                    setPersona((prevState) => {
                                        if (persona.includes(p)) {
                                            const arr = persona
                                            arr.splice(arr.indexOf(p), 1)
                                            return arr
                                        }
                                        return [...prevState, p]
                                    })
                                }
                                htmlFor={p}
                                className="flex items-center gap-2"
                            >
                                <input
                                    id={p}
                                    type="checkbox"
                                    checked={persona.includes(p)}
                                    className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <Text>{p}</Text>
                            </label>
                        ))}
                    </Flex>
                </AccordionBody>
            </Accordion>
        </Flex>
    )
}
