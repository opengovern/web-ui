import { Button, Flex, Title } from '@tremor/react'
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'


import axios from 'axios'
import { useEffect, useState } from 'react'
import { Integration } from '../types'
import { Schema } from 'react-markdown/lib/ast-to-react'

interface MemberInviteProps {
    name?: string
    integration_type: string
    schema?: Schema
}

export default function CredentialsList({ name, integration_type, schema }: MemberInviteProps) {
    const navigate = useNavigate()
    const [row, setRow] = useState<Integration[]>([])
   
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [total_count, setTotalCount] = useState<number>(0)

    const GetIntegrations = () => {
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('openg_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        const body = {
            intergration_type: integration_type,
        }
        axios
            .post(
                `${url}/main/integration/api/v1/integrations/list`,
                body,
                config
            )
            .then((res) => {
                const data = res.data

                setTotalCount(data.total_count)
                setRow(data.integrations)
            })
            .catch((err) => {
                console.log(err)
            })
    }
  

    useEffect(() => {
        GetIntegrations()
      
    }, [])

    return (
        <>
         
        </>
    )
}
