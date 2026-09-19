"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google signup error:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Registration failed!");
        setIsLoading(false);
      }
    } catch (err) {
      alert("Something went wrong during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <form className="form" onSubmit={handleSignup}>
        <div className="title">Create Account</div>
        
        <div className="flex-column">
          <label>Full Name</label>
        </div>
        <div className="inputForm">
          <input 
            type="text" 
            className="input" 
            placeholder="Enter your Name" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your Email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      
        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input 
            type="password" 
            className="input" 
            placeholder="Create a Password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="button-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="p">Already have an account? <Link href="/login" className="span">Log In</Link></p>
        <p className="p line">Or With</p>

        <div className="buttons-container">
          <button type="button" className="btn google" onClick={handleGoogleSignup}>
            <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path style={{fill:'#FBBB00'}} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256 c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456 C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
              <path style={{fill:'#518EF8'}} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451 c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535 c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"></path>
              <path style={{fill:'#28B446'}} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512 c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771 c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
              <path style={{fill:'#F14336'}} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012 c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0 C318.115,0,375.068,22.126,419.404,58.936z"></path>
            </svg>
            Google
          </button>
        </div>
      </form>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          min-height: 100vh;
          width: 100%;
        }
      `}</style>

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f4f6f8;
          padding: 20px;
          box-sizing: border-box;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: #ffffff;
          padding: 30px;
          width: 50%;
          max-width: 500px;
          border-radius: 20px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 30px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .form {
            width: 90% !important;
          }
        }

        .title {
          text-align: center;
          margin: 0 0 15px 0;
          font-size: 26px;
          font-weight: 800;
          color: #111;
        }

        .flex-column > label {
          color: #151717;
          font-weight: 600;
          font-size: 14px;
        }

        .inputForm {
          border: 1.5px solid #ecedec;
          border-radius: 10px;
          height: 48px;
          display: flex;
          align-items: center;
          padding-left: 12px;
          transition: 0.2s ease-in-out;
        }

        .input {
          margin-left: 10px;
          border-radius: 10px;
          border: none;
          width: 85%;
          height: 100%;
          font-size: 14px;
          outline: none;
          background: transparent;
        }

        .inputForm:focus-within {
          border: 1.5px solid #2d79f3;
        }

        .span {
          font-size: 14px;
          color: #2d79f3;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
        }

        .button-submit {
          margin: 15px 0 5px 0;
          background-color: #151717;
          border: none;
          color: white;
          font-size: 15px;
          font-weight: 500;
          border-radius: 10px;
          height: 48px;
          width: 100%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .button-submit:hover {
          background-color: #252727;
        }

        .p {
          text-align: center;
          color: black;
          font-size: 14px;
          margin: 5px 0;
        }

        .line {
          margin: 10px 0;
          color: #747474;
          font-size: 13px;
        }

        .buttons-container {
          width: 100%;
        }

        .btn {
          width: 100%;
          height: 48px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 500;
          gap: 10px;
          border: 1px solid #ededef;
          background-color: white;
          cursor: pointer;
          transition: 0.2s ease-in-out;
        }

        .btn:hover {
          border: 1px solid #2d79f3;
        }
      `}</style>
    </div>
  );
}