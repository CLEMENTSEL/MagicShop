"use client"
import Link from "next/link";
import styles from '../admin.module.css'
import { Field, Form, Formik } from 'formik';
import { FormControl, Input, FormErrorMessage, Button, Container } from '@chakra-ui/react'
import axios from 'axios';
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)
import React, { useState, useEffect, Fragment } from 'react';
import { getCookie, deleteCookie } from "cookies-next";
import { notFound } from "next/navigation";
import { Modal } from '../../../../../components/Modal';

const todoSchema = Yup.object({
  image: Yup.string(),
  item_name: Yup.string(),
  description: Yup.string(),
  price: Yup.string()
})

export default function ModifyProduct({ params }: {
  params: {
    productID: string
  }
}) {

  const access_token = getCookie("access_token");
  const [isOk, getApproval] = useState('');
  useEffect(() => {

    axios.post('http://127.0.0.1:8000/usertype', {
      cookie: {
        access_token: getCookie("access_token"),
      },
    }).then(response => {
      if (response.status === 200) {
        if (response.data.admin) {
          getApproval('ok');
        }
        else if (response.data.user) {
          getApproval('notok');
          return notFound();
        }
        else {
          return notFound();
        }
      } else {
        return notFound();
      }
    })
      .catch(function (error) {
      });
  }, []);
  

  if (access_token === undefined) {
    return notFound();
  }


  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

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
            <a href="/home/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="../.././favicon.ico" className="h-8" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Brakebills Magic Shop</span>
            </a>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
              <Link href={`/home/admin/users`}>
                <button className={styles.shopbutton}>
                  <div className={styles.defaultbtn}>
                    <span>Utilisateurs</span>
                  </div>
                </button>
              </Link>
              <Link href={`/home/admin/profile`}>
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
        <Link href={`/home/admin`}>
          <button className="cursor-pointer duration-200 hover:scale-125 active:scale-100" title="Go Back">
            <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="stroke-blue-300">
              <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
            </svg>
          </button>
        </Link>
        <div className="flex justify-center">
          <section className="container mx-auto px-0 md:px-0 w-2/4">
              <Formik
                initialValues={{
                  image: '',
                  item_name: '',
                  description: '',
                  price: '',
                }}
                validationSchema={todoSchema}
                onSubmit={(values) => {
                  console.log(values);
                  axios.post(`http://127.0.0.1:8000/products`, {
                    data: {
                      image: values.image,
                      item_name: values.item_name,
                      description: values.description,
                      price: values.price,
                    },
                  }, {
                    withCredentials: true,
                  })
                    .then(response => {
                      if (response.status === 200) {

                        if (response.data.notcreated) {
                          setErrorMsg(response.data.notcreated)
                        }
                        else if (response.data.created) {
                          setErrorMsg(response.data.created)
                          values.image = "";
                          values.item_name = "";
                          values.description = "";
                          values.price = "";
                          window.location.reload();
                        }
                      }
                    });
                }}
              >
                {
                  (props) => (
                    <Container className="flex justify-center">
                      <div className={styles.wrapper}>
                        <Form>
                          <a>{errorMsg}</a>
                          <h1>Créer un produit</h1>
                          <Field name='image'>
                            {({ field, form }: any) => (
                              <FormControl isInvalid={form.errors.image && form.touched.image}>
                                <div className={styles.inputboxregister}>
                                  <Input {...field} placeholder="Chemin de l'image" type="text" className={styles.input} name="image" />
                                  <FormErrorMessage className={styles.formerrormessage}>{form.errors.image}</FormErrorMessage>
                                </div>
                              </FormControl>
                            )}
                          </Field>
                          <Field name='item_name'>
                            {({ field, form }: any) => (
                              <FormControl isInvalid={form.errors.item_name && form.touched.item_name}>
                                <div className={styles.inputboxregister}>
                                  <Input {...field} placeholder="Nom du produit" type="text" className={styles.input} name="item_name" />
                                  <FormErrorMessage className={styles.formerrormessage}>{form.errors.item_name}</FormErrorMessage>
                                </div>
                              </FormControl>
                            )}
                          </Field>
                          <Field name='price'>
                            {({ field, form }: any) => (
                              <FormControl isInvalid={form.errors.price && form.touched.price}>
                                <div className={styles.inputboxregister}>
                                  <Input {...field} placeholder="Prix (en texte)" type="text" className={styles.input} name="price" />
                                  <FormErrorMessage className={styles.formerrormessage}>{form.errors.price}</FormErrorMessage>
                                </div>
                              </FormControl>
                            )}
                          </Field>
                          <Field name='description'>
                            {({ field, form }: any) => (
                              <FormControl isInvalid={form.errors.description && form.touched.description}>
                                <div className={styles.inputboxregisterDESC}>
                                  <Input {...field} placeholder="Description" type="text" className={styles.input} name="description" />
                                  <FormErrorMessage className={styles.formerrormessage}>{form.errors.description}</FormErrorMessage>
                                </div>
                              </FormControl>
                            )}
                          </Field>
                          <div className={styles.buttoncontainer}>
                            <Button type="submit" className={styles.button}>
                              <span className={styles.buttoncontent}>Créer</span>
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </Container>
                  )
                }
              </Formik>
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
