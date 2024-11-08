import { Button, Flex, Title } from '@tremor/react'
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'

import {
    ConnectorToCredentialType,
    StringToProvider,
} from '../../../types/provider'
import {
    useIntegrationApiV1ConnectorsMetricsList,
    useIntegrationApiV1CredentialsList,
} from '../../../api/integration.gen'
import TopHeader from '../../../components/Layout/Header'
import {
    defaultTime,
    searchAtom,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Integration } from './types'
import { Schema } from 'react-markdown/lib/ast-to-react'
import { Tabs } from '@cloudscape-design/components'

import IntegrationList from './Integration'
import CredentialsList from './Credentials'

export default function TypeDetail() {
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const { name } = useParams()
    const { state } = useLocation()
    const [shcema, setSchema] = useState<Schema>()
    const [loading, setLoading] = useState<boolean>(false)





   
    const GetSchema = () => {
        return JSON.parse(`
            {
    "integration_type_id": "azure_subscription",
    "integration_name": "Azure Subscription",
    "help_text_md": "Azure Subscription integration enables seamless management of your Azure resources. [Get Started](https://docs.azure.com).",
    "platform_documentation": "https://docs.azure.com",
    "provider_documentation": "https://azure.microsoft.com",
    "icon": "azure.svg",
    "discover": {
      "description": "Capture credentials required for discovery of Azure Subscription integrations.",
      "credentialInputs": [
        {
          "type": "spn_password_based",
          "label": "SPN Password Based",
          "priority": 1,
          "fields": [
            {
              "name": "tenant_id",
              "label": "Tenant ID",
              "inputType": "text",
              "required": true,
              "order": 1,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "Tenant ID must be a valid UUID."
              },
              "info": "Unique tenant identifier.",
              "external_help_url": "https://docs.azure.com/tenant-id"
            },
            {
              "name": "client_id",
              "label": "Client ID",
              "inputType": "text",
              "required": true,
              "order": 2,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "Client ID must be a valid UUID."
              },
              "info": "Application's client identifier.",
              "external_help_url": "https://docs.azure.com/client-id"
            },
            {
              "name": "spn_object_id",
              "label": "SPN Object ID",
              "inputType": "text",
              "required": true,
              "order": 3,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "SPN Object ID must be a valid UUID."
              },
              "info": "Service Principal Object ID.",
              "external_help_url": "https://docs.azure.com/spn-object-id"
            },
            {
              "name": "client_password",
              "label": "Client Password",
              "inputType": "password",
              "required": true,
              "order": 4,
              "validation": {
                "minLength": 8,
                "maxLength": 128,
                "errorMessage": "Client Password must be between 8 and 128 characters."
              },
              "info": "Secure password for client authentication."
            }
          ]
        },
        {
          "type": "spn_certificate",
          "label": "SPN Certificate",
          "priority": 2,
          "fields": [
            {
              "name": "tenant_id",
              "label": "Tenant ID",
              "inputType": "text",
              "required": true,
              "order": 1,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "Tenant ID must be a valid UUID."
              },
              "info": "Unique tenant identifier.",
              "external_help_url": "https://docs.azure.com/tenant-id"
            },
            {
              "name": "client_id",
              "label": "Client ID",
              "inputType": "text",
              "required": true,
              "order": 2,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "Client ID must be a valid UUID."
              },
              "info": "Application's client identifier.",
              "external_help_url": "https://docs.azure.com/client-id"
            },
            {
              "name": "spn_object_id",
              "label": "SPN Object ID",
              "inputType": "text",
              "required": true,
              "order": 3,
              "validation": {
                "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$",
                "errorMessage": "SPN Object ID must be a valid UUID."
              },
              "info": "Service Principal Object ID.",
              "external_help_url": "https://docs.azure.com/spn-object-id"
            },
            {
              "name": "certificate",
              "label": "Certificate (PEM Format)",
              "inputType": "file",
              "required": true,
              "order": 4,
              "validation": {
                "fileTypes": [".pem"],
                "maxFileSizeMB": 5,
                "errorMessage": "Please upload a valid PEM certificate file not exceeding 5MB."
              },
              "info": "Upload your PEM formatted certificate.",
              "external_help_url": "https://docs.azure.com/certificate-upload"
            },
            {
              "name": "certificate_password",
              "label": "Certificate Password",
              "inputType": "password",
              "required": false,
              "order": 5,
              "validation": {
                "minLength": 8,
                "maxLength": 128,
                "errorMessage": "Certificate Password must be between 8 and 128 characters."
              },
              "info": "Password for your certificate (if applicable).",
              "external_help_url": "https://docs.azure.com/certificate-password",
              "conditional": {
                "field": "certificate",
                "isPresent": true
              }
            }
          ]
        }
      ]
    },
    "list": {
      "credentials": {
        "defaultPageSize": 10,
        "display": {
          "displayFields": [
            {
              "name": "credential_type",
              "label": "Credential Type",
              "fieldType": "text",
              "order": 1,
              "sortable": true,
              "filterable": true,
              "info": "Type of Credential (SPN Password/Certificate)."
            },
            {
              "name": "spn_object_id",
              "label": "SPN Object ID",
              "fieldType": "text",
              "order": 2,
              "sortable": true,
              "filterable": true,
              "info": "Service Principal Object ID."
            },
            {
              "name": "client_id",
              "label": "Client ID",
              "fieldType": "text",
              "order": 3,
              "sortable": true,
              "filterable": true,
              "info": "Application's client identifier."
            },
            {
              "name": "integration_count",
              "label": "Integrations Using Credential",
              "fieldType": "number",
              "order": 4,
              "sortable": true,
              "filterable": false,
              "info": "Number of integrations using this credential."
            }
          ],
          "allowedActions": ["view", "update", "delete"]
        }
      },
      "integrations": {
        "defaultPageSize": 15,
        "display": {
          "id": "azure_subscription",
          "name": "Azure Subscription",
          "description": "Displays current Azure Subscription integrations.",
          "logo": "azure.svg",
          "help_text": "View your current Azure Subscription integrations. [Learn more](https://docs.azure.com).",
          "displayFields": [
            {
              "name": "subscription_id",
              "label": "Subscription ID",
              "fieldType": "text",
              "order": 1,
              "sortable": true,
              "filterable": true,
              "info": "Unique identifier for the Azure subscription."
            },
            {
              "name": "subscription_name",
              "label": "Subscription Name",
              "fieldType": "text",
              "order": 2,
              "sortable": true,
              "filterable": true,
              "info": "Name of the Azure subscription."
            },
            {
              "name": "tenant_id",
              "label": "Tenant ID",
              "fieldType": "text",
              "order": 3,
              "sortable": true,
              "filterable": true,
              "info": "Tenant ID associated with the subscription."
            },
            {
              "name": "state",
              "label": "State",
              "fieldType": "status",
              "order": 4,
              "sortable": true,
              "filterable": true,
              "info": "Current state of the Azure Subscription integration.",
              "statusOptions": [
                {
                  "value": "active",
                  "label": "Active",
                  "color": "green"
                },
                {
                  "value": "inactive",
                  "label": "Inactive",
                  "color": "grey"
                },
                {
                  "value": "pending",
                  "label": "Pending",
                  "color": "orange"
                }
              ]
            },
            {
              "name": "created_at",
              "label": "Created At",
              "fieldType": "date",
              "order": 5,
              "sortable": true,
              "filterable": false,
              "info": "Timestamp when the integration was created."
            },
            {
              "name": "last_updated",
              "label": "Last Updated",
              "fieldType": "date",
              "order": 6,
              "sortable": true,
              "filterable": false,
              "info": "Timestamp when the integration was last updated."
            }
          ],
          "allowedActions": ["view", "update", "delete", "health_check"]
        }
      }
    },
    "view": {
      "integration_details": {
        "description": "View detailed information about a specific Azure Subscription integration.",
        "fields": [
          {
            "name": "uuid",
            "label": "Integration UUID",
            "fieldType": "text",
            "order": 1,
            "info": "Unique identifier (UUID) for the integration."
          },
          {
            "name": "subscription_id",
            "label": "Subscription ID",
            "fieldType": "text",
            "order": 2,
            "info": "Unique identifier for the Azure subscription."
          },
          {
            "name": "subscription_name",
            "label": "Subscription Name",
            "fieldType": "text",
            "order": 3,
            "info": "Name of the Azure subscription."
          },
          {
            "name": "tenant_id",
            "label": "Tenant ID",
            "fieldType": "text",
            "order": 4,
            "info": "Tenant ID associated with the subscription."
          },
          {
            "name": "state",
            "label": "State",
            "fieldType": "status",
            "order": 5,
            "info": "Current state of the Azure Subscription integration.",
            "statusOptions": [
              {
                "value": "active",
                "label": "Active",
                "color": "green"
              },
              {
                "value": "inactive",
                "label": "Inactive",
                "color": "grey"
              },
              {
                "value": "pending",
                "label": "Pending",
                "color": "orange"
              }
            ]
          },
          {
            "name": "created_at",
            "label": "Created At",
            "fieldType": "date",
            "order": 6,
            "info": "Timestamp when the integration was created."
          },
          {
            "name": "last_updated",
            "label": "Last Updated",
            "fieldType": "date",
            "order": 7,
            "info": "Timestamp when the integration was last updated."
          },
          {
            "name": "additional_notes",
            "label": "Additional Notes",
            "fieldType": "textarea",
            "order": 8,
            "info": "Any additional information about the integration."
          }
        ],
        "allowedActions": ["view", "update", "delete", "health_check"]
      },
      "credential_details": {
        "description": "View detailed information about a specific credential.",
        "fields": [
          {
            "name": "uuid",
            "label": "Credential UUID",
            "fieldType": "text",
            "order": 1,
            "info": "Unique identifier (UUID) for the credential."
          },
          {
            "name": "credential_type",
            "label": "Credential Type",
            "fieldType": "text",
            "order": 2,
            "info": "Type of Credential (SPN Password/Certificate)."
          },
          {
            "name": "spn_object_id",
            "label": "SPN Object ID",
            "fieldType": "text",
            "order": 3,
            "info": "Service Principal Object ID."
          },
          {
            "name": "client_id",
            "label": "Client ID",
            "fieldType": "text",
            "order": 4,
            "info": "Application's client identifier."
          },
          {
            "name": "integration_count",
            "label": "Integrations Using Credential",
            "fieldType": "number",
            "order": 5,
            "info": "Number of integrations using this credential."
          },
          {
            "name": "client_password",
            "label": "Client Password",
            "fieldType": "password",
            "order": 6,
            "info": "Secure password for client authentication."
          },
          {
            "name": "certificate",
            "label": "Certificate (PEM Format)",
            "fieldType": "file",
            "order": 7,
            "info": "Your PEM formatted certificate."
          },
          {
            "name": "certificate_password",
            "label": "Certificate Password",
            "fieldType": "password",
            "order": 8,
            "info": "Password for your certificate (if applicable).",
            "conditional": {
              "field": "certificate",
              "isPresent": true
            }
          },
          {
            "name": "additional_info",
            "label": "Additional Info",
            "fieldType": "textarea",
            "order": 9,
            "info": "Any additional information about the credential."
          }
        ],
        "allowedActions": ["view", "update", "delete"]
      }
    },
    "actions": {
      "credentials": [
        {
          "type": "view",
          "label": "View"
        },
        {
          "type": "update",
          "label": "Update",
          "editableFields": [
            "client_password",
            "certificate",
            "certificate_password",
            "additional_info"
          ]
        },
        {
          "type": "delete",
          "label": "Delete",
          "confirm": {
            "message": "Are you sure you want to delete this credential? This action cannot be undone.",
            "condition": {
              "field": "integration_count",
              "operator": "==",
              "value": 0,
              "errorMessage": "Credential cannot be deleted because it is used by active integrations."
            }
          }
        }
      ],
      "integrations": [
        {
          "type": "view",
          "label": "View"
        },
        {
          "type": "update",
          "label": "Update",
          "editableFields": [
            "subscription_name",
            "subscription_id",
            "state",
            "additional_notes"
          ]
        },
        {
          "type": "delete",
          "label": "Delete",
          "confirm": {
            "message": "Are you sure you want to delete this integration? This action cannot be undone."
          }
        },
        {
          "type": "health_check",
          "label": "Health Check",
          "tooltip": "Run a health check on the integration to verify connectivity and configuration."
        }
      ]
    }
  }
  
            `)
  
        
        // let url = ''
        // if (window.location.origin === 'http://localhost:3000') {
        //     url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        // } else {
        //     url = window.location.origin
        // }
        // // @ts-ignore
        // const token = JSON.parse(localStorage.getItem('openg_auth')).token

        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // }

        // const body = {
        //     intergration_type: state.connector,
        // }
        // axios
        //     .post(
        //         `${url}/main/integration/api/v1/integrations/list`,
        //         body,
        //         config
        //     )
        //     .then((res) => {
        //         const data = res.data

        //         setRow(data)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
    }
    
    useEffect(()=>{
        setSchema(GetSchema())
    },[])


    return (
        <>
            <TopHeader breadCrumb={[name]} />
            <Tabs
                tabs={[
                    {
                        id: '0',
                        label: 'Integrations',
                        content: <IntegrationList
                            schema={shcema}
                            name={name}
                            integration_type={state.connector}
                        />,
                    },
                    {
                        id: '1',
                        label: 'Credentials',
                        content: <CredentialsList
                            schema={shcema}
                            name={name}
                            integration_type={state.connector}
                        />
                        ,
                    },
                ]}
            />
        </>
    )
}
