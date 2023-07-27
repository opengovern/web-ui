import { Bold, List, ListItem, Text, Title } from '@tremor/react'
import { snakeCaseToLabel } from '../../utilities/labelMaker'

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
                                {key !== '0' && (
                                    <Title className="mt-6">
                                        {snakeCaseToLabel(key)}
                                    </Title>
                                )}
                                <RenderObject obj={obj[key]} />
                            </div>
                        )
                    }

                    return (
                        <ListItem key={key} className="py-6 flex items-start">
                            <Text>{snakeCaseToLabel(key)}</Text>
                            <Text className="text-gray-900 w-3/5 whitespace-pre-wrap text-end">
                                {String(obj[key])}
                            </Text>
                        </ListItem>
                    )
                })}
        </List>
    )
}
