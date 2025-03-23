"use client"
import GlassBackground from "@/components/background/glass-background"
import ClaimComponent from "@/components/claims/claims"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        <GlassBackground />
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
          <main className={`relative w-full max-w-6xl mx-auto px-6 py-18 transition-all duration-600 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="relative z-10 text-center lg:text-left">
                <div className="relative inline-block mb-6">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1 rounded-full text-white text-sm font-medium">
                    Insurance Reimagined
                  </span>
                </div>
                
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-slate-800 leading-tight mb-6">
                    Claims information at the 
                    <span className="relative inline-block">
                      <span className="relative z-10"> speed of conversation</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200/60 -rotate-1 rounded-sm"></span>
                    </span>.
                  </h1>
                  
                  <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                    Where AI meets insurance for instant claim answers, without the wait 
                    or frustration of traditional service.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                    <Link 
                      href="/chat" 
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Start a Conversation
                    </Link>
                    
                    <Link 
                      href="#about" 
                      className="px-8 py-3 bg-white/80 hover:bg-white text-slate-800 rounded-full font-medium border border-slate-200 shadow-sm hover:shadow transition-all duration-300"
                    >
                      Learn More
                    </Link>
                  </div>
                  
                  <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br ${
                          i === 1 ? 'from-blue-400 to-blue-600' :
                          i === 2 ? 'from-indigo-400 to-indigo-600' :
                          i === 3 ? 'from-purple-400 to-purple-600' :
                          'from-pink-400 to-pink-600'
                        }`}></div>
                      ))}
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">500+</span> satisfied customers
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Illustration/Feature Cards */}
              <div className="relative z-10 hidden lg:block">
                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100/40 rounded-full filter blur-3xl"></div>
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-100/40 rounded-full filter blur-3xl"></div>
                  
                  <div className="relative grid grid-cols-2 gap-4">
                    {[
                      { title: "Instant Answers", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                      { title: "AI Powered", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                      { title: "24/7 Service", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                      { title: "Secure & Private", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                    ].map((card, index) => (
                      <div key={index} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{card.title}</h3>
                        <p className="text-sm text-slate-600">Experience the future of insurance claims processing.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-20 pt-10 border-t border-slate-200/60">
              <p className="text-sm text-slate-500 mb-6 text-center">Trusted by leading insurance providers</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-28 bg-slate-200/70 rounded-md shadow-sm"></div>
                ))}
              </div>
            </div>
          </main>
        </section>

        {/* How It Works Section */}
        <section id="about" className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">How It Works</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our AI-powered platform simplifies insurance claims with a conversational interface that gives you answers in seconds.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Ask a Question",
                  description: "Type your insurance claim question in natural language, just like you're talking to a human agent.",
                  icon: "M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
                  step: "01"
                },
                {
                  title: "AI Processes Your Query",
                  description: "Our sophisticated AI analyzes your question and searches through policy information to find the right answer.",
                  icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                  step: "02"
                },
                {
                  title: "Get Instant Results",
                  description: "Receive clear, accurate answers in seconds, with references to policy details and next steps if needed.",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  step: "03"
                }
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your insurance experience?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join hundreds of satisfied customers who have simplified their insurance claims process with our AI-powered solution.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/chat" 
                className="px-8 py-4 bg-white text-indigo-600 hover:bg-blue-50 rounded-full font-medium shadow-lg shadow-indigo-700/30 transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Start Your Experience
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-white text-lg mb-4">Claim Beaver</h3>
                <p className="mb-4">Revolutionizing insurance claims through AI-powered conversations.</p>
                <div className="flex space-x-4">
                  {['M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
                  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
                  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 L12,13 L2,6'].map((path, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
              
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Testimonials", "FAQ"]
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"]
                },
                {
                  title: "Resources",
                  links: ["Blog", "Documentation", "Support Center", "Contact Us"]
                }
              ].map((col, i) => (
                <div key={i}>
                  <h3 className="font-bold text-white text-lg mb-4">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.links.map((link, j) => (
                      <li key={j}><a href="#" className="hover:text-blue-400 transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
              <p>© 2025 Claim Beaver. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}