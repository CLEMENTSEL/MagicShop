"use client"
import Link from 'next/link'
import styles from './Modal.module.css'
import { getCookie, deleteCookie } from "cookies-next";

import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';

function parseJwt(token: any) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const cookie = JSON.parse(window.atob(base64));
    const idUser = cookie.userID;
    return idUser;
}

function getBag(props: any) {
    try {
        let [bag, getBag] = useState('');
        useEffect(() => {
            axios.get((`http://127.0.0.1:8000/currentOrders/${props}`), {
    withCredentials: true,
  })
                .then(response => {
                    console.log("response:", response.data);
                    getBag(response.data.bag);
                });
        }, []);

        return bag;
    }
    catch (error) {
        return {'description': 'Panier Vide'};
    }
}

function deleteItemFromBag(product_id: any, user_id: any) {
    axios.put(`http://127.0.0.1:8000/currentOrders/${user_id}`, {
        product_id: product_id,
        user_id: user_id,
    }, {
        withCredentials: true,
    })
        .then(response => {
            if (response.status === 200) {
                console.log(response.data.deleted);
                window.location.reload();
            }
        });
}

function buy(user_id: any) {
    axios.post(`http://127.0.0.1:8000/currentOrdersToOrders/${user_id}`, {
        user_id: user_id,
    }, {
        withCredentials: true,
    })
        .then(response => {
            if (response.status === 200) {
                console.log("Produits achetés");
                window.location.reload();
            }
        });
}

const deleteCookieFromPage = () => {
    deleteCookie('access_token');
};

const Modal = ({ isVisible, onClose }: any) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose();
    }

    return (
        <div className='fixed inset-0 flex justify-end items-start top-16 right-0 left-0 z-50' id='wrapper' onClick={handleClose}>
            <div className='w-[600px] flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>X</button>
                <div className='bg-white p-2 rounded bg-opacity-95 flex justify-center text-center items-center top-0 right-0'>
                    <h1 className='px-5'>Se déconnecter ?</h1>
                    <Link href={`/home`} className='' onClick={deleteCookieFromPage}>
                        <button className={styles.BtnL}>
                            <div className={styles.signL}><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
                            <div className={styles.textL}>Déconnexion</div>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const Bag = ({ isVisible, onClose }: any) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') onClose();
    }

    const access_token = getCookie("access_token");
    const decodedCookie = parseJwt(access_token);
    let bag = getBag(Number(decodedCookie));

    return (
        <div className='fixed inset-0 flex justify-center items-center z-50' id='wrapper' onClick={handleClose}>
            <div className='w-[600px] flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>X</button>
                <div className='bg-white p-2 rounded bg-opacity-95 flex flex-col items-center'>
                    {bag && Array.isArray(bag) && bag.map((r: any, i: number) => (
                        <div key={r.id} className='mb-4 w-full'>
                            <h1 className='mb-2'>{r.item_name} § {r.price}      <button
                                className="bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer px-1"
                                onClick={() => deleteItemFromBag(r.id, decodedCookie)}
                            >
                                Supprimer
                            </button></h1>
                            
                        </div>
                    ))}
                    <button
                        className="bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer px-4 py-2"
                        onClick={() => buy(decodedCookie)}
                    >
                        Acheter
                    </button>
                </div>
            </div>
        </div>
    )
}

export {Modal, Bag};