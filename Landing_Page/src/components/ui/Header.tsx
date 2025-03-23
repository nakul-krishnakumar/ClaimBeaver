import Image from "next/image";

const Header = () => {
  return (
    <header className="header">
        <div className="logo">
            <div className="mt-3">
                <Image src={"/logo.png"} width={80} height={80} alt="beaver"/>
            </div>
            <div>
                <h1 className="logo-text">ClaimBeaver</h1>
                <h1 className="logo-text_stroke">ClaimBeaver</h1>
            </div>
        </div>
        <div className="auth-btns-wrapper">
            <div className="relative">
                <button className="login-btn_stroke"></button>
                <button className="login-btn">Login</button>
            </div>
            <div className="relative">
                <button className="signup-btn_stroke"></button>
                <button className="signup-btn">Signup</button>
            </div>
        </div>
    </header>
  )
}

export default Header;