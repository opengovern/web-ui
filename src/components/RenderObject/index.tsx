import ReactJson from '@microlink/react-json-view'
import { Card } from '@tremor/react'

interface IRenderObjectProps {
    obj: any
}

export function RenderObject({ obj }: IRenderObjectProps) {
    return (
        /* <List>
            {Object.keys(obj).length > 0 &&
                Object.keys(obj).map((key) => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (Object.keys(obj[key]).length === 0) {
                            return null
                        }
                        return (
                            <div>
                                {key !== '0' && (
                                    <Title className="mt-6">
                                        {changeKeysToLabel
                                            ? snakeCaseToLabel(key)
                                            : key}
                                    </Title>
                                )}
                                <RenderObject obj={obj[key]} />
                            </div>
                        )
                    }

                    return (
                        <ListItem key={key} className="py-6 flex items-start">
                            <Text>
                                {changeKeysToLabel
                                    ? snakeCaseToLabel(key)
                                    : key}
                            </Text>
                            <Text className="text-gray-800 w-3/5 whitespace-pre-wrap text-end">
                                {String(obj[key])}
                            </Text>
                        </ListItem>
                    )
                })}
        </List> */
        <Card className="px-1.5 py-3 mb-2">
            <ReactJson src={obj} />
        </Card>
    )
}
