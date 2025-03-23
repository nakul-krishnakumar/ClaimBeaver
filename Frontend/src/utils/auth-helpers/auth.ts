import axios from "axios";
import { supabase } from "./brower-connector"

export interface User {
    dependent_name: string;
    dependent_address: string;
    dependent_contact: string;
    member_name: string;
    member_email: string;
    date_of_birth: string;
    gender: string;
    phone_number: string;
    address: string;
    member_effective_start_date: string;
    member_effective_end_date: string;
    password: string;
}

export async function signUpNewUser(User: User) {
    try{
        const { error } = await supabase.auth.signUp({
            email: User.member_email,
            password: User.password
        })
        if (error) {
            console.error('Error:', error)
            return
        }
        const res = await axios.post('/api/auth/register', User)
        if (!res){
            console.log('Error:', res)
            return
        }
    }
    catch(e){
        console.log(e)
    }
}

export async function signIn(email: string, password: string) {
    try{
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            console.error('Error:', error)
            return
        }
    }
    catch(e){
        console.log(e)
    }
}


export async function signOut(){
    try{
        const {data,error} = await supabase.auth.getUser();
        await supabase.auth.signOut();
        if(error){
            console.error('Error:', error)
            return
        }
        console.log('Data:', data)
    }
    catch(e){
        console.log(e)
    }
}