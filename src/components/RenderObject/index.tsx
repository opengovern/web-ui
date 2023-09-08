import { List, ListItem, Text, Title } from '@tremor/react'
import { snakeCaseToLabel } from '../../utilities/labelMaker'

interface IRenderObjectProps {
    obj: any
    changeKeysToLabel?: boolean
}

export function RenderObject({
    obj,
    changeKeysToLabel = true,
}: IRenderObjectProps) {
    console.log(changeKeysToLabel)
    console.log(obj)
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
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {String(obj[key])}
                            </Text>
                        </ListItem>
                    )
                })}
        </List>
    )
}
