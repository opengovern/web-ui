import { useComplianceApiV1BenchmarksPoliciesDetail } from '../../../../../api/compliance.gen'

interface IBenchmarks {
    id: string | undefined
}

export default function Benchmarks({ id }: IBenchmarks) {
    const { response: policies } = useComplianceApiV1BenchmarksPoliciesDetail(
        String(id)
    )
    console.log(policies)
    return <div>hi</div>
}
