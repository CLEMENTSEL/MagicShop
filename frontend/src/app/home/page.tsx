"use client"
import { getCookie } from "cookies-next";
import axios from 'axios';
import React, { useEffect } from 'react';

function redirection()
{
  const access_token = getCookie("access_token");
  useEffect(() => {

  axios.post('http://127.0.0.1:8000/usertype', {
    cookie: {
      access_token: getCookie("access_token"),
    },
  }).then(response => {
    if (response.status === 200) {
      if (response.data.ok) {
        if (response.data.user) {
          window.location.href = 'http://127.0.0.1:3000/home/products';
        }
        else if (response.data.admin) {
          window.location.href = 'http://127.0.0.1:3000/home/admin';
        }
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
    window.location.href = 'http://127.0.0.1:3000/login';
  }

  return (
    <video autoPlay muted loop className='fixed w-full h-full object-cover m-0 p-0 box-border -z-10'>
      <source src={'/assets/fond.mp4'} type="video/mp4" />
    </video>
  );
}

export default redirection;