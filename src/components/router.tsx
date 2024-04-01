"use client"
import { User } from '@/interfaces/user';
import './style.css'
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Link from 'next/link';

type LayoutProps = {
    children: ReactNode;
};

const RouterPage = ({children}: LayoutProps) => {
    const router = useRouter()

    const [token, setToken] = useState('');
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const data = localStorage.getItem('user')
        if (data) setUser(JSON.parse(data))
        const getToken = localStorage.getItem('access_token')
        if (getToken) setToken(getToken);
    }, [])

    const logout = () => {
        localStorage.clear()
        router.push('/login')
      }

    return(
        <div>
            {user && token && (
            <div className="nav">
                <div>
                    <p className="username">{ user?.name }</p>
                    <p className="point">
                        <small>May Point: </small>
                        <b>
                            <span style={{ color: user.point > 50 ? '#2ecc71' : '#e74c3c' }}>{ user?.point }</span>
                        </b>
                    </p>
                </div>
                <Link href='my-order'>My Order</Link>
                <button className="btn" onClick={logout}>Logout</button>
            </div>
            )}
            {children}
        </div>
    )
}

export default RouterPage
