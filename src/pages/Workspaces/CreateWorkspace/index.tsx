import DrawerPanel from '../../../components/DrawerPanel'

interface ICreateWorkspace {
    open: boolean
    onClose: any
}

export default function CreateWorkspace({ open, onClose }: ICreateWorkspace) {
    return (
        <DrawerPanel open={open} onClose={onClose}>
            hi
        </DrawerPanel>
    )
}
