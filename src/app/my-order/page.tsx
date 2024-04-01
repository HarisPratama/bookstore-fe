"use client"
import './style.css'
import { apiUrl } from "@/constant/env";
import { Order } from "@/interfaces/order";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [token, setToken] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const getToken = localStorage.getItem('access_token') ?? '';
        setToken(getToken)
    }, [])

    useEffect(() => {
        (async () => {
            if (token.length > 0) { 
                await fetchOrder()
            }
        })()
    }, [token])

    const fetchOrder = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);

        const req = await fetch(`${apiUrl}/order`, {
            headers: myHeaders
        })

        const resp = await req.json();
        setOrders(resp.data)
    }

    const cancelOrder = async (id:number) => {
        setLoading(true)
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", 'Bearer ' + token);
            const req = await fetch(`${apiUrl}/order/${id}`, {
                headers: myHeaders,
                method: 'DELETE'
            })
    
            const resp = await req.json()
    
            if (resp?.status === 'success') {
                toast('Order successful, thank you for ordering')
                await fetchOrder()
            } else {
                toast('Oops somethings wrong, try again later')
            }

            setLoading(false)
        } catch (error) {
            toast('Oops somethings wrong, try again later')
            setLoading(false)
        }
    }

    return(
        <div className='container'>
            {orders?.map((order) => {
                return (
                    <div className='card' key={order.id}>
                        <div>
                            <p>{order.book.title}</p>
                            <p>{order.book.point}</p>
                            {order.status == 'in-progress' && 
                                <button disabled={loading} className='btn-cancel' onClick={() => cancelOrder(order.id)}>{loading ? 'Loading...' : 'Cancel Order'}</button>
                            }
                        </div>
                        <div className='bagde-status' style={{ background: order.status == 'in-progress' ? '#3498db' : order.status == 'success' ? '#2ecc71' : '#e74c3c' }}>
                            {order.status}
                        </div>
                    </div>
                )}
            )}
        </div>
    )
}

export default MyOrders;