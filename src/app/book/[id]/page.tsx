"use client"
import './style.css'
import { apiUrl } from "@/constant/env";
import { Book } from "@/interfaces/book";
import Image from 'next/image'
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';


const DetailBook = ({ params }: { params: { id: string } }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [book, setBook] = useState<Book>();
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token') ?? '';
        setToken(token);
        (async () => {
            if (params.id) {
                const res = await fetch(`${apiUrl}/book/${params.id}`)
    
                if (!res.ok) {
                    throw new Error('Failed to fetch data')
                }
                
                const data = await res.json()
                setBook(data.data)  
            };
        })();
    }, [params.id])

    useEffect(() => {
        const urls:string[] = book?.coverImage?.split('/') ?? []
        setUrls(urls)
    }, [book])

    const imageLoader = ({ src, width, quality }:any) => {
        const loadImage = urls.slice(0, urls.length - 1).join('/')
        return `${loadImage}/${src}?w=${width}&q=${quality || 75}`
    }

    const fetchProfile = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token);

        const req = await fetch(`${apiUrl}/auth/current-user`, {
            headers: myHeaders
        })

        const resp = await req.json()
        if (resp?.data) {
            localStorage.setItem('user', JSON.stringify(resp.data))
        }
    }

    const order = async (book: Book) => {
        setLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", 'Bearer ' + token);

        const urlencoded = new URLSearchParams();
        urlencoded.append("bookId", `${book.id}`);
        urlencoded.append("bookPoint", `${book.point}`);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
        };
        try {
            const resp = await fetch(`${apiUrl}/order`, requestOptions)
            const data = await resp.json()
            if (data?.status === 'success') {
                toast('Order successful, thank you for ordering')
                await fetchProfile()
            } else {
                toast('Oops somethings wrong, try again later')
            }

            setLoading(false)
        } catch (error) {
            toast('Oops somethings wrong, try again later')
            setLoading(false)
        }
    }
    
    return (
        <div className="container">
            {book && <Image loader={imageLoader} src={urls[urls.length - 1]} alt={book?.title} className='card-img' width={500} height={500} />}
            <h1>{book?.title}</h1>
            <h3>${book?.point}</h3>

            {book && <button disabled={loading} onClick={() => order(book)} className="btn-order">{loading ? 'Your order is being processed...' : 'Order'}</button>}
        </div>
    )
}

export default DetailBook;
