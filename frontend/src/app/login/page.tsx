"use client"
import axios from 'axios';
import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)
import { FormControl, Input, FormErrorMessage, Button, Container } from '@chakra-ui/react'
import { getCookie, setCookie } from "cookies-next";
import styles from './login.module.css'

const todoSchema = Yup.object({
  email: Yup.string().email("L'email doit être valide").required("Champ obligatoire"),
  password: Yup.string().required("Champ obligatoire").min(12, "Le mot de passe doit faire minimum 12 caractères").max(30, "Le mot de passe doit faire maximum 30 caractères")
    .minLowercase(1, "Le mot de passe doit contenir au moins 1 minuscule")
    .minUppercase(1, "Le mot de passe doit contenir au moins 1 majuscule")
    .minNumbers(1, "Le mot de passe doit contenir au moins 1 chiffre")
    .minSymbols(1, "Doit contenir au moins 1 caractère spécial")
})

function LoginForm() {

  axios.post('http://127.0.0.1:8000/usertype', {
    cookie: {
      access_token: getCookie("access_token"),
    },
  }).then(response => {
    console.log(response)
    if (response.status === 200) {
      if (response.data.ok) {
        return window.location.href = response.data.ok;
      }
    }
  })
    .catch(function (error) {
    });
  
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={todoSchema}
      onSubmit={(values) => {
        console.log(values);
        axios.post('http://127.0.0.1:8000/', {
          data: {
            email: values.email,
            password: values.password,
          },
        })
          .then(response => {
            console.log(response.data.redirect);
            const token = response.data.access_token;
            if (response.status === 200) {
              // console.log(response);
              if (response.data.mail) {
                setErrorMsg(response.data.mail)
              } else if (response.data.pswd) {
                setErrorMsg(response.data.pswd)
              } else {
                setCookie("access_token", token);
                window.location.href = response.data.redirect;
              }
            }
          });
      }}
    >

      {
        (props) => (
          <Container>
            <main className={styles.main}>
              <div className={styles.wrapper}>
                <Form>
                  <h1>Bienvenue</h1>
                  <Field name='email'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.email && form.touched.email}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Email" type="email" className={styles.input} name="email"/>
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.email}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='password'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.password && form.touched.password}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Mot de passe" type="password" className={styles.input} name="password"/>
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.password}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <div className={styles.buttoncontainer}>
                    <Button type="submit" className={styles.button}>
                      <span className={styles.buttoncontent}>Se connecter</span>
                    </Button>
                  </div>
                  <div className={styles.registerlink}>
                    <a>{errorMsg}</a>
                    <p>Pas de compte ? <a href="/register">Créer un compte</a></p>
                  </div>
                </Form>
              </div>
            </main>
          </Container>
        )
      }
    </Formik>
  )
}

export default LoginForm;