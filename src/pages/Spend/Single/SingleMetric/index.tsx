import { Dayjs } from 'dayjs'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    id: string | undefined
}

export default function SingleSpendMetric({ activeTimeRange, id }: ISingle) {}
