type IProps = {
    error?: any
}
export default function NotFound({ error }: IProps) {
    console.log(error)
    return (
        <div>
            <h1>404</h1>
        </div>
    )
}
