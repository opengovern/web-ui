type IProps = {
    error?: any
}
const NotFound = ({error}: IProps) => {
    console.log(error)
    return (
        <div>
            <h1>404</h1>
        </div>
    )
}

export default NotFound
