import { Button, Flex, Grid, Metric, Text } from '@tremor/react'
import LoggedInLayout from '../../components/LoggedInLayout'
import stackImg from '../../icons/stack.png'

export default function Stack() {
    return (
        <LoggedInLayout currentPage="stack">
            <Flex justifyContent="center" className="md:mt-32">
                <Grid numItems={1} numItemsMd={2}>
                    <img src={stackImg} alt="stack" />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="center"
                        className="p-12"
                    >
                        <Metric>Remain calm</Metric>
                        <Text className="mt-3 mb-6">
                            We are working on it, check out the CLI for working
                            stacks
                        </Text>
                        <Button
                            onClick={() =>
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                document.getElementById('CLI').click()
                            }
                        >
                            Go to CLI
                        </Button>
                    </Flex>
                </Grid>
            </Flex>
        </LoggedInLayout>
    )
}
