"use client"

import { apiUrl } from "@/constant/env";
import AuthGuard from "@/guard/auth";
import Image from 'next/image'
import { useEffect, useState } from 'react';

import './style.css'
import { Book } from "@/interfaces/book";
import { useRouter } from "next/navigation";

const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book>()
  const router = useRouter()
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('access_token') ?? '';
    setToken(token);
    (async() => {
      const res = await fetch(`${apiUrl}/book`)
    
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
    
      const data = await res.json()
      setBooks(data.data.data)
    })()
  }, [])

  useEffect(() => {
    (async() => {
      if (token.length > 0) {
        await fetchProfile() 
      }
    })()
  }, [token])

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

  const handleBookClick = (book:Book) => {
    setSelectedBook(book)
  }

  const toDetail = (book: Book) => {
    router.push(`/book/${book.id}`)
  }
  
  return (
    <div className='container'>
      <h1 className='title'>Book At Store</h1>

      <div className="list-books">
        {books?.map((book) => {
          const urls:any[] = book?.coverImage?.split('/') ?? []
          const loadImage = urls.slice(0, urls.length - 1).join('/')
          const imageLoader = ({ src, width, quality }:any) => {
            return `${loadImage}/${src}?w=${width}&q=${quality || 75}`
          }
          return (
          <div className='book-card' key={book?.id} onClick={() => handleBookClick(book)}>
            <div className='img-container'>
              <Image loader={imageLoader} src={urls[urls.length - 1]} alt={book?.title} className='card-img' width={500} height={500} />
            </div>
            <div className="detail-book">
              <p className="title-book">{book.title}</p>
              <p>{book.point}</p>
            </div>
            <div className="detail-book" style={{ display: selectedBook === book ? 'block' : 'none' }}>
                <button onClick={() => toDetail(book)} className="btn-order">Order</button>
              </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export default AuthGuard(Home)
