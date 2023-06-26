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

import { useState, useRef } from "react";
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import { signup, login, useAuth } from "../config/FirebaseConfig.js";
import Divider from '@mui/material/Divider';
import $ from 'jquery';
import { changePasswordLink } from "../config/FirebaseConfig.js";

export default function Home() {
  const { push } = useRouter();
  const currentUser = useAuth();
  if (currentUser) { push('/home'); }
  const [loading, setLoading] = useState(false);
  const emailRefLogin = useRef();
  const passwordRefLogin = useRef();
  const emailRefSignup = useRef();
  const passwordRefSignup = useRef();
  const nameRefSignup = useRef();
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const handleCheckboxChangeSignup = () => { setShowPasswordSignup(!showPasswordSignup); };
  const handleCheckboxChangeLogin = () => { setShowPasswordLogin(!showPasswordLogin); };
  const featureNotExist = () => { alert("Sorry but this feature is not yet available ! 😪"); };

  if (typeof document !== 'undefined') {
    $(document).ready(function() {
      $("#login_button_email").on("click", function() {
        $("#signup_box").fadeIn(600);
        $("#login_box").hide();
      });

      $("#back_to_login").on("click", function() {
        $("#signup_box").hide();
        $("#login_box").fadeIn(600);
      });
    });
  } 
  
  async function handleLogin() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await login(emailRefLogin.current.value, passwordRefLogin.current.value);
    } catch {
      alert("Sorry, but an error has occurred ! Please try again... 🤨");
    }
    setLoading(false);
  }

  async function handleSignup() {   
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
     
    if ($("#input1").val() !== $("#input2").val()) {
      alert("Please check that the two passwords entered are the same... 😉");
    } else {
      setLoading(true);
      try {
        await signup(emailRefSignup.current.value, passwordRefSignup.current.value, nameRefSignup.current.value);
      } catch {
        alert("Sorry, but an error has occurred ! Please try again... 🤨");
      }
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    const prompt_email = prompt('📬 • Please enter your email associated with your account :');
    if (prompt_email) {
      changePasswordLink(prompt_email);
    } else {
      return;
    }
  };

  return (
    <>
      <Head>
        <title>Welcome to Ardix !</title>
        <meta name="description" content="We are a company offering services around I.T and technology to innovate in the field of electronics and 3D printing..."/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="https://zupimages.net/up/23/13/vzzn.png"/>
      </Head>

      <div className="main_box">
        <div className="template_design">
          <div className="msg_box">
            <h1>— The real future starts <span>here.</span></h1>
            <p className="description_box">Ardix Group&copy; is the first private company to create a virtual and social world around electronics adapted...</p>
          </div>
        </div>

        <div className="dyn_box">
          <img className="app_logo" src="https://zupimages.net/up/23/13/vzzn.png" alt="project_logo"/>

          <div id="login_box">
            <h1 className="login_title">Hi ! Happy to see you again ! 👋</h1>
            <p className="login_description">This is our login page : to access the full web application, please fill in the following fields.</p>

            <div className="login_form">
              <p className="indicator">Email :</p>
              <input placeholder="JohnDoe@gmail.com" ref={emailRefLogin} type="text" alt="email_field"/><br/><br/>
              <p className="indicator">Password :</p>
              <input placeholder="TheM0stPassword$ecured" className="pass_input" ref={passwordRefLogin} type={showPasswordLogin ? 'text' : 'password'} alt="password_field"/><br/><br/>

              <FormGroup>
                <FormControlLabel control={<Checkbox checked={showPasswordLogin} onChange={handleCheckboxChangeLogin}/>} label="Show your actual password ! 👀"/>
                <FormControlLabel required control={<Checkbox defaultChecked />} label="Accept our Terms of Service and Platform Rules."/>
                <FormControlLabel control={<Checkbox/>} label="Remember me after login ?"/>
              </FormGroup><br/>

              <LoadingButton id="login_button" onClick={handleLogin} loading={loading}>
                <span>Login</span>
              </LoadingButton><br/><br/>

              <p className="indicator">Forgot password ?</p>
              <LoadingButton id="login_button" className="reset_button" onClick={handleForgotPassword}>
                <span>Reset my password ↺</span>
              </LoadingButton>

              <Divider className="divider">OR</Divider>

              <p className="indicator">Don't have an account ?</p>
              <LoadingButton id="login_button_email" loading={loading}>
                <span>Signup with Email &nbsp;→</span>
              </LoadingButton>

              <LoadingButton onClick={featureNotExist} id="google_button">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png" alt="google-logo-app"/>
                <span>Continue with Google</span>
              </LoadingButton>
            </div>
          </div>

          <div id="signup_box">
            <h1 className="signup_title">Hi ! Welcome to Ardix ! 🤗</h1>
            <p className="signup_description">This is our signup page : to create the best account, please fill in the following fields.</p>

            <div className="signup_form">
              <p className="indicator">Your full name (with spaces) :</p>
              <input placeholder="John Doe" ref={nameRefSignup} type="text" alt="email_field"/><br/><br/>
              <p className="indicator">Email :</p>
              <input placeholder="JohnDoe@gmail.com" ref={emailRefSignup} type="text" alt="email_field"/><br/><br/>
              <p className="indicator">Password :</p>
              <input placeholder="TheM0stPassword$ecured" className="pass_input" id="input1" ref={passwordRefSignup} type={showPasswordSignup ? 'text' : 'password'} alt="password_field"/><br/><br/>
              <p className="indicator">Repeat your password :</p>
              <input placeholder="TheM0stPassword$ecured" className="pass_input" id="input2" type={showPasswordSignup ? 'text' : 'password'} alt="password_field"/><br/><br/>

              <FormGroup>
                <FormControlLabel control={<Checkbox checked={showPasswordSignup} onChange={handleCheckboxChangeSignup}/>} label="Show your actual password ! 👀"/>
                <FormControlLabel required control={<Checkbox defaultChecked />} label="Accept our Terms of Service and Platform Rules."/>
              </FormGroup><br/>

              <LoadingButton id="signup_button" onClick={handleSignup} loading={loading}>
                <span>Signup</span>
              </LoadingButton>

              <Divider className="divider">OR</Divider>

              <p className="indicator">You have already an account ?</p>
              <LoadingButton id="back_to_login" loading={loading}>
                <span>←&nbsp; Back to the login page</span>
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
