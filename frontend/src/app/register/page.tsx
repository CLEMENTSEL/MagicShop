"use client"
import axios from 'axios';
import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)
import { FormControl, Input, FormErrorMessage, Button, Container } from '@chakra-ui/react'
import styles from './register.module.css';
  
const todoSchema = Yup.object({
  username: Yup.string().required("Champ obligatoire").min(3, "Le username doit faire au minimum 3 caractères").max(20, "Le username doit faire au maximum 20 caractères").matches(/[a-zA-Z0-9_-]/, 'Seulement les lettres, chiffres et - _ sont autorisées'),
  firstName: Yup.string().required("Champ obligatoire").min(2, "Le prénom doit faire au minimum 2 caractères").max(20, "Le prénom doit faire au maximum 20 caractères").matches(/[a-zA-Z]/, 'Seulement les lettres sont autorisées'),
  lastName: Yup.string().required("Champ obligatoire").min(2, "Le nom doit faire au minimum 2 caractères").max(20, "Le nom doit faire au maximum 20 caractères").matches(/[a-zA-Z]/, 'Seulement les lettres sont autorisées'),
  email: Yup.string().email("L'email doit être valide").required("Champ obligatoire"),
  password: Yup.string().required("Champ obligatoire").min(12, "Le mot de passe doit faire minimum 12 caractères").max(30, "Le mot de passe doit faire maximum 30 caractères")
    .minLowercase(1, "Le mot de passe doit contenir au moins 1 minuscule")
    .minUppercase(1, "Le mot de passe doit contenir au moins 1 majuscule")
    .minNumbers(1, "Le mot de passe doit contenir au moins 1 chiffre")
    .minSymbols(1, "Doit contenir au moins 1 caractère spécial"),
  setPassword: Yup.string().required("Champ obligatoire").min(12, "Le mot de passe doit faire minimum 12 caractères").max(30, "Le mot de passe doit faire maximum 30 caractères")
    .minLowercase(1, "Le mot de passe doit contenir au moins 1 minuscule")
    .minUppercase(1, "Le mot de passe doit contenir au moins 1 majuscule")
    .minNumbers(1, "Le mot de passe doit contenir au moins 1 chiffre")
    .minSymbols(1, "Doit contenir au moins 1 caractère spécial")
})

function RegisterForm() {

  const [errorMsg, setErrorMsg] = useState('');

  return (
    <Formik
      initialValues={{
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        setPassword: '',
      }}
      validationSchema={todoSchema}
      onSubmit={(values) => {
        console.log(values);
        axios.post('http://127.0.0.1:8000/register', {
          data: {
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            setPassword: values.setPassword,
          },
        })
          .then(response => {
            // console.log(response);
            if (response.data.mail) {
              setErrorMsg(response.data.mail)
            } else if (response.data.pswd) {
              setErrorMsg(response.data.pswd)
            } else if (response.data.redirect) {
              window.location.href = response.data.redirect;
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
                  <h1>Créer un compte</h1>
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
                  <Field name='firstName'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.firstName && form.touched.firstName}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Prénom" type="text" className={styles.input} name="firstName" />
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.firstName}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='lastName'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Nom" type="text" className={styles.input} name="lastName" />
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.lastName}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='email'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.email && form.touched.email}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Email" type="email" className={styles.input} name="email" />
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.email}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='password'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.password && form.touched.password}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Mot de passe" type="password" className={styles.input} name="password" />
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.password}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='setPassword'>
                    {({ field, form }: any) => (
                      <FormControl isInvalid={form.errors.setPassword && form.touched.setPassword}>
                        <div className={styles.inputboxregister}>
                          <Input {...field} placeholder="Valider le mot de passe" type="password" className={styles.input} name="setPassword" />
                          <FormErrorMessage className={styles.formerrormessage}>{form.errors.setPassword}</FormErrorMessage>
                        </div>
                      </FormControl>
                    )}
                  </Field>
                  <div className={styles.buttoncontainer}>
                    <Button type="submit" className={styles.button}>
                      <span className={styles.buttoncontent}>Créer</span>
                    </Button>
                  </div>
                  <div className={styles.registerlink}>
                    <a>{errorMsg}</a>
                    <p>Vous avez déjà un compte ? <a href="/login">Se connecter</a></p>
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

export default RegisterForm;