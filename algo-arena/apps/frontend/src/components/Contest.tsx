import { UserContext } from '@/context/UserContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar';

const Contest = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (!user) {
            navigate("/signin")
            return
        }
    }, [user])

    return (
        <>
            <Navbar />
            Itachi
        </>
    )
}

export default Contest
