import { Bold, List, ListItem, Text } from '@tremor/react'

export function RenderObject({ obj }: any) {
    return (
        <List>
            {Object.keys(obj).length > 0 &&
                Object.keys(obj).map((key) => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (Object.keys(obj[key]).length === 0) {
                            return null
                        }
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
