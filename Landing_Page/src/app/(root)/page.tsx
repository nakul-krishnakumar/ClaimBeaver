import { ArrowUpRight, Globe } from "lucide-react";

const Home = () => {
  return (
    <>
      <main className="main-intro relative z-10">
        <div className="relative">
          <h1 className="main-slogan">Claims information at the<br/> speed of conversation.</h1>
          <h1 className="main-slogan_stroke">Claims information at the<br/> speed of conversation.</h1>
          <h4 className="sub-slogan">Where AI meets insurance for instant claim answers, without the wait or frustration of traditional service.</h4>
        </div>
        <div className="main-btns">
            <div className="relative">
                <button className="start-chat-btn_stroke"></button>
                <button className="start-chat-btn">
                    <span>Start Chat</span>
                    <ArrowUpRight size={20}/>
                </button>
            </div>
            <div className="relative">
                <button className="discover-more-btn_stroke"></button>
                <button className="discover-more-btn">
                    <span>Discover More</span>
                    <Globe size={18}/>
                </button>
            </div>
        </div>
      </main>
    </>
  )
}

export default Home;