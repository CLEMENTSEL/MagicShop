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


const deleteCookieFromPage = () => {
  deleteCookie('access_token');
};

const todoSchema = Yup.object({
  username: Yup.string().min(3, "Le username doit faire au minimum 3 caractères").max(20, "Le username doit faire au maximum 20 caractères").matches(/[a-zA-Z0-9_-]/, 'Seulement les lettres, chiffres et - _ sont autorisées'),
  firstName: Yup.string().min(2, "Le prénom doit faire au minimum 2 caractères").max(20, "Le prénom doit faire au maximum 20 caractères").matches(/[a-zA-Z]/, 'Seulement les lettres sont autorisées'),
  lastName: Yup.string().min(2, "Le nom doit faire au minimum 2 caractères").max(20, "Le nom doit faire au maximum 20 caractères").matches(/[a-zA-Z]/, 'Seulement les lettres sont autorisées'),
  email: Yup.string().email("L'email doit être valide"),
  password: Yup.string().min(12, "Le mot de passe doit faire minimum 12 caractères").max(30, "Le mot de passe doit faire maximum 30 caractères")
    .minLowercase(1, "Le mot de passe doit contenir au moins 1 minuscule")
    .minUppercase(1, "Le mot de passe doit contenir au moins 1 majuscule")
    .minNumbers(1, "Le mot de passe doit contenir au moins 1 chiffre")
    .minSymbols(1, "Doit contenir au moins 1 caractère spécial"),
  setPassword: Yup.string().min(12, "Le mot de passe doit faire minimum 12 caractères").max(30, "Le mot de passe doit faire maximum 30 caractères")
    .minLowercase(1, "Le mot de passe doit contenir au moins 1 minuscule")
    .minUppercase(1, "Le mot de passe doit contenir au moins 1 majuscule")
    .minNumbers(1, "Le mot de passe doit contenir au moins 1 chiffre")
    .minSymbols(1, "Doit contenir au moins 1 caractère spécial")
})

function parseJwt(token: any) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const cookie = JSON.parse(window.atob(base64));
  const idUser = cookie.userID;
  return idUser;
}

function getProfile(props: any) {
  let [product, getProduct] = useState('');
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/users/${props}`, {
      withCredentials: true,
    })
      .then(response => {
        console.log("response:", response.data);
        getProduct(response.data);
      });
  }, []);

  return product;
}

export default function UniqueUser() {

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
    

  const decodedCookie = parseJwt(access_token);
  // console.log(parseJwt(access_token));

  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);


  let profileInfos = getProfile(decodedCookie);

  if (isOk == 'ok') {

  return (
    <>

      <video autoPlay muted loop className='fixed w-full h-full object-cover m-0 p-0 box-border -z-10'>
        <source src={'/assets/fondProfil.mp4'} type="video/mp4" />
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
              <Link href={`/home/admin`}>
                <button className={styles.shopbutton}>
                  <div className={styles.defaultbtn}>
                    <span>Produits</span>
                  </div>
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
      <div className="py-0.5">
        <section className="container mx-auto px-0 md:px-0 w-2/4">
          <div className="md:p-0 flex gap-10 items-center">
              {profileInfos && Array.isArray(profileInfos) && profileInfos.map((r: any, i: number) => (
              <div className="p-5 py-10 bg-white bg-opacity-90 text-center transform duration-500 hover:-translate-y-2 rounded-2xl text-black min-h-full w-2/5" key={r.id}>
                <h1 className="text-2xl my-5">Id: {r.id}</h1>
                <h1 className="text-2xl my-5">Username: {r.username}</h1>
                <h1 className="text-2xl my-5">Prénom: {r.firstname}</h1>
                <h1 className="text-2xl my-5">Nom: {r.lastname}</h1>
                <h1 className="text-2xl my-5">Email: {r.email}</h1>
                <h1 className="text-2xl my-5">Role: {r.role_id}</h1>
              </div>
            ))}
            <div className="static">
            <Formik
              initialValues={{
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                role_id: '',
                    }}
              validationSchema={todoSchema}
              onSubmit={async (values) => {
                console.log(values);
                axios.put(`http://127.0.0.1:8000/users/${decodedCookie}`, {
                  data: {
                    username: values.username,
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    password: values.password,
                    role_id: values.role_id,
                  },
                }, {
                  withCredentials: true,
                })
                  .then(response => {
                    if(response.status === 200){
                      
                      if (response.data.notupdated) {
                        setErrorMsg(response.data.notupdated)
                      }
                      else if (response.data.updated) {
                        setErrorMsg(response.data.updated)
                        values.username = "";
                        values.firstname = "";
                        values.lastname = "";
                        values.email = "";
                        values.password = "";
                        values.role_id = "";
                        window.location.reload();
                      }
                    }   
                  });
              }}
            >
              {
                (props) => (
                  <Container className="flex-wrap">
                    <div className={styles.wrapper}>
                      <Form>
                        <a>{errorMsg}</a>
                        <h1>Modifier mon profil</h1>
                        <Field name='username'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.username && form.touched.username}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Username" type="text" className={styles.input} name="username" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.username}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='firstname'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.firstname && form.touched.firstname}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Prénom" type="text" className={styles.input} name="firstname" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.firstname}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='lastname'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.lastname && form.touched.lastname}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Nom" type="text" className={styles.input} name="lastname" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.lastname}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='email'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Email" type="text" className={styles.input} name="email" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.email}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='password'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.password && form.touched.password}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Mot de passe" type="text" className={styles.input} name="password" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.password}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <Field name='role_id'>
                          {({ field, form }: any) => (
                            <FormControl isInvalid={form.errors.role_id && form.touched.role_id}>
                              <div className={styles.inputboxregister}>
                                <Input {...field} placeholder="Role (1 ou 2)" type="text" className={styles.input} name="role_id" />
                                <FormErrorMessage className={styles.formerrormessage}>{form.errors.password}</FormErrorMessage>
                              </div>
                            </FormControl>
                          )}
                        </Field>
                        <div className={styles.buttoncontainer}>
                          <Button type="submit" className={styles.button}>
                            <span className={styles.buttoncontent}>Modifier</span>
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Container>
                )
              }
              </Formik>
              <Formik
                initialValues={{
                }}
                onSubmit={() => {
                  console.log("onsubmit delete")
                  axios.delete(`http://127.0.0.1:8000/users/${decodedCookie}`, {
                    withCredentials: true,
                  })
                    .then(response => {
                      if (response.status === 200) {
                        console.log(response);
                        window.location.href = `http://127.0.0.1:3000/login`;
                      }
                    });
                }}
              >
                {
                  (props) => (
                    <Container className="flex-wrap">
                      <div className={styles.wrapper}>
                        <Form>
                          <a>{errorMsg}</a>
                          <h1>Supprimer mon compte</h1>
                          
                          <div className={styles.buttoncontainer}>
                            <Button type="submit" className={styles.button}>
                              <span className={styles.buttoncontent}>Supprimer</span>
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </Container>
                  )
                }
              </Formik>
            </div>
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
