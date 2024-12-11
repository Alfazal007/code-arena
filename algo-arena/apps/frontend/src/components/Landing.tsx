import { UserContext } from '@/context/UserContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
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
            {JSON.stringify(user)}
        </>
    )
}

export default Landing
