import { Bold, List, ListItem, Text } from '@tremor/react'
import React from 'react'

type IProps = {
    connection: any
    index: number
}
export function ConnectionDetails({ connection, index }: IProps) {
    // eslint-disable-next-line react/no-unstable-nested-components
    function RenderObject({ obj }: any) {
        return (
            <List>
                {Object.keys(obj).length > 0 &&
                    Object.keys(obj).map((key) => {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            return (
                                <div>
                                    {key !== '0' ? (
                                        <Text className="font-bold mt-10 mb-2">
                                            {key}
                                        </Text>
                                    ) : null}
                                    <RenderObject obj={obj[key]} />
                                </div>
                            )
                        }
                        return (
                            <ListItem key={key} className="break-words">
                                <Text>{key}</Text>
                                <div>
                                    <Bold>{String(obj[key])}</Bold>
                                </div>
                            </ListItem>
                        )
                    })}
            </List>
        )
    }
    return (
        <div>
            <RenderObject obj={connection[index]} />
        </div>
    )
}
