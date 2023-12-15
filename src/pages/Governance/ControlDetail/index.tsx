import { useParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { useComplianceApiV1ControlsSummaryDetail } from '../../../api/compliance.gen'

export default function ControlDetail() {
    const { controlId } = useParams()
    const { response } = useComplianceApiV1ControlsSummaryDetail(
        String(controlId)
    )
    console.log(response)
    return <Layout currentPage="compliance">hi</Layout>
}
