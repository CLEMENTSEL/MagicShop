"use client"
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import Image from 'next/image'
import styles from './products.module.css'
import Link from 'next/link'
import { getCookie } from "cookies-next";
import { notFound } from 'next/navigation';
import { Modal, Bag } from '../../../../components/Modal';


function Buy(id: any) {
  const access_token = getCookie("access_token");
  const decodedCookie = parseJwt(access_token);

  axios.post(`http://127.0.0.1:8000/currentOrders/${id}`, { user_id: Number(decodedCookie) }, {
    withCredentials: true,
  })
    .then(response => {
      console.log(response.data);
    });

}

function parseJwt(token: any) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const cookie = JSON.parse(window.atob(base64));
  const idUser = cookie.userID;
  return idUser;
}

export default function Products() {

  const access_token = getCookie("access_token");

  const [isOk, getApproval] = useState('');
  useEffect(() => {
    axios.post('http://127.0.0.1:8000/usertype', {
      cookie: {
        access_token: getCookie("access_token"),
      },
    }).then(response => {
      if (response.status === 200) {
        if (response.data.ok) {
          getApproval('ok');
        } else {
          window.location.href = 'http://127.0.0.1:3000/login';
        }
      } else {
        window.location.href = 'http://127.0.0.1:3000/login';
      }
    })
      .catch(function (error) {
      });
  }, []);

  if (access_token === undefined) {
    return notFound();
  }


  const [product, getProduct] = useState('');
  useEffect(() => {
    axios.get(('http://127.0.0.1:8000/products'), {
      withCredentials: true,
    })
      .then(response => {
        console.log("response:", response.data);
        getProduct(response.data);
      });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showBag, setShowBag] = useState(false);

  if (isOk == 'ok') {

    return (

      <>
        <video autoPlay muted loop className='fixed w-full h-full object-cover m-0 p-0 box-border -z-10'>
          <source src={'/assets/fond.mp4'} type="video/mp4" />
        </video>
        <Fragment>
        <header>
          <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
              <a href="/home/products" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="../../favicon.ico" className="h-8" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Brakebills Magic Shop</span>
              </a>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
                <Link href={`/home/products/orders`}>
                    <button className="relative outline-none cursor-pointer rounded-xl bg-custom-purpleA hover:bg-custom-purpleB font-sans flex items-center gap-4 p-1 text-white">
                    <div className={styles.defaultbtn}>
                      <span>Commandes</span>
                    </div>
                  </button>
                </Link>
                <button className={styles.shopbutton}  onClick={() => setShowBag(true)}>
                  <div className={styles.defaultbtn}>
                    <svg className="css-i6dzq1" strokeLinejoin="round" strokeLinecap="round" fill="none" strokeWidth="2" stroke="#ffd300" height="20" width="30" viewBox="0 0 24 24"><circle r="1" cy="21" cx="9"></circle><circle r="1" cy="21" cx="20"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span>Panier</span>
                  </div>
                  <div className={styles.hoverbtn}>
                    <svg className="css-i6dzq1" strokeLinejoin="round" strokeLinecap="round" fill="none" strokeWidth="2" stroke="#ffd300" height="20" width="30" viewBox="0 0 24 24"><circle r="1" cy="21" cx="9"></circle><circle r="1" cy="21" cx="20"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    <span>Acheter</span>
                  </div>
                  </button>
                <Bag isVisible={showBag} onClose={() => setShowBag(false)} />
                <Link href={`/home/profile`}>
                  <button className={styles.Btn}>Profil
                    <svg className={styles.svg} viewBox="0 0 512 512">
                      <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                  </button>
                </Link>
                <button className={styles.BtnL} onClick={() => setShowModal(true)}>
                  <div className={styles.signL}><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                  <div className={styles.textL}>Déconnexion</div>
                </button>
                <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
              </div>
              {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                </li>
              </ul>
            </div> */}
            </div>
          </nav>
        </header>
        <main>
          <div>
            <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
              <div className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
                {product && Array.isArray(product) && product.map((r: any, i: number) => (
                  <div className="p-5 bg-white bg-opacity-90 text-center transform duration-500 hover:-translate-y-2 rounded-2xl text-black min-h-full" key={r.id}>
                    <Image src={r.image} width={1000} height={1000} alt="Produit" />
                    <h1 className="text-2xl my-5">{r.item_name}</h1>
                    <p className="text-sm mb-5 h-full min-h-28 align-middle grid items-center w-full m-0">{r.description}</p>
                    <h2 className="font-semibold mb-5 h-full">§ {r.price}</h2>
                    <button className="p-2 px-6 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer" onClick={() => Buy(r.id)}>Ajouter au panier</button>
                  </div>
                ))}
              </div>
            </section>
            </div>
        </main>
        </Fragment >
      </>
    )
  }
  else if (isOk == 'notok') {
    return notFound();
  }
}
