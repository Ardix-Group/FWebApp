/* 
       e                   888 ,e,                 e88~~\                                     
      d8b     888-~\  e88~\888  "  Y88b  /        d888     888-~\  e88~-_  888  888 888-~88e  
     /Y88b    888    d888  888 888  Y88b/         8888 __  888    d888   i 888  888 888  888b 
    /  Y88b   888    8888  888 888   Y88b         8888   | 888    8888   | 888  888 888  8888 
   /____Y88b  888    Y888  888 888   /Y88b        Y888   | 888    Y888   ' 888  888 888  888P 
  /      Y88b 888     "88_/888 888  /  Y88b        "88__/  888     "88_-~  "88_-888 888-_88"  
  📣 Version BETA - Xlator & SkyX [ID FR] - Copyright© 2023                         88   
.
*/

import { signup, login, useAuth } from "./config/FirebaseConfig.js";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import $ from 'jquery';
import { useEffect } from 'react';
import { useState } from "react";
import { useRef } from "react";

export default function Home() {
  const { push } = useRouter();
  const [ loading, setLoading ] = useState(false);
  const currentUser = useAuth();
  if (currentUser) { push('/home'); }
  function showSignupPage() { $("#signup").fadeIn(600); $("#login").hide(); }
  function showLoginPage() { $("#signup").hide(); $("#login").fadeIn(600); }

  useEffect(() => {
    $("#signup").hide(); $("#login").show(); 
  }, []);

  const emailRefLogin = useRef();
  const passwordRefLogin = useRef();
  const emailRefSignup = useRef();
  const passwordRefSignup = useRef();
  const nameRefSignup = useRef();

  async function handleSignup() {
    setLoading(true);
    try {
      await signup(emailRefSignup.current.value, passwordRefSignup.current.value, nameRefSignup.current.value);
    } catch {
      alert("Sorry, but an error has occurred ! Please try again... 🤨");
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRefLogin.current.value, passwordRefLogin.current.value);
    } catch {
      alert("Sorry, but an error has occurred ! Please try again... 🤨");
    }
    setLoading(false);
  }

  function ShowPassword() {
    var x = document.getElementById("pass_one");
    var y = document.getElementById("pass_two");
    if (x.type === "password") { x.type = "text"; } else { x.type = "password"; }
    if (y.type === "password") { y.type = "text"; } else { y.type = "password"; }
  }

  return (
    <>
      <Head>
        <title>Welcome to Ardix !</title>
        <meta name="description" content="We are a company offering services around I.T and technology to innovate in the field of electronics and 3D printing..."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="https://zupimages.net/up/23/13/vzzn.png"/>
      </Head>

      {/* 🎈 Simple App indicator on single page : 🎈 */}
      <div className="ardix_indicator">
        <img src="https://zupimages.net/up/23/13/vzzn.png" alt="app_logo_source"/>
        <div className="whats_new">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <p>What's new on Ardix ? &nbsp;📣</p>
        </div>
      </div>

      <div className="box_page">
        {/* 🔑 Simple login page : 🔑 */}
        <div id="login">
          <h1 className="welcome_title">Welcome back to Ardix ! 👋</h1>
          <p className="welcome_description">Here, the login and registration page to access the official webapp of the project. All your sessions will be recorded via the cookie policy...</p>
          <input className="fleid_input" ref={emailRefLogin} placeholder="Your personnal email..." type="text"/><br/>
          <input className="fleid_input" ref={passwordRefLogin} type="password" id="pass_one" placeholder="Your security password..."/><br/>
          <label><input className="eye_checkbox" type="checkbox" onClick={ShowPassword}/>Show actual password ! 👀</label>
          <button disabled={loading} onClick={handleLogin}>Get started !</button>
          <p className="other_page_link">You do not have an account ? <br/><a onClick={showSignupPage} href="#">Go to the registration page...</a></p>
        </div>

        {/* ⚙ Simple register page : ⚙ */}
        <div id="signup">
          <h1 className="welcome_title">Do you know Ardix ? ✨</h1>
          <p className="welcome_description">Here is the registration page to create a new account with the following form...</p>
          <input className="fleid_input" ref={emailRefSignup} placeholder="Your personnal email..." type="text"/><br/>
          <input className="fleid_input" type="text" ref={nameRefSignup} placeholder="Your first and/or last name..."/>
          <input className="fleid_input" ref={passwordRefSignup} type="password" id="pass_two" placeholder="Your security password..."/><br/>
          <label><input className="eye_checkbox" type="checkbox" onClick={ShowPassword}/>Show actual password ! 👀</label>
          <button disabled={loading} onClick={handleSignup}>Register my account !</button>
          <p className="other_page_link">You do have already an account ? <br/><a onClick={showLoginPage} href="#">Go to the login page...</a></p>
        </div>
      </div>

      <div className="footer_page">Version BETA • Ardix Group • All rights reserved 2023&copy;</div>
    </>
  )
}
